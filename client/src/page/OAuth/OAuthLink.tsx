import React from "react";
import OAuthLoginButtons from "../../component/User/OAuthLoginButtons";
import { oAuthLinkWrapper } from "./OAuthLink.css";

const OAuthLink: React.FC = () => {
	return (
		<div className={oAuthLinkWrapper}>
			<h1>소셜 로그인 연동 관리</h1>

			<OAuthLoginButtons loginType="link" />
		</div>
	);
};

export default OAuthLink;
