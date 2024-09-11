import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
	isOAuthLoginType,
	isOAuthProvider,
	TOAuthLoginType,
	TOAuthProvider,
} from "shared";
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
	const params = useParams();

	const { setLoginUser } = useUserStore.use.actions();

	const handleOAuthLogin = async (
		provider: TOAuthProvider,
		code: string,
		loginType: TOAuthLoginType
	) => {
		const response = await ApiCall(
			() => sendOAuthLoginRequest(provider, code, loginType),
			err => {
				const message = `${provider} 로그인 실패`;
				console.error(message, err);
				alert(message);
				setError(`${message}: ${err.message}`);

				if (loginType === "reconfirm") {
					navigate("/");
				} else if (loginType === "link") {
					navigate("/profileUpdate");
				} else {
					navigate("/login");
				}
			}
		);

		setLoading(false);

		if (response instanceof Error) {
			return;
		}

		if (loginType === "reconfirm") {
			// TODO: 회원탈퇴 분기 처리
			navigate("/profileUpdate");
		} else if (loginType === "link") {
			navigate("/profileUpdate");
		} else {
			const { nickname, loginTime } = response?.result;

			if (typeof nickname === "string" && typeof loginTime === "string") {
				setLoginUser(nickname, loginTime);
				navigate("/");
			} else {
				navigate("/login");
			}
		}
	};

	//리디렉트된 URL 쿼리 스트링에서 code, provider 추출
	useEffect(() => {
		const provider = params.provider;
		const query = new URLSearchParams(location.search);
		const code = query.get("code");
		const state = new URLSearchParams(query.get("state") ?? "");
		const loginType = state.get("login_type") ?? "login";

		if (!isOAuthProvider(provider)) {
			setError("유효하지 않은 소셜 로그인 서비스");
			navigate("/login");
			return;
		} else if (!isOAuthLoginType(loginType)) {
			setError("유효하지 않은 로그인 유형");
			navigate("/");
			return;
		} else if (!code) {
			setError("유효하지 않은 인가 코드");
			navigate("/login");
			return;
		}

		handleOAuthLogin(provider, code, loginType);
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
