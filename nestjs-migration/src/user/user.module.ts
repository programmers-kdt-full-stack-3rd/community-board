import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { RefreshTokensRepository } from "../auth/refresh-tokens.repository";
import { OAuthModule } from "../oauth/oauth.module";
import { OAuthConnectionRepository } from "../oauth/repositories/oauth-connection.repository";
import { RbacModule } from "../rbac/rbac.module";
import { User } from "./entities/user.entity";
import { UserController } from "./user.controller";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		forwardRef(() => AuthModule),
		RbacModule,
		OAuthModule,
	],
	controllers: [UserController],
	providers: [
		UserService,
		UserRepository,
		RefreshTokensRepository,
		OAuthConnectionRepository,
	],
	exports: [UserService, UserRepository],
})
export class UserModule {}
