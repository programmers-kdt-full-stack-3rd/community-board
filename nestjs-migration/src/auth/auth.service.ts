import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ServerError } from "../common/exceptions/server-error.exception";
import { RefreshTokensRepository } from "./refresh-tokens.repository";

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly refreshTokenRepository: RefreshTokensRepository
	) {}

	makeAccessToken(userId: number): string {
		return this.jwtService.sign(
			{ userId },
			{
				secret: this.configService.get("jwt.access_token_key"),
				expiresIn: "1h",
			}
		);
	}

	makeRefreshToken(userId: number): string {
		return this.jwtService.sign(
			{ userId },
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

	private async getRefreshToken(userId: number, token: string) {
		const refreshToken = await this.refreshTokenRepository.findOne({
			where: { userId, token },
		});

		if (!refreshToken) {
			throw ServerError.tokenError("잘못된 refresh token 입니다.");
		}
	}

	generateTokens(userId: number) {
		const accessToken = this.makeAccessToken(userId);
		const refreshToken = this.makeRefreshToken(userId);
		return { accessToken, refreshToken };
	}
}
