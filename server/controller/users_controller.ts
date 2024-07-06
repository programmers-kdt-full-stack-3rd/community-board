import { Request, Response, NextFunction } from "express";
import { addUser } from "../db/context/users_context";
import { ServerError } from "../middleware/errors";

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
      next(ServerError.reference("회원가입 실패"));
    }
  } catch (err: any) {
    if (err.code === "ER_DUP_ENTRY") {
      next(ServerError.badRequest("이미 존재하는 이메일 주소입니다."));
    }
  }
};
