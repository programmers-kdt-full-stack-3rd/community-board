import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ServerError } from "../exceptions/server-error.exception";

// TODO: Login가드가아닌 데코레이터 사용해서 더 편하게 쓸수있게끔 수정

@Injectable()
export class LoginGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest();

		if (!request.user || !request.user.userId) {
			throw ServerError.unauthorized("로그인이 필요합니다.");
		}

		return true;
	}
}
