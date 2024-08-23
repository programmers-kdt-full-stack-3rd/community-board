import { stringify } from "node:querystring";
import { TOAuthProvider } from "../../db/model/oauth";
import { ServerError } from "../../middleware/errors";
import { oAuthProps } from "./constants";

interface IOAuthUser {
	id: string;
}

interface INaverUser {
	response: IOAuthUser;
}

interface IOAuthTokens {
	token_type: string;
	access_token: string;
	id_token?: string;
	expires_in: number;
	refresh_token: string;
	refresh_token_expires_in?: number;
	scope?: string;
}

/**
 * 주어진 provider로의 OAuth 로그인 요청 URL을 생성합니다.
 * @param provider - OAuth provider
 */
export const buildLoginUrl = (provider: TOAuthProvider) => {
	const {
		requestEndpoint,
		clientId,
		redirectUri,
		scope,
		requestAdditionalParam,
		reconfirmParam,
	} = oAuthProps[provider];

	const loginUrl = new URL(requestEndpoint.login);

	loginUrl.searchParams.set("response_type", "code");
	loginUrl.searchParams.set("client_id", clientId);
	loginUrl.searchParams.set("redirect_uri", redirectUri);

	if (scope) {
		loginUrl.searchParams.set("scope", scope);
	}

	if (requestAdditionalParam?.login) {
		loginUrl.searchParams.set(
			requestAdditionalParam.login.key,
			requestAdditionalParam.login.value
		);
	}

	const reconfirmUrl = new URL(loginUrl);
	reconfirmUrl.searchParams.set(reconfirmParam.key, reconfirmParam.value);

	return {
		loginUrl: loginUrl.toString(),
		reconfirmUrl: reconfirmUrl.toString(),
	};
};

/**
 * 주어진 provider로 전송할 access token 요청의 옵션을, Fetch API에서 사용할 수
 * 있는 형태로 생성합니다.
 * @param provider - OAuth provider
 * @param code - 사용자가 로그인하여 redirect URI를 통해 받은 authorization code
 * @returns `fetch()`의 두 번째 인수로 넘길 수 있는, access token 요청 옵션
 */
const buildTokenFetchOptions = (
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

const fetchOAuthTokensByAuthCode = async (
	provider: TOAuthProvider,
	authorizationCode: string
) => {
	const oAuthTokenResponse = await fetch(
		oAuthProps[provider].requestEndpoint.token,
		buildTokenFetchOptions(provider, authorizationCode)
	);

	if (oAuthTokenResponse.status >= 500) {
		throw ServerError.etcError(
			500,
			"소셜 로그인 서비스 제공사 오류로 로그인에 실패했습니다."
		);
	} else if (oAuthTokenResponse.status >= 400) {
		throw ServerError.badRequest(
			"인가 코드가 유효하지 않아서 소셜 로그인에 실패했습니다."
		);
	}

	return (await oAuthTokenResponse.json()) as IOAuthTokens;
};

const fetchOAuthUserByAccessToken = async (
	provider: TOAuthProvider,
	accessToken: string
) => {
	const url = oAuthProps[provider].requestEndpoint.user;
	const headers = {
		Authorization: `Bearer ${accessToken}`,
		"Content-type": "application/x-www-form-urlencoded;charset=utf-8",
	};

	const oAuthUserResponse = await fetch(url, { headers });
	return await oAuthUserResponse.json();
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
const extractOAuthAccountId = (
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

export const verifyAuthorizationCode = async (
	provider: TOAuthProvider,
	authorizationCode: string
) => {
	const oAuthTokens = await fetchOAuthTokensByAuthCode(
		provider,
		authorizationCode
	);

	const oAuthUser = await fetchOAuthUserByAccessToken(
		provider,
		oAuthTokens.access_token
	);

	return {
		oAuthAccountId: extractOAuthAccountId(provider, oAuthUser),
		oAuthRefreshToken: oAuthTokens.refresh_token,
	};
};
