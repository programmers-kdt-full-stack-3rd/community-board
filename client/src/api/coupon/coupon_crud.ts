export const fetchCouponName = async () => {
	const response = await fetch(`${3001}/api/coupon/users`);
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}

	const data = await response.json();
	return data;
};
