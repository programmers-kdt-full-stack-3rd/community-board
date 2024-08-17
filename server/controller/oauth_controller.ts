import { Request, Response, NextFunction } from "express";
import { createOAuthConnection } from "../db/context/oauth_context";
import { addRefreshToken } from "../db/context/token_context";
import { addOAuthUser, readUserByOAuth } from "../db/context/users_context";
import { ServerError } from "../middleware/errors";
import { getKstNow } from "../utils/getKstNow";
import { oAuthProps, TOAuthProvider } from "../utils/oauth/constants";
import {
	buildLoginUrl,
	buildTokenFetchOptions,
	getOAuthAccountId,
} from "../utils/oauth/oauth";
import { makeAccessToken, makeRefreshToken } from "../utils/token";

interface IOAuthTokens {
	token_type: string;
	access_token: string;
	id_token?: string;
	expires_in: number;
	refresh_token: string;
	refresh_token_expires_in?: number;
	scope?: string;
}

export const handleOAuthLoginUrlRead = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const provider = req.params.provider as TOAuthProvider;
		const { loginUrl } = buildLoginUrl(provider);

		res.status(200).json({ url: loginUrl });
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

		// Authorization Code로 Access Token 요청
		const oAuthTokenResponse = await fetch(
			oAuthProps[provider].requestEndpoint.token,
			buildTokenFetchOptions(provider, authorizationCode)
		);

		if (oAuthTokenResponse.status >= 500) {
			throw ServerError.etcError(
				500,
				"소셜 로그인 서비스 제공사 오류로 로그인에 실패했습니다."
			);
		} else if (oAuthTokenResponse.status >= 400) {
			throw ServerError.badRequest(
				"인가 코드가 유효하지 않아서 소셜 로그인에 실패했습니다."
			);
		}

		const oAuthTokens = (await oAuthTokenResponse.json()) as IOAuthTokens;

		// Access Token으로 회원 정보를 요청
		const oAuthUserResponse = await fetch(
			oAuthProps[provider].requestEndpoint.user,
			{
				headers: {
					Authorization: `Bearer ${oAuthTokens.access_token}`,
					"Content-type":
						"application/x-www-form-urlencoded;charset=utf-8",
				},
			}
		);
		const oAuthUser = await oAuthUserResponse.json();

		// 회원번호를 확인하여 유저 조회
		const oAuthAccountId = getOAuthAccountId(provider, oAuthUser);
		let user = await readUserByOAuth(provider, oAuthAccountId);

		// TODO: 회원 등록부터 리프레시 토큰 등록까지의 동작에 트랜잭션 적용
		//       (회원 등록 이후 과정이 실패했을 때 변경사항 롤백 필요)

		// 유저가 존재하지 않으면 신규 회원가입 처리(랜덤 닉네임 부여)
		if (!user) {
			// TODO: 자연스러운 닉네임 생성
			const nickname =
				"신규 " +
				(0x1000000 * Math.random()).toString(16).padStart(6, "0");

			const newUserId = await addOAuthUser(nickname);
			await createOAuthConnection(provider, newUserId, oAuthAccountId);

			user = {
				nickname,
				id: newUserId,
				isDelete: false,
			};
		}

		if (!user.id || !user.nickname) {
			throw new Error();
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
