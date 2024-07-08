import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ServerError } from "./errors";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const err = validationResult(req);
  if (err.isEmpty()) {
    return next();
  }
  return next(ServerError.badRequest(err.array()[0].msg));
};
