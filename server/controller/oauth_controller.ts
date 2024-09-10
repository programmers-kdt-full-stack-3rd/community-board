import { Request, Response, NextFunction } from "express";
import {
	createOAuthConnection,
	deleteOAuthConnection,
	readOAuthConnections,
	updateOAuthRefreshToken,
} from "../db/context/oauth_context";
import { addRefreshToken } from "../db/context/token_context";
import {
	addOAuthUser,
	getUserById,
	readUserByOAuth,
} from "../db/context/users_context";
import { TOAuthProvider } from "shared";
import { getKstNow } from "../utils/getKstNow";
import { ServerError } from "../middleware/errors";
import {
	buildLoginUrl,
	refreshOAuthAccessToken,
	revokeOAuth,
	TOAuthLoginType,
	verifyAuthorizationCode,
} from "../utils/oauth/oauth";
import {
	makeAccessToken,
	makeRefreshToken,
	makeTempToken,
} from "../utils/token";

export const handleOAuthUrlReadFor =
	(loginType: TOAuthLoginType) =>
	(req: Request, res: Response, next: NextFunction) => {
		try {
			const provider = req.params.provider as TOAuthProvider;
			const { [loginType]: url } = buildLoginUrl(provider);

			res.status(200).json({ url });
		} catch (err) {
			next(err);
		}
	};

export const handleOAuthLogin = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const provider = req.body.provider as TOAuthProvider;
		const authorizationCode = req.body.code as string;

		const { oAuthAccountId, oAuthRefreshToken } =
			await verifyAuthorizationCode(provider, authorizationCode);
		let user = await readUserByOAuth(provider, oAuthAccountId);

		// TODO: 회원 등록부터 리프레시 토큰 등록까지의 동작에 트랜잭션 적용
		//       (회원 등록 이후 과정이 실패했을 때 변경사항 롤백 필요)

		if (user && oAuthRefreshToken) {
			await updateOAuthRefreshToken(
				provider,
				oAuthAccountId,
				oAuthRefreshToken
			);
		} else if (!user) {
			// 유저가 존재하지 않으면 신규 회원가입 처리(랜덤 닉네임 부여)
			// TODO: 자연스러운 닉네임 생성
			const nickname =
				"신규 " +
				Math.floor(0x1000000 * Math.random())
					.toString(16)
					.padStart(6, "0");

			const newUserId = await addOAuthUser(nickname);
			await createOAuthConnection(
				provider,
				newUserId,
				oAuthAccountId,
				oAuthRefreshToken
			);

			user = {
				nickname,
				id: newUserId,
				isDelete: false,
			};
		}

		if (!user.id || !user.nickname) {
			throw ServerError.reference("사용자 정보 오류");
		}

		// 토큰 발급
		const accessToken = makeAccessToken(user.id);
		const refreshToken = makeRefreshToken(user.id);
		await addRefreshToken(
			user.id,
			refreshToken,
			new Date(Date.now() + 1000 * 60 * 60 * 24)
		);

		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: true,
		});

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: true,
		});

		// 로그인 정보 응답
		res.status(200).json({
			message: "로그인 성공",
			result: {
				nickname: user.nickname,
				loginTime: getKstNow(),
			},
		});
	} catch (err) {
		next(err);
	}
};

export const handleOAuthReconfirm = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const provider = req.body.provider as TOAuthProvider;
		const authorizationCode = req.body.code as string;

		const { oAuthAccountId, oAuthRefreshToken } =
			await verifyAuthorizationCode(provider, authorizationCode);
		let userByOAuth = await readUserByOAuth(provider, oAuthAccountId);

		if (!userByOAuth || userByOAuth.id !== req.userId) {
			throw ServerError.unauthorized(
				"로그인한 유저와 연동하지 않은 소셜 계정입니다."
			);
		} else if (!userByOAuth.id || !userByOAuth.nickname) {
			throw ServerError.reference("사용자 정보 오류");
		} else if (userByOAuth.email) {
			throw ServerError.badRequest(
				"이메일, 비밀번호를 등록한 계정은 비밀번호 재확인으로 인증해야 합니다."
			);
		}

		if (oAuthRefreshToken) {
			await updateOAuthRefreshToken(
				provider,
				oAuthAccountId,
				oAuthRefreshToken
			);
		}

		const tempToken = makeTempToken(userByOAuth.id);
		res.cookie("tempToken", tempToken, { maxAge: 1000 * 60 * 60 }); // 유효기간 1시간

		res.status(200).json({ message: "소셜 계정 확인 성공" });
	} catch (err) {
		next(err);
	}
};

export const handleOAuthLinkCreate = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const provider = req.body.provider as TOAuthProvider;
		const authorizationCode = req.body.code as string;

		const { oAuthAccountId, oAuthRefreshToken } =
			await verifyAuthorizationCode(provider, authorizationCode);
		let userByOAuth = await readUserByOAuth(provider, oAuthAccountId);

		if (userByOAuth) {
			throw ServerError.badRequest("이미 연동한 소셜 계정입니다.");
		}

		const oAuthConnections = await readOAuthConnections(req.userId);
		const isProviderLinked = oAuthConnections.find(
			({ oauth_provider_name }) => oauth_provider_name === provider
		);
		if (isProviderLinked) {
			throw ServerError.badRequest(
				"같은 서비스의 다른 소셜 계정을 이미 연동한 상태입니다."
			);
		}

		await createOAuthConnection(
			provider,
			req.userId,
			oAuthAccountId,
			oAuthRefreshToken
		);

		res.status(200).json({ message: "소셜 계정 연동 성공" });
	} catch (err) {
		next(err);
	}
};

export const handleOAuthLinkDelete = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const provider = req.params.provider as TOAuthProvider;

		// 1. 유저 정보와 소셜 로그인 연동 정보 조회
		const user = await getUserById(req.userId);
		const oAuthConnections = await readOAuthConnections(req.userId);

		// 2. 지정한 프로바이더로의 연동 여부 확인
		//    - 연동이 없으면 오류
		const connectionToProvider = oAuthConnections.find(
			({ oauth_provider_name }) => oauth_provider_name === provider
		);
		if (!connectionToProvider) {
			throw ServerError.notFound(
				"해당 서비스와 소셜 로그인을 연동하지 않았습니다."
			);
		}

		// 3. 이메일 등록 여부 + 소셜 연동 개수 확인
		//    - 이메일 등록이 없는데 소셜 연동 개수가 1개면 오류 (회원탈퇴 기능을 사용해야 함)
		const isEmailRegistered = user.email && user.password && user.salt;
		if (!isEmailRegistered && oAuthConnections.length === 1) {
			throw ServerError.badRequest(
				"이메일 등록이 없으므로 마지막 마지막 소셜 연동을 해제할 수 없습니다."
			);
		}

		// 4. 지정한 프로바이더로의 연동 해제 처리
		const { oAuthAccessToken } = await refreshOAuthAccessToken(
			connectionToProvider.oauth_provider_name,
			connectionToProvider.oauth_refresh_token
		);
		await revokeOAuth(
			connectionToProvider.oauth_provider_name,
			oAuthAccessToken
		);

		// 5. DB에도 반영
		await deleteOAuthConnection(provider, req.userId);

		res.status(200).json({ message: "소셜 계정 연동 해제 성공" });
	} catch (err) {
		next(err);
	}
};
