import { Request, Response, NextFunction } from "express";

export class ServerError extends Error {
  code: number;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
  static badRequest(message: string) {
    let errorMsg = `Bad Request: ${message}`;
    return new ServerError(400, errorMsg);
  }
  static unauthorized(message: string) {
    let errorMsg = `Unauthorized: ${message}`;
    return new ServerError(401, errorMsg);
  }
  static forbidden(message: string) {
    let errorMsg = `Forbidden: ${message}`;
    return new ServerError(403, errorMsg);
  }
  static notFound(message: string) {
    let errorMsg = `NotFound: ${message}`;
    return new ServerError(404, errorMsg);
  }
  static reference(message: string) {
    let errorMsg = `Reference Error: ${message}`;
    return new ServerError(500, errorMsg);
  }
  static etcError(code: number, message: string) {
    let errorMsg = `Unknown Error: ${message}`;
    return new ServerError(code, errorMsg);
  }
  static expiredToken(message: string) {
    let errorMsg = `Expired Token: ${message}`;
    return new ServerError(401, errorMsg);
  }
  static tokenError(message: string) {
    let errorMsg = `Token Error: ${message}`;
    return new ServerError(401, errorMsg);
  }
}

export const errorHandler = (
  err: ServerError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let data = {
    message: "",
  };

  if (err instanceof ServerError) {
    data.message = err.message;
    res.status(err.code).json(data);
  } else {
    data.message = "Undefined Error:" + err.name + err.message;
    res.status(500).json(data);
  }
};
