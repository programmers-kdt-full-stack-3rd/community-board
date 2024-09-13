import { HttpException, HttpStatus } from "@nestjs/common";

export class ServerError extends HttpException {
	constructor(status: HttpStatus, message: string) {
		super(message, status);
	}

	static badRequest(message: string): ServerError {
		return new ServerError(
			HttpStatus.BAD_REQUEST,
			`Bad Request: ${message}`
		);
	}

	static unauthorized(message: string): ServerError {
		return new ServerError(
			HttpStatus.UNAUTHORIZED,
			`Unauthorized: ${message}`
		);
	}

	static forbidden(message: string): ServerError {
		return new ServerError(HttpStatus.FORBIDDEN, `Forbidden: ${message}`);
	}

	static notFound(message: string): ServerError {
		return new ServerError(HttpStatus.NOT_FOUND, `NotFound: ${message}`);
	}

	static reference(message: string): ServerError {
		return new ServerError(
			HttpStatus.INTERNAL_SERVER_ERROR,
			`Reference Error: ${message}`
		);
	}

	static etcError(status: HttpStatus, message: string): ServerError {
		return new ServerError(status, `Unknown Error: ${message}`);
	}

	static expiredToken(message: string): ServerError {
		return new ServerError(
			HttpStatus.UNAUTHORIZED,
			`Expired Token: ${message}`
		);
	}

	static tokenError(message: string): ServerError {
		return new ServerError(
			HttpStatus.UNAUTHORIZED,
			`Token Error: ${message}`
		);
	}
}
