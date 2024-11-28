import { RiCoupon3Fill } from "react-icons/ri";
import { GoAlert } from "react-icons/go";
import Button from "../common/Button";
import { useToast } from "../../state/ToastStore";
import { FaStar } from "react-icons/fa";
import { fetchCoupon } from "../../api/coupon/coupon_crud";

export const Coupon = () => {
	const toast = useToast();

	const handleCoupon = async () => {
		try {
			const response = await fetchCoupon();
			console.log(response);
			console.log(response.status);

			if (response.status === 200) {
				toast.add({
					message: "쿠폰이 발급되었습니다.",
					variant: "success",
				});
			} else if (
				response.status === 409 &&
				response.message == "Unknown Error: Unknown Error: 중복쿠폰"
			) {
				// const errorMessage = await response.message();
				toast.add({
					message: "이미 발급된 쿠폰입니다.",
					variant: "error",
				});
			} else if (
				response.status === 409 &&
				response.message == "Unknown Error: Unknown Error: 쿠폰없음"
			) {
				// const errorMessage = await response.message();
				toast.add({
					message: "쿠폰이 모두 소진되었습니다",
					variant: "error",
				});
			}
		} catch (error) {
			toast.add({
				message: "오류가 발생했습니다.",
				variant: "error",
			});
		}
	};

	return (
		<div className="hidden w-[180px] shrink-0 lg:block">
			<div className="flex flex-col">
				<div className="flex flex-row items-center gap-1">
					<RiCoupon3Fill className="text-red-800" />
					<p className="text-start text-base font-bold">쿠폰 다운</p>
				</div>

				<div className="dark:bg-customGray mb-3 mt-1 w-full rounded-md bg-blue-50 p-1">
					<div className="flex flex-row items-center gap-1">
						<GoAlert className="text-xs" />
						<p className="text-customGray text-xs dark:text-white">
							선착순 쿠폰 목록
						</p>
					</div>
				</div>

				<hr />
				<div className="flex w-full flex-row items-center justify-between py-2">
					<div className="flex flex-row items-center gap-1">
						<FaStar className="text-xs text-yellow-400" />
						<p className="text-xs">랜덤 쿠폰</p>
						<FaStar className="text-xs text-yellow-400" />
					</div>

					<Button
						className="text-xs"
						size="small"
						onClick={handleCoupon}
						variant="solid"
						color="action"
					>
						발급
					</Button>
				</div>
				<hr />
			</div>
		</div>
	);
};
