import React from "react";
import { useNavigate } from "react-router-dom";
import { TbFileSad } from "react-icons/tb";
import Button from "../../component/common/Button";

const NotFound: React.FC = () => {
	const navigate = useNavigate();

	return (
		<div className="relative z-0 flex h-[75vh] items-center justify-center text-balance break-keep text-center">
			<div className="max-w-[600px]">
				<div className="mx-auto mb-2 w-fit text-7xl text-neutral-600 dark:text-neutral-400">
					<TbFileSad />
				</div>

				<h1 className="mb-5 text-2xl font-bold text-neutral-600 dark:text-neutral-400">
					원하시는 페이지를 찾을 수 없습니다.
				</h1>
				<p className="mb-10 text-base text-neutral-600 dark:text-neutral-400">
					찾으려는 페이지의 주소가 잘못 입력되었거나, 주소의 변경 혹은
					삭제로 인해 사용하실 수 없습니다. 입력하신 페이지의 주소가
					정확한지 다시 한 번 확인해 주세요.
				</p>

				<Button
					size="large"
					onClick={() => navigate("/")}
				>
					메인으로 돌아가기
				</Button>
			</div>

			<div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 transform select-none whitespace-nowrap text-[120px] font-bold text-black/5 dark:text-white/5">
				404 Not Found
			</div>
		</div>
	);
};

export default NotFound;
