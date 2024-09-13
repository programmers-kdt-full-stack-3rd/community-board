import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import { ServerError } from "../exceptions/server-error.exception";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let message = "Internal server error";

		if (
			exception instanceof ServerError ||
			exception instanceof HttpException
		) {
			status = exception.getStatus();
			message = exception.message;
		} else if (exception instanceof Error) {
			message = exception.message;
		} else {
			message = String(exception);
		}

		response.status(status).json({
			message: message,
		});
	}
}
