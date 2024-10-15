import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
	isOAuthLoginType,
	isOAuthProvider,
	TOAuthLoginType,
	TOAuthProvider,
} from "shared";
import { sendOAuthLoginRequest } from "../../api/users/oauth";
import { useUserStore } from "../../state/store";
import Loader from "../../component/common/Loader/Loader";
import { ApiCall } from "../../api/api";
import { useGlobalErrorModal } from "../../state/GlobalErrorModalStore";

interface IOAuthLoginDestination {
	ok: string;
	err: string;
	message?: string;
}

const getDestination = (
	loginType: TOAuthLoginType,
	prevSearch: URLSearchParams,
	prevLocation: string
): IOAuthLoginDestination => {
	if (loginType === "login") {
		const givenDestination = prevSearch.get("redirect");

		return {
			ok: givenDestination || "/",
			err: prevLocation,
		};
	} else if (loginType === "link") {
		return {
			ok: prevLocation,
			err: prevLocation,
		};
	} else if (loginType === "reconfirm") {
		const nextAction = prevSearch.get("next");
		const final = prevSearch.get("final") ?? "/";

		if (!nextAction) {
			return {
				ok: prevLocation,
				err: prevLocation,
				message: "재인증 이후 수행할 동작이 없습니다.",
			};
		} else if (nextAction === "accountDelete") {
			return {
				ok: "/checkPassword?next=accountDelete&oAuthConfirmed=true",
				err: prevLocation,
			};
		} else {
			return {
				ok: `/${nextAction}?final=${final}`,
				err: prevLocation,
			};
		}
	}

	// 유효하지 않거나 도달할 수 없는 분기
	return {
		ok: "/",
		err: "/",
	};
};

//사용자 인증 완료 후 리디렉션된 후 처리
const OAuthRedirectHandler = () => {
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const location = useLocation();
	const params = useParams();

	const { setLoginUser } = useUserStore.use.actions();
	const globalErrorModal = useGlobalErrorModal();

	const handleOAuthLogin = async (
		provider: TOAuthProvider,
		code: string,
		loginType: TOAuthLoginType,
		destination: IOAuthLoginDestination
	) => {
		const response = await ApiCall(
			() => sendOAuthLoginRequest(provider, code, loginType),
			err => {
				const message = `${provider} 로그인 실패`;
				console.error(message, err);
				globalErrorModal.openWithMessageSplit({
					messageWithTitle: err.message,
				});

				navigate(destination.err);
			}
		);

		setLoading(false);

		if (response instanceof Error) {
			return;
		}

		if (loginType === "login") {
			const { nickname, loginTime, email, imgUrl } = response?.result;

			if (typeof nickname === "string" && typeof loginTime === "string") {
				setLoginUser(nickname, loginTime, email, imgUrl);
				navigate(destination.ok);
			} else {
				navigate(destination.err);
			}
		} else {
			navigate(destination.ok);
		}

		sessionStorage.removeItem("oauth_prev_pathname");
		sessionStorage.removeItem("oauth_prev_search");
	};

	//리디렉트된 URL 쿼리 스트링에서 code, provider 추출
	useEffect(() => {
		const provider = params.provider;
		const query = new URLSearchParams(location.search);
		const code = query.get("code");

		const state = new URLSearchParams(query.get("state") ?? "");
		const loginType = state.get("login_type") ?? "login";

		const prevPathname =
			sessionStorage.getItem("oauth_prev_pathname") || "/";
		const prevSearch = new URLSearchParams(
			sessionStorage.getItem("oauth_prev_search") ?? ""
		);
		const prevLocation =
			prevSearch.size > 0
				? `${prevPathname}?${prevSearch.toString()}`
				: prevPathname;

		if (!isOAuthLoginType(loginType)) {
			globalErrorModal.open({
				title: "오류",
				message: "소셜 로그인 유형이 올바르지 않습니다.",
			});
			navigate(prevLocation);
			return;
		}

		const destination: IOAuthLoginDestination = getDestination(
			loginType,
			prevSearch,
			prevLocation
		);

		if (destination.message) {
			globalErrorModal.open({
				title: "오류",
				message: destination.message,
			});
			navigate(destination.err);
			return;
		} else if (!isOAuthProvider(provider)) {
			globalErrorModal.open({
				title: "오류",
				message: "지원하지 않는 소셜 로그인 서비스입니다.",
			});
			navigate(destination.err);
			return;
		} else if (!code) {
			globalErrorModal.open({
				title: "오류",
				message: "인가 코드가 유효하지 않습니다.",
			});
			navigate(destination.err);
			return;
		}

		handleOAuthLogin(provider, code, loginType, destination);
	}, [location, navigate]);

	return (
		<div>
			{loading ? (
				<div>
					<Loader />
				</div>
			) : (
				<p>로그인 완료</p>
			)}
		</div>
	);
};

export default OAuthRedirectHandler;
