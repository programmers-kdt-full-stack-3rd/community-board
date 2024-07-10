import { Request, Response, NextFunction } from "express";
import {
  makeAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/token";
import { TokenExpiredError } from "jsonwebtoken";
import { ServerError } from "./errors";

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
        next();
      } catch (err: any) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        next(err);
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
