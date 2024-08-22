import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { sendOAuthLoginRequest } from "../api/users/oauth";
import { useUserStore } from "../state/store";

//사용자 인증 완료 후 리디렉션된 후 처리
const OAuthRedirectHandler = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	const location = useLocation();

	const { setLoginUser } = useUserStore.use.actions();

	const handleOAuthLogin = async (provider: string, code: string) => {
		try {
			const response = await sendOAuthLoginRequest(provider, code);

			if (response.status === 200) {
				const { nickname, loginTime } = response.result;

				setLoginUser(nickname, loginTime);
				navigate("/");
			} else {
				const error = await response.json();
				setError(error.message || "OAuth 로그인 실패");
				navigate("/login");
			}
		} catch (error) {
			setError("OAuth 로그인에 실패");
			navigate("/login");
		} finally {
			setLoading(false);
		}
	};

	//리디렉트된 URL 쿼리 스트링에서 code, provider 추출
	useEffect(() => {
		const query = new URLSearchParams(location.search);
		const code = query.get("code");
		const pathnameParts = location.pathname.split("/");
		const provider = pathnameParts[pathnameParts.length - 1];

		if (
			code &&
			(provider === "google" ||
				provider === "kakao" ||
				provider === "naver")
		) {
			handleOAuthLogin(provider, code);
		} else {
			setError("유효하지 않은 경로");
			navigate("/login");
		}
	}, [location, navigate]);

	return (
		<div>
			{loading ? (
				<p>OAuth 로그인 처리 중</p>
			) : error ? (
				<p>{error}</p>
			) : (
				<p>OAuth 로그인 처리 완료</p>
			)}
		</div>
	);
};

export default OAuthRedirectHandler;
