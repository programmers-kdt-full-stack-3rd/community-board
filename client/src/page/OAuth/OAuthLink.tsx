import React from "react";
import OAuthLoginButtons from "../../component/User/OAuthLoginButtons";

const OAuthLink: React.FC = () => {
	return (
		<div className="dark:bg-customGray mx-auto w-full max-w-[350px] rounded-lg bg-gray-300 p-5 shadow-md">
			<h1 className="mb-10">소셜 로그인 연동 관리</h1>

			<OAuthLoginButtons loginType="link" />
		</div>
	);
};

export default OAuthLink;
