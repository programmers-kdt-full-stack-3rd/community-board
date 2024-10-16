import { InjectQueue } from "@nestjs/bull";
import { HttpException, Injectable } from "@nestjs/common";
import { Queue } from "bull";
import { RedisRepository } from "src/redis/redis.repository";
import { CouponRepository } from "./repositories/coupon.repository";
import { CouponLogRepository } from "./repositories/coupon_log.repository";
import { ServerError } from "src/common/exceptions/server-error.exception";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class CouponService {
	constructor(
		private readonly redisRepository: RedisRepository,
		private readonly couponRepository: CouponRepository,
		private readonly couponLogRepository: CouponLogRepository,
		private readonly eventEmitter: EventEmitter2,
		@InjectQueue("wait_coupon_queue") private couponQueue: Queue
	) {}

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
		let msg;
		try {
			console.log(
				"redis에 있는 user_coupon 정보",
				await this.redisRepository.getRedisData(userId, couponId)
			);

			const couponCount = await this.redisRepository.getStock(couponId);

			if (couponCount < 1) {
				throw ServerError.reference("쿠폰이 모두 소진되었습니다");
			}

			const dupCheck = await this.redisRepository.checkDupCoupon(
				userId,
				couponId
			);
			if (dupCheck) {
				throw ServerError.reference("이미 발급 받았습니다");
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
	//coupon_id에 일단 순서 넣고 나중에 coupon id로 변경
	async saveLogToMaria(userId, couponId) {
		const couponLog = this.couponLogRepository.create({
			user: userId,
			coupon: couponId,
		});
		await this.couponLogRepository.save(couponLog);
		console.log("maria log");
	}

	async saveCouponStockToMaria(couponId, updatedStock) {
		await this.couponRepository.update(
			{ id: couponId },
			{ stock: updatedStock }
		);
		console.log("maria count");
	}
}
