import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { sendOAuthLoginRequest } from "../api/users/oauth";
import { useUserStore } from "../state/store";
import Loader from "../component/common/Loader/Loader";
import { ApiCall } from "../api/api";

//사용자 인증 완료 후 리디렉션된 후 처리
const OAuthRedirectHandler = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	const location = useLocation();

	const { setLoginUser } = useUserStore.use.actions();

	const handleOAuthLogin = async (provider: string, code: string) => {
		const response = await ApiCall(
			() => sendOAuthLoginRequest(provider, code),
			err => {
				const message = `${provider} 로그인 실패`;
				console.error(message, err);
				alert(message);
				setError(`${message}: ${err.message}`);
				navigate("/login");
			}
		);

		setLoading(false);

		if (response instanceof Error) {
			return;
		}

		const { nickname, loginTime } = response?.result;

		if (typeof nickname === "string" && typeof loginTime === "string") {
			setLoginUser(nickname, loginTime);
			navigate("/");
		} else {
			navigate("/login");
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
				<div>
					<Loader />
				</div>
			) : error ? (
				<p>{error}</p>
			) : (
				<p>로그인 완료</p>
			)}
		</div>
	);
};

export default OAuthRedirectHandler;
