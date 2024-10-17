import { HttpMethod, httpRequest } from "../api";

export const fetchCoupon = async () => {
	const url = `coupon`;
	return await httpRequest(
		url,
		HttpMethod.POST,
		JSON.stringify({ coupon_id: 1 })
	);
};

export const fetchCouponName = async () => {
	const url = `coupon/users`;
	return await httpRequest(url, HttpMethod.GET);
};
