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
      throw ServerError.reference("회원가입 실패");
    }
  } catch (err: any) {
    next(err);
  }
};
