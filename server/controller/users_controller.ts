import { Request, Response, NextFunction } from "express";
import {
	clearOAuthConnection,
	readOAuthConnections,
} from "../db/context/oauth_context";
import {
	addUser,
	authUser,
	deleteUser,
	getUserById,
	registerUserEmail,
	updateUser,
} from "../db/context/users_context";
import { ServerError } from "../middleware/errors";
import { deleteRefreshToken } from "../db/context/token_context";
import { makeTempToken } from "../utils/token";
import { makeHashedPassword } from "../utils/crypto";
import { getKstNow } from "../utils/getKstNow";
import { refreshOAuthAccessToken, revokeOAuth } from "../utils/oauth/oauth";

export const handleJoinUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const values = {
			email: req.body.email,
			password: req.body.password,
			nickname: req.body.nickname,
		};

		await addUser(values);
		res.status(201).json({ message: "회원가입 성공" });
	} catch (err: any) {
		next(err);
	}
};

export const handleLoginUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const values = {
			email: req.body.email,
			password: req.body.password,
		};

		const result = await authUser(values);

		res.cookie("accessToken", result.accessToken, {
			httpOnly: true,
			secure: true,
		});

		res.cookie("refreshToken", result.refreshToken, {
			httpOnly: true,
			secure: true,
		});

		res.status(200).json({
			message: "로그인 성공",
			result: {
				nickname: result.user.nickname,
				loginTime: getKstNow(),
				email: result.user.email,
				imgUrl: result.user.imgUrl,
			},
		});
	} catch (err: any) {
		next(err);
	}
};

export const handleLogoutUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const refreshToken = req.cookies.refreshToken;
		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");
		await deleteRefreshToken(req.userId, refreshToken);

		res.status(200).json({ message: "로그아웃 성공" });
	} catch (err: any) {
		next(err);
	}
};

export const handleReadUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = req.userId;

		const user = await getUserById(req.userId);
		const oAuthConnections = await readOAuthConnections(userId);

		res.status(200).json({
			email: user.email,
			nickname: user.nickname,
			connected_oauth: oAuthConnections.map(
				({ oauth_provider_name }) => oauth_provider_name
			),
		});
	} catch (err: any) {
		next(err);
	}
};

export const handleUpdateUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const values = {
			email: req.body.email as string | undefined,
			nickname: req.body.nickname as string,
			password: req.body.password as string,
			userId: req.userId,
		};

		const currentUser = await getUserById(values.userId);

		if (currentUser.email && values.email) {
			throw ServerError.badRequest(
				"한번 등록한 이메일은 변경할 수 없습니다."
			);
		} else if (!currentUser.email && !values.email) {
			throw ServerError.badRequest(
				"소셜 로그인으로 가입한 유저는 최초 정보 수정 시 이메일을 등록해야 합니다."
			);
		}

		if (currentUser.email) {
			const newHashedPassword = await makeHashedPassword(
				values.password,
				currentUser.salt
			);

			if (currentUser.password === newHashedPassword) {
				throw ServerError.badRequest("비밀번호가 현재와 동일합니다.");
			}

			await updateUser(values);
		} else {
			await registerUserEmail(values);
		}

		res.status(200).json({ message: "회원정보 수정 성공" });
	} catch (err: any) {
		next(err);
	}
};

export const handleCheckPassword = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const password = req.body.password;
		const userId = req.userId;
		const user = await getUserById(userId);

		const hashedPassword = await makeHashedPassword(password, user.salt);
		if (user.password !== hashedPassword) {
			throw ServerError.badRequest("비밀번호가 틀렸습니다.");
		}

		const tempToken = makeTempToken(userId);

		res.cookie("tempToken", tempToken, { maxAge: 1000 * 60 * 60 }); // 유효 기간 1시간

		res.status(200).json({ message: "비밀번호 확인 성공" });
	} catch (err: any) {
		next(err);
	}
};

export const handleCheckNickname = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const newNickname = req.body.nickname;
		const userId = req.userId;
		const user = await getUserById(userId);

		res.status(200).json({ isDuplicated: user.nickname === newNickname });
	} catch (err: any) {
		next(err);
	}
};

export const handleDeleteUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = req.userId;
		const oAuthConnections = await readOAuthConnections(userId);

		if (oAuthConnections.length > 0) {
			for (const connection of oAuthConnections) {
				const { oAuthAccessToken } = await refreshOAuthAccessToken(
					connection.oauth_provider_name,
					connection.oauth_refresh_token
				);

				await revokeOAuth(
					connection.oauth_provider_name,
					oAuthAccessToken
				);
			}

			await clearOAuthConnection(userId);
		}

		await deleteRefreshToken(userId);
		await deleteUser(userId);

		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");

		res.status(200).json({ message: "회원탈퇴 성공" });
	} catch (err: any) {
		next(err);
	}
};
