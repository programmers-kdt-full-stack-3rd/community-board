import { stringify } from "node:querystring";
import { oAuthProps, TOAuthProvider } from "./constants";

/**
 * 주어진 provider로의 OAuth 로그인 요청 URL을 생성합니다.
 * @param provider - OAuth provider
 */
export const buildLoginUrl = (provider: TOAuthProvider) => {
	const loginUrl = new URL(oAuthProps[provider].requestEndpoint.login);

	loginUrl.searchParams.set("response_type", "code");
	loginUrl.searchParams.set("client_id", oAuthProps[provider].clientId);
	loginUrl.searchParams.set("redirect_uri", oAuthProps[provider].redirectUri);

	if (oAuthProps[provider].scope) {
		loginUrl.searchParams.set("scope", oAuthProps[provider].scope);
	}

	return {
		loginUrl: loginUrl.toString(),
	};
};

/**
 * 주어진 provider로 전송할 access token 요청의 옵션을, Fetch API에서 사용할 수
 * 있는 형태로 생성합니다.
 * @param provider - OAuth provider
 * @param code - 사용자가 로그인하여 redirect URI를 통해 받은 authorization code
 * @returns `fetch()`의 두 번째 인수로 넘길 수 있는, access token 요청 옵션
 */
export const buildTokenFetchOptions = (
	provider: TOAuthProvider,
	code: string
): RequestInit => {
	const querystringPairs: { [key: string]: string } = {
		grant_type: "authorization_code",
		client_id: oAuthProps[provider].clientId,
		redirect_uri: oAuthProps[provider].redirectUri,
		code: code,
	};

	if (oAuthProps[provider].clientSecret) {
		querystringPairs.client_secret = oAuthProps[provider].clientSecret;
	}

	return {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
		},
		body: stringify(querystringPairs),
	};
};
