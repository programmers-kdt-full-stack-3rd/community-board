import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { CouponService } from "./coupon.service";

@Processor("wait_coupon_queue")
export class CouponConsumer {
	constructor(private readonly couponService: CouponService) {}

	@Process("issue_coupon")
	async transcode(job: Job) {
		const { userId, orderId, couponId, eventName } = job.data;

		try {
			const doIt = await this.couponService.issueCoupon(
				couponId,
				orderId,
				userId,
				eventName
			);
		} catch (err) {
			throw err;
		}

		return {};
	}
}
