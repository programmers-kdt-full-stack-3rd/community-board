import React from "react";
import { Link } from "react-router-dom";
import { TbFileSad } from "react-icons/tb";

const NotFound: React.FC = () => {
	return (
		<div className="relative flex h-[90vh] items-center justify-center p-5 text-center">
			<div className="max-w-[600px]">
				<div className="mb-2 text-7xl text-gray-400">
					<TbFileSad />
				</div>
				<h1 className="mb-5 text-2xl font-bold text-gray-400">
					원하시는 페이지를 찾을 수 없습니다.
				</h1>
				<p className="mb-10 text-base text-gray-400">
					찾으려는 페이지의 주소가 잘못 입력되었거나, 주소의 변경 혹은
					삭제로 인해 사용하실 수 없습니다. 입력하신 페이지의 주소가
					정확한지 다시 한 번 확인해 주세요.
				</p>
				<Link
					to="/"
					className="inline-block rounded-lg bg-black px-6 py-4 text-base text-gray-400 no-underline"
				>
					메인으로 돌아가기
				</Link>
			</div>
			<div className="pointer-events-none absolute left-1/2 top-1/2 z-[-1] -translate-x-1/2 -translate-y-1/2 transform select-none whitespace-nowrap text-[120px] font-bold text-gray-800">
				404 Not Found
			</div>
		</div>
	);
};

export default NotFound;
