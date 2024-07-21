import { Request, Response, NextFunction } from "express";
import {
  makeAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
  verifyTempToken,
} from "../utils/token";
import { TokenExpiredError } from "jsonwebtoken";
import { ServerError } from "./errors";
import { isUserDeleted } from "../db/context/users_context";

export const authToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      const e = new Error("Access Token이 없습니다.");
      e.name = "Unauthorized";
      throw e;
    }
    //Access token 검증 로직
    const jwtPayload = verifyAccessToken(accessToken);

    if (await isUserDeleted({ userId: jwtPayload.userId })) {
      throw ServerError.badRequest("탈퇴한 회원입니다.");
    }
    req.userId = jwtPayload.userId;
    next();
  } catch (err: any) {
    if (err instanceof TokenExpiredError || err.name === "Unauthorized") {
      try {
        const cookies = req.cookies;
        const refreshToken = cookies.refreshToken;
        if (err.name === "Unauthorized") {
          if (!refreshToken) {
            return next();
          }
        }

        //Refresh token 검증 로직
        const jwtPayload = await verifyRefreshToken(refreshToken);
        const userId = jwtPayload.userId;

        //새로운 access token 발급
        const newAccessToken = makeAccessToken(userId);
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: true,
        });

        req.userId = userId;
        next();
      } catch (err: any) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        next(ServerError.expiredToken("토큰이 만료 되었습니다."));
      }
    } else {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      next(err);
    }
  }
};

export const requireLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.userId ? next() : next(ServerError.unauthorized("로그인이 필요합니다."));
};

export const requirePassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tempToken = req.cookies.tempToken;
  if (!tempToken) {
    throw ServerError.unauthorized("비밀번호 확인이 필요합니다.");
  }
  const userId = verifyTempToken(tempToken).userId;
  res.clearCookie("tempToken");

  if (req.userId !== userId) {
    throw ServerError.forbidden("인증 정보가 일치하지 않습니다.");
  }

  next();
};
