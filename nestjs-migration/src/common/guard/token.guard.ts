import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { TokenExpiredError } from "jsonwebtoken";
import { AuthService } from "../../auth/auth.service";
import { RefreshTokensRepository } from "../../auth/refresh-tokens.repository";
import { UserService } from "../../user/user.service";
import { ServerError } from "../exceptions/server-error.exception";
import { COOKIE_CONSTANTS, ERROR_MESSAGES } from "./constants/guard.constants";

@Injectable()
export class TokenGuard implements CanActivate {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
		private readonly refreshTokenRepository: RefreshTokensRepository
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
		const response = context.switchToHttp().getResponse<Response>();

		const accessToken = request.cookies.accessToken;
		const refreshToken = request.cookies.refreshToken;

		if (!accessToken && !refreshToken) {
			request.user = { userId: null, roleId: 3 };
			return true; // 둘 다 없으면 비로그인 상태
		}

		if (accessToken) {
			try {
				const payload = this.authService.verifyAccessToken(accessToken);
				request.user = payload;

				if (await this.userService.isUserDeletedById(payload.userId)) {
					throw ServerError.badRequest(ERROR_MESSAGES.DELETED_USER);
				}
				return true;
			} catch (error) {
				this.clearTokens(response);

				if (error instanceof TokenExpiredError) {
					return this.handleRefreshToken(request, response);
				}

				if (error instanceof ServerError) {
					throw error;
				}

				throw ServerError.tokenError(ERROR_MESSAGES.INVALID_TOKEN);
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

			if (await this.userService.isUserDeletedById(payload.userId)) {
				this.refreshTokenRepository.delete({ userId: payload.userId });
				throw ServerError.badRequest(ERROR_MESSAGES.DELETED_USER);
			}

			const { accessToken } = this.authService.generateTokens(
				payload.userId
			);
			response.cookie(COOKIE_CONSTANTS.ACCESS_TOKEN, accessToken, {
				httpOnly: true,
				secure: true,
			});
			return true;
		} catch (error) {
			this.clearTokens(response);

			if (error instanceof TokenExpiredError) {
				this.clearTokens(response);
				throw ServerError.expiredToken(ERROR_MESSAGES.EXPIRED_TOKEN);
			}

			if (error instanceof ServerError) {
				throw error;
			}
			this.clearTokens(response);
			throw ServerError.tokenError(ERROR_MESSAGES.INVALID_TOKEN);
		}
	}

	private clearTokens(response: Response) {
		response.clearCookie(COOKIE_CONSTANTS.ACCESS_TOKEN);
		response.clearCookie(COOKIE_CONSTANTS.REFRESH_TOKEN);
	}
}
