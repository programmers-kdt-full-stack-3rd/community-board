import { Request, Response, NextFunction } from "express";
import {
  addUser,
  authUser,
  deleteUser,
  getUserById,
  updateUser,
} from "../db/context/users_context";
import { ServerError } from "../middleware/errors";
import { deleteRefreshToken } from "../db/context/token_context";
import { makeTempToken } from "../utils/token";
import { makeHashedPassword } from "../utils/crypto";

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

    const KR_TIME_DIFF = 9 * 60 * 60 * 1000; // 9시간

    const time = new Date(Date.now() + KR_TIME_DIFF)
      .toISOString()
      .replace("Z", "+09:00"); // 한국 시간임을 나타내기위한 표준 시간대 지정자 변경

    res.status(200).json({
      message: "로그인 성공",
      result: {
        nickname: result.user.nickname,
        loginTime: time,
        isLogin: true,
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

export const handleUpdateUser = async (
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

export const handleDeleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    await deleteUser(userId);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    await deleteRefreshToken(userId);
    res.status(200).json({ message: "회원탈퇴 성공" });
  } catch (err: any) {
    next(err);
  }
};
