import { InjectQueue } from "@nestjs/bull";
import { HttpException, Injectable } from "@nestjs/common";
import { Queue } from "bull";
import { RedisRepository } from "src/redis/redis.repository";
import { CouponRepository } from "./repositories/coupon.repository";
import { CouponLogRepository } from "./repositories/coupon_log.repository";
import { ServerError } from "src/common/exceptions/server-error.exception";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { COUPON_ERROR_MESSAGES } from "./constant/coupon.constants";

@Injectable()
export class CouponService {
	constructor(
		private readonly redisRepository: RedisRepository,
		private readonly couponRepository: CouponRepository,
		private readonly couponLogRepository: CouponLogRepository,
		private readonly eventEmitter: EventEmitter2,
		@InjectQueue("wait_coupon_queue") private couponQueue: Queue
	) {}

	async getUserCoupon(userId: number) {
		try {
			const couponId = await this.couponLogRepository.getCoupons(userId);
			const coupon = await this.couponRepository.findOne({
				where: {
					id: couponId,
				},
			});
			const couponName = coupon.name;
			return couponName;
		} catch (err) {
			throw ServerError.reference(
				COUPON_ERROR_MESSAGES.GET_COUPON_NAME_ERROR
			);
		}
	}

	async initRedis(couponId: number) {
		await this.redisRepository.init(couponId);
	}

	async goToQueue(userId: number, couponId: number) {
		const job = await this.couponQueue.add(
			"issue_coupon",
			{
				userId,
				couponId,
			},
			{
				removeOnComplete: true,
				removeOnFail: true,
				attempts: 1,
				jobId: `${userId}_${couponId}`,
			}
		);
		const result = await job.finished(); // 작업 완료 시까지 대기 TODO: 비동기로 변경
		const state = await job.getState();
		console.log(`작업의 상태: ${state}`);

		const waitingCount = await this.couponQueue.getWaitingCount();
		console.log(`대기 중인 작업 수: ${waitingCount}`);
	}

	async issueCoupon(couponId: number, userId: number) {
		try {
			console.log(
				"redis에 있는 user_coupon 정보",
				await this.redisRepository.getRedisData(userId, couponId)
			);

			const couponCount = await this.redisRepository.getStock(couponId);

			if (couponCount < 1) {
				throw ServerError.etcError(
					409,
					COUPON_ERROR_MESSAGES.RUN_OUT_ERROR
				);
			}

			const dupCheck = await this.redisRepository.checkDupCoupon(
				userId,
				couponId
			);
			if (dupCheck) {
				throw ServerError.etcError(
					409,
					COUPON_ERROR_MESSAGES.DUP_ERROR
				);
			}

			await this.redisRepository.saveLogToRedis(userId, couponId);
			await this.redisRepository.decreaseStock(couponId);
			const updatedCoupons =
				await this.redisRepository.getStock(couponId);

			//발급 후 mysql에 저장(비동기?)
			this.saveLogToMaria(userId, couponId);
			this.saveCouponStockToMaria(couponId, updatedCoupons);
		} catch (err) {
			throw err;
		}
	}
	async saveLogToMaria(userId: number, couponId: number) {
		const couponLog = this.couponLogRepository.create({
			user: { id: userId },
			coupon: { id: couponId },
		});
		await this.couponLogRepository.save(couponLog);
		console.log("maria log");
	}

	async saveCouponStockToMaria(couponId: number, updatedStock: number) {
		await this.couponRepository.update(
			{ id: couponId },
			{ stock: updatedStock }
		);
		console.log("maria count log");
	}
}
