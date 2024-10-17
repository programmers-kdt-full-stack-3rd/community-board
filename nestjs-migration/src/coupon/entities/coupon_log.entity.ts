import { User } from "src/user/entities/user.entity";
import {
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	Timestamp,
} from "typeorm";
import { Coupon } from "./coupon.entity";

@Entity("coupons_log")
export class CouponLog {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	received_time: Timestamp;

	@ManyToOne(type => User, user => user.couponLogs)
	@JoinColumn({ name: "user_id" })
	user: User;

	@ManyToOne(type => Coupon, coupon => coupon.id)
	@JoinColumn({ name: "coupon_id" })
	coupon: Coupon;
}
