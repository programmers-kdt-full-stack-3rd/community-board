import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { CouponLog } from "../entities/coupon_log.entity";

@Injectable()
export class CouponLogRepository extends Repository<CouponLog> {
	constructor(private dataSource: DataSource) {
		super(CouponLog, dataSource.createEntityManager());
	}
}
