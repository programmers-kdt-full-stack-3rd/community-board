import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ServerError } from "../../common/exceptions/server-error.exception";
import { AUTH_ERROR_MESSAGES } from "./constants/auth.constants";
import { ITokenPayload } from "./interfaces/token.interface";
import { RefreshTokensRepository } from "./refresh-tokens.repository";

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly refreshTokenRepository: RefreshTokensRepository
	) {}

	makeAccessToken(user: ITokenPayload): string {
		return this.jwtService.sign(
			{ ...user },
			{
				secret: this.configService.get("jwt.access_token_key"),
				expiresIn: "1h",
			}
		);
	}

	makeRefreshToken(user: ITokenPayload): string {
		return this.jwtService.sign(
			{ ...user },
			{
				secret: this.configService.get("jwt.refresh_token_key"),
				expiresIn: "1d",
			}
		);
	}

	makeTempToken(userId: number): string {
		return this.jwtService.sign(
			{ userId },
			{
				secret: this.configService.get("jwt.temp_token_key"),
				expiresIn: "1h",
			}
		);
	}

	verifyAccessToken(accessToken: string) {
		return this.jwtService.verify(accessToken, {
			secret: this.configService.get("jwt.access_token_key"),
		});
	}

	async verifyRefreshToken(refreshToken: string) {
		const verifiedToken = this.jwtService.verify(refreshToken, {
			secret: this.configService.get("jwt.refresh_token_key"),
		});

		const userId = verifiedToken.userId;
		await this.getRefreshToken(userId, refreshToken);

		return verifiedToken;
	}

	verifyTempToken(tempToken: string) {
		return this.jwtService.verify(tempToken, {
			secret: this.configService.get("jwt.temp_token_key"),
		});
	}

	private async getRefreshToken(userId: number, token: string) {
		const refreshToken = await this.refreshTokenRepository.findOne({
			where: { userId, token },
		});

		if (!refreshToken) {
			throw ServerError.tokenError(
				AUTH_ERROR_MESSAGES.INVALID_REFRESH_TOKEN_ERROR
			);
		}
	}

	generateTokens(user: ITokenPayload) {
		const accessToken = this.makeAccessToken(user);
		const refreshToken = this.makeRefreshToken(user);
		return { accessToken, refreshToken };
	}
}
