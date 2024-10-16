import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
const Loader: React.FC = () => {
	return (
		<div className="flex flex-col items-center justify-center">
			<AiOutlineLoading3Quarters className="animate-spin text-[50px] text-gray-400" />
			<p className="mt-5 text-base text-white">잠시만 기다려주세요.</p>
		</div>
	);
};

export default Loader;
