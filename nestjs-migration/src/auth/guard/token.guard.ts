import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { TokenExpiredError } from "jsonwebtoken";
import { ServerError } from "../../common/exceptions/server-error.exception";
import { UserService } from "../../user/user.service";
import { AuthService } from "../auth.service";

@Injectable()
export class TokenGuard implements CanActivate {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
		const response = context.switchToHttp().getResponse<Response>();

		const accessToken = request.cookies.accessToken;
		const refreshToken = request.cookies.refreshToken;

		if (!accessToken && !refreshToken) {
			return true; // 둘 다 없으면 비로그인 상태
		}

		if (accessToken) {
			try {
				const payload = this.authService.verifyAccessToken(accessToken);
				request.user = payload;

				if (await this.userService.isUserDeleted(payload.userId)) {
					throw ServerError.badRequest("탈퇴한 회원입니다.");
				}
				return true;
			} catch (error) {
				if (error instanceof TokenExpiredError) {
					return this.handleRefreshToken(request, response);
				}
				this.clearTokens(response);
				throw ServerError.tokenError("검증되지 않은 토큰 입니다.");
			}
		}

		// AccessToken이 없고 RefreshToken만 있는 경우
		if (refreshToken) {
			return this.handleRefreshToken(request, response);
		}

		return false;
	}

	private async handleRefreshToken(request: Request, response: Response) {
		try {
			const payload = await this.authService.verifyRefreshToken(
				request.cookies.refreshToken
			);
			request.user = payload;
			const { accessToken } = this.authService.generateTokens(
				payload.userId
			);
			response.cookie("accessToken", accessToken, {
				httpOnly: true,
				secure: true,
			});
			return true;
		} catch (error) {
			this.clearTokens(response);

			if (error instanceof TokenExpiredError) {
				this.clearTokens(response);
				throw ServerError.expiredToken("토큰이 만료 되었습니다.");
			}
			this.clearTokens(response);
			throw ServerError.tokenError("검증되지 않은 토큰 입니다.");
		}
	}

	private clearTokens(response: Response) {
		response.clearCookie("accessToken");
		response.clearCookie("refreshToken");
	}
}