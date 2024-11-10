import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthService } from "../../api/auth/auth.service";
import { ServerError } from "../exceptions/server-error.exception";
import { IUserEntity } from "../interface/user-entity.interface";

@Injectable()
export class PasswordGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private authService: AuthService
	) {}

	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest();
		const response = context.switchToHttp().getResponse();

		const user: IUserEntity = request.user;

		const requiredPassword = this.reflector.get<string>(
			"requiredPassword",
			context.getHandler()
		);

		if (!requiredPassword) {
			return true;
		}

		const tempToken = request.cookies.tempToken;
		response.clearCookie("tempToken");

		if (!user || !user.userId) {
			throw ServerError.unauthorized("로그인이 필요합니다.");
		}

		return this.isTempTokenValid(tempToken, user.userId);
	}

	isTempTokenValid(tempToken: string, userId: number) {
		if (!tempToken) {
			throw ServerError.unauthorized("비밀번호 확인이 필요합니다.");
		}

		const tempTokenPayload = this.authService.verifyTempToken(tempToken);

		if (tempTokenPayload.userId !== userId) {
			throw ServerError.forbidden("인증 정보가 일치하지 않습니다.");
		}

		return true;
	}
}
