import { Request, Response, NextFunction } from "express";
import { addUser, authUser, updateUser } from "../db/context/users_context";
import { ServerError } from "../middleware/errors";
import { deleteRefreshToken } from "../db/context/token_context";

export const registerUser = async (
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

    const result = await addUser(values);
    if (result.affectedRows === 1) {
      res.status(201).json({ message: "회원가입 성공" });
    } else {
      throw ServerError.reference("회원가입 실패");
    }
  } catch (err: any) {
    next(err);
  }
};

export const loginUser = async (
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

    res.status(200).json({ message: "로그인 성공" });
  } catch (err: any) {
    next(err);
  }
};

export const logoutUser = async (
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

export const updateUserInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const values = {
      nickname: req.body.nickname,
      password: req.body.password,
      userId: req.userId,
    };

    await updateUser(values);
    res.status(200).json({ message: "회원정보 수정 성공" });
  } catch (err: any) {
    next(err);
  }
};
