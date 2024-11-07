import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import {
	addTransactionalDataSource,
	getDataSourceByName,
} from "typeorm-transactional";
import { AdminModule } from "./api/admin/admin.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./api/auth/auth.module";
import { ChatModule } from "./api/chat/chat.module";
import { CommentModule } from "./api/comment/comment.module";
import { RbacGuard } from "./common/guard/rbac.guard";
import { TokenGuard } from "./common/guard/token.guard";
import appConfig from "./config/app.config";
import { typeOrmConfig } from "./config/db.config";
import jwtConfig from "./config/jwt.config";
import oauthConfig from "./config/oauth.config";
import redisConfig from "./config/redis.config";
import { CouponModule } from "./api/coupon/coupon.module";
import { HealthModule } from "./health-check/health.module";
import { ImageModule } from "./api/image/image.module";
import { LikeModule } from "./api/like/like.module";
import { LogModule } from "./api/log/log.module";
import { OAuthModule } from "./api/oauth/oauth.module";
import { PostModule } from "./api/post/post.module";
import { QnAModule } from "./api/qna/qna.module";
import { RankModule } from "./api/rank/rank.module";
import { RbacModule } from "./api/rbac/rbac.module";
import { RedisModule } from "./api/redis/redis.module";
import { UserModule } from "./api/user/user.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			cache: true,
			isGlobal: true,
			envFilePath:
				process.env.NODE_ENV === "test" ? ".env.test" : "./../.env",
			load: [
				appConfig,
				typeOrmConfig,
				jwtConfig,
				oauthConfig,
				redisConfig,
			],
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				...configService.get("typeorm"),
				logging: false,
				retryAttempts: 40,
				retryDelay: 3000,
				connectTimeout: 120000,
			}),

			dataSourceFactory: async options => {
				if (!options) {
					throw new Error("Invalid options");
				}

				return (
					getDataSourceByName("default") ||
					addTransactionalDataSource(new DataSource(options))
				);
			},
			inject: [ConfigService],
		}),
		EventEmitterModule.forRoot(),
		UserModule,
		AuthModule,
		PostModule,
		LogModule,
		LikeModule,
		RbacModule,
		OAuthModule,
		CommentModule,
		ChatModule,
		AdminModule,
		HealthModule,
		RankModule,
		CouponModule,
		RedisModule,
		ImageModule,
		QnAModule,
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
