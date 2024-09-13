import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService
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

	generateTokens(userId: number) {
		const accessToken = this.makeAccessToken(userId);
		const refreshToken = this.makeRefreshToken(userId);
		return { accessToken, refreshToken };
	}
}
