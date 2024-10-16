import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { CouponLog } from "../entities/coupon_log.entity";

@Injectable()
export class CouponLogRepository extends Repository<CouponLog> {
	constructor(private dataSource: DataSource) {
		super(CouponLog, dataSource.createEntityManager());
	}
	async getCoupons(userId: number) {
		const queryBuilder = this.createQueryBuilder("coupons_log")
			.innerJoinAndSelect("coupons_log.user", "user")
			.select(["coupons_log.coupon_id"])
			.where("user.id = :userId", { userId });

		const result = await queryBuilder.getRawOne();
		const couponId = result.coupon_id;

		return couponId;
	}
}
