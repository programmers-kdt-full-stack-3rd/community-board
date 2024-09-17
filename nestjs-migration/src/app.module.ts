import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { RbacGuard } from "./common/guard/rbac.guard";
import { TokenGuard } from "./common/guard/token.guard";
import appConfig from "./config/app.config";
import { typeOrmConfig } from "./config/db.config";
import jwtConfig from "./config/jwt.config";
import oauthConfig from "./config/oauth.config";
import { OAuthModule } from "./oauth/oauth.module";
import { RbacModule } from "./rbac/rbac.module";
import { UserModule } from "./user/user.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			cache: true,
			isGlobal: true,
			load: [appConfig, typeOrmConfig, jwtConfig, oauthConfig],
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) =>
				configService.get("typeorm"),
			inject: [ConfigService],
		}),
		UserModule,
		AuthModule,
		RbacModule,
		OAuthModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: TokenGuard,
		},
		{
			provide: APP_GUARD,
			useClass: RbacGuard,
		},
	],
})
export class AppModule {}
