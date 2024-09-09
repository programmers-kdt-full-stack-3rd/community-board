import React from "react";
import googleIcon from "../../assets/icons/google-icon.svg";
import naverIcon from "../../assets/icons/naver-icon.svg";
import kakaoIcon from "../../assets/icons/kakao-icon.svg";
import {
	googleButton,
	iconStyle,
	kakaoButton,
	naverButton,
	socialLoginButtons,
} from "./css/OAuthLoginButtons.css";
import { getOAuthLoginUrl, TLoginType } from "../../api/users/oauth";
import { ApiCall } from "../../api/api";

interface IProps {
	loginType: TLoginType;
}

const OAuthLoginButtons: React.FC<IProps> = ({ loginType }) => {
	// TODO: shared 머지 시 main으로 rebase 후 TOAuthProvider 가져오기
	const handleClickWith = (provider: string) => async () => {
		const response = await ApiCall(
			() => getOAuthLoginUrl(loginType, provider),
			err => {
				console.error(`${provider} 로그인 URL 조회 에러`, err);
				alert(`${provider}(으)로 로그인할 수 없습니다.`);
			}
		);

		if (typeof response.url === "string") {
			window.location.href = response.url;
		}
	};

	return (
		<div className={socialLoginButtons}>
			<button
				className={googleButton}
				onClick={handleClickWith("google")}
			>
				<img
					src={googleIcon}
					alt="Google Icon"
					className={iconStyle}
				/>
				구글로 로그인
			</button>

			<button
				className={naverButton}
				onClick={handleClickWith("naver")}
			>
				<img
					src={naverIcon}
					alt="Naver Icon"
					className={iconStyle}
				/>
				네이버로 로그인
			</button>

			<button
				className={kakaoButton}
				onClick={handleClickWith("kakao")}
			>
				<img
					src={kakaoIcon}
					alt="Kakao Icon"
					className={iconStyle}
				/>
				카카오로 로그인
			</button>
		</div>
	);
};

export default OAuthLoginButtons;
