import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CouponLog } from "./coupon_log.entity";

@Entity("coupons")
export class Coupon {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 50 })
	name: string;

	@Column()
	stock: number;

	@OneToMany(type => CouponLog, couponLog => couponLog.coupon)
	couponLogs: CouponLog[];
}
