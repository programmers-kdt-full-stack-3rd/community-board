import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { RefreshTokensRepository } from "./refresh-tokens.repository";

@Module({
	imports: [JwtModule.register({}), ConfigModule],
	providers: [AuthService, RefreshTokensRepository],
	exports: [AuthService, RefreshTokensRepository],
})
export class AuthModule {}
