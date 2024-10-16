import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	UseGuards,
} from "@nestjs/common";
import { CouponService } from "./coupon.service";
import { User } from "src/common/decorator/user.decorator";
import { IUserEntity } from "src/common/interface/user-entity.interface";
import { LoginGuard } from "src/common/guard/login.guard";

@Controller("coupon")
export class CouponController {
	constructor(private readonly couponService: CouponService) {}

	@UseGuards(LoginGuard)
	@Get("/users")
	@HttpCode(HttpStatus.OK)
	async getUserCoupon(@User() user: IUserEntity) {
		const userId = user.userId;
		const couponName = await this.couponService.getUserCoupon(userId);

		return { name: couponName };
	}

	@UseGuards(LoginGuard)
	@Post("")
	@HttpCode(HttpStatus.OK)
	async handleCoupon(
		@Body() body: { couponId: number },
		@User() user: IUserEntity
	) {
		const { couponId } = body;
		const userId = user.userId;
		try {
			await this.couponService.goToQueue(userId, couponId);
		} catch (err) {
			throw err;
		}
	}
	//test용 api (레디스 내용 초기화)
	@Get("/init/:couponId")
	async initRedis(@Param("couponId") couponId: number) {
		await this.couponService.initRedis(couponId);
	}
}
