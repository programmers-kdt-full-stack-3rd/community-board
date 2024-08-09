import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import dotenv from "dotenv";
import { ServerError } from "../middleware/errors";
import { getRefreshToken } from "../db/context/token_context";

dotenv.config();

interface IToken extends jwt.JwtPayload {
	userId: number;
}

export const makeAccessToken = (userId: number) => {
	const key = process.env.ACCESS_TOKEN_KEY;
	if (key) {
		const token = jwt.sign({ userId }, key, { expiresIn: "1h" });
		return token;
	} else {
		throw ServerError.reference("키가 없습니다.");
	}
};

export const makeRefreshToken = (userId: number) => {
	const key = process.env.REFRESH_TOKEN_KEY;
	if (key) {
		const token = jwt.sign({ userId }, key, { expiresIn: "1d" });
		return token;
	} else {
		throw ServerError.reference("키가 없습니다.");
	}
};

export const makeTempToken = (userId: number) => {
	const key = process.env.TEMP_TOKEN_KEY;
	if (!key) throw ServerError.reference("키가 없습니다.");
	const token = jwt.sign({ userId }, key, { expiresIn: "1h" }); // 유효기간 1시간
	return token;
};

export const verifyAccessToken = (token: string) => {
	try {
		const key = process.env.ACCESS_TOKEN_KEY;
		if (!key) {
			throw ServerError.reference("키가 없습니다.");
		}
		const verifiedToken = jwt.verify(token, key) as IToken;
		return verifiedToken;
	} catch (err: any) {
		if (err instanceof TokenExpiredError) {
			throw err;
		} else if (err instanceof JsonWebTokenError) {
			throw ServerError.tokenError("검증되지 않은 토큰 입니다.");
		} else {
			throw err;
		}
	}
};

export const verifyRefreshToken = async (token: string) => {
	try {
		const key = process.env.REFRESH_TOKEN_KEY;
		if (key) {
			const verifiedToken = jwt.verify(token, key) as IToken;
			const userId = verifiedToken.userId;
			await getRefreshToken(userId, token);
			return verifiedToken;
		} else {
			throw ServerError.reference("키가 없습니다.");
		}
	} catch (err: any) {
		if (err instanceof TokenExpiredError) {
			throw ServerError.unauthorized("로그인이 필요합니다.");
		} else if (err instanceof JsonWebTokenError) {
			throw ServerError.tokenError("검증되지 않은 토큰 입니다.");
		} else {
			throw err;
		}
	}
};

export const verifyTempToken = (token: string) => {
	try {
		const key = process.env.TEMP_TOKEN_KEY;
		if (!key) {
			throw ServerError.reference("키가 없습니다.");
		}
		const verifiedToken = jwt.verify(token, key) as IToken;
		return verifiedToken;
	} catch (err: any) {
		if (err instanceof TokenExpiredError) {
			throw ServerError.unauthorized("비밀번호 확인이 필요합니다.");
		} else if (err instanceof JsonWebTokenError) {
			throw ServerError.tokenError("검증되지 않은 토큰 입니다.");
		} else {
			throw err;
		}
	}
};
