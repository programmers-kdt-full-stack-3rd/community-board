import { stringify } from "node:querystring";
import { oAuthProps, TOAuthProvider } from "./constants";
import { ServerError } from "../../middleware/errors";

interface IOAuthUser {
	id: string;
}

interface INaverUser {
	response: IOAuthUser;
}

/**
 * 주어진 provider로의 OAuth 로그인 요청 URL을 생성합니다.
 * @param provider - OAuth provider
 */
export const buildLoginUrl = (provider: TOAuthProvider) => {
	const { requestEndpoint, clientId, redirectUri, scope } =
		oAuthProps[provider];

	const loginUrl = new URL(requestEndpoint.login);

	loginUrl.searchParams.set("response_type", "code");
	loginUrl.searchParams.set("client_id", clientId);
	loginUrl.searchParams.set("redirect_uri", redirectUri);

	if (scope) {
		loginUrl.searchParams.set("scope", scope);
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
	const { clientId, redirectUri, clientSecret } = oAuthProps[provider];

	const querystringPairs: { [key: string]: string } = {
		grant_type: "authorization_code",
		client_id: clientId,
		redirect_uri: redirectUri,
		code: code,
	};

	if (clientSecret) {
		querystringPairs.client_secret = clientSecret;
	}

	return {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
		},
		body: stringify(querystringPairs),
	};
};

const isNaverUserResponse = (payload: any): payload is INaverUser => {
	return "response" in payload && "id" in payload.response;
};

const isOAuthUserResponse = (payload: any): payload is IOAuthUser => {
	return "id" in payload;
};

/**
 * OAuth 회원 정보 응답 데이터에서 회원번호를 추출합니다.
 * @param provider
 * @param payload
 * @returns
 */
export const getOAuthAccountId = (
	provider: TOAuthProvider,
	payload: any
): string => {
	if (provider === "naver" && isNaverUserResponse(payload)) {
		return payload.response.id;
	} else if (isOAuthUserResponse(payload)) {
		return payload.id;
	}

	throw ServerError.etcError(500, "소셜 로그인 회원번호 조회 실패");
};
