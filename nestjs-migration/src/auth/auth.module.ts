import { Module, forwardRef } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "../user/user.module";
import { AuthService } from "./auth.service";
import { RefreshTokensRepository } from "./refresh-tokens.repository";

@Module({
	imports: [
		JwtModule.register({}),
		ConfigModule,
		forwardRef(() => UserModule),
	],
	providers: [AuthService, RefreshTokensRepository],
	exports: [AuthService, RefreshTokensRepository],
})
export class AuthModule {}
