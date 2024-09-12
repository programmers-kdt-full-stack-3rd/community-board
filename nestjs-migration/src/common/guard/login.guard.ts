import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ServerError } from "../exceptions/server-error.exception";

@Injectable()
export class LoginGuard implements CanActivate {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();

		if (!request.user || !request.user.userId) {
			throw ServerError.unauthorized("로그인이 필요합니다.");
		}

		return true;
	}
}
