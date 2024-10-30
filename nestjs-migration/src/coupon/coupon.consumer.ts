import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { CouponService } from "./coupon.service";

@Processor("wait_coupon_queue")
export class CouponConsumer {
	constructor(private readonly couponService: CouponService) {}

	@Process("issue_coupon")
	async transcode(job: Job) {
		const { userId, couponId } = job.data;
		try {
			await this.couponService.issueCoupon(couponId, userId);
		} catch (err) {
			throw err;
		}
	}
}
