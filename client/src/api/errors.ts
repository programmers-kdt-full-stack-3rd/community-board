import { isTokenError } from "./users/utils";

export class ClientError extends Error {
    code: number;
  
    constructor(code: number, message: string) {
      super(message);
      this.code = code;
    }
  
    static autoFindErrorType(code : number, message : string){
      switch(code){
        case 400:
          return ClientError.badRequest(message);
        case 401:
          if (isTokenError(message)) {
            return ClientError.tokenError(message);
          }
          return ClientError.unauthorized(message);
        case 403:
          return ClientError.forbidden(message);
        case 404:
          return ClientError.notFound(message);
        case 500:
          return ClientError.reference(message);
        default:
          return ClientError.etcError(code, message);
      }
    }
  
    static badRequest(message: string) {
      return new ClientError(400, message);
    }
  
    static unauthorized(message: string) {
      return new ClientError(401, message);
    }
  
    static tokenError(message: string) {
      return new ClientError(401, message);
    }
  
    static forbidden(message: string) {
      return new ClientError(403, message);
    }
  
    static notFound(message: string) {
      return new ClientError(404, message);
    }
  
    static reference(message: string) {
      return new ClientError(500, message);
    }
  
    static etcError(code: number, message: string) {
      const errorMsg = message;
      return new ClientError(code, errorMsg);
    }
  }