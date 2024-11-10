import { Module } from "@nestjs/common";
import { CouponService } from "./coupon.service";
import { CouponController } from "./coupon.controller";
import { BullModule } from "@nestjs/bull";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RedisModule } from "../redis/redis.module";
import { CouponConsumer } from "./coupon.consumer";
import { CouponRepository } from "./repositories/coupon.repository";
import { CouponLogRepository } from "./repositories/coupon_log.repository";

@Module({
	imports: [
		RedisModule,
		TypeOrmModule.forFeature([]),
		BullModule.forRoot({
			redis: {
				host: "localhost",
				port: 6379,
			},
		}),
		BullModule.registerQueue({
			name: "wait_coupon_queue",
		}),
	],
	controllers: [CouponController],
	providers: [
		CouponService,
		CouponConsumer,
		CouponRepository,
		CouponLogRepository,
	],
})
export class CouponModule {}
