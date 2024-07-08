import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ServerError } from "../middleware/errors";

dotenv.config();
export const makeAccessToken = async (userId: number) => {
  const key = process.env.ACCESS_TOKEN_KEY;
  if (key) {
    const token = jwt.sign({ userId }, key, { expiresIn: "1h" });
    return token;
  } else {
    throw ServerError.reference("키가 없습니다.");
  }
};

export const makeRefreshToken = async (userId: number) => {
  const key = process.env.REFRESH_TOKEN_KEY;
  if (key) {
    const token = jwt.sign({ userId }, key, { expiresIn: "1d" });
    return token;
  } else {
    throw ServerError.reference("키가 없습니다.");
  }
};
