import { stringify } from "node:querystring";
import { TOAuthProvider } from "shared";
import { ServerError } from "../../middleware/errors";
import { oAuthProps, oAuthRequestContentType } from "./constants";

type TOAuthTokenRequestGrantType = "authorization_code" | "refresh_token";
export type TOAuthLoginType = "login" | "reconfirm" | "link";

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

const grantTypeToKey: { [key in TOAuthTokenRequestGrantType]: string } = {
	authorization_code: "code",
	refresh_token: "refresh_token",
};

const buildOAuthState = (loginType: TOAuthLoginType) => {
	return stringify({
		login_type: loginType,
	});
};

/**
 * 주어진 provider로의 OAuth 로그인 요청 URL을 생성합니다.
 * @param provider - OAuth provider
 */
export const buildLoginUrl = (
	provider: TOAuthProvider
): { [key in TOAuthLoginType]: string } => {
	const {
		requestEndpoint,
		clientId,
		redirectUri,
		scope,
		getAdditionalRequestOptionsFor,
		reconfirmParams,
	} = oAuthProps[provider];

	const loginUrl = new URL(requestEndpoint.login);

	loginUrl.searchParams.set("response_type", "code");
	loginUrl.searchParams.set("client_id", clientId);
	loginUrl.searchParams.set("redirect_uri", redirectUri);
	loginUrl.searchParams.set("state", buildOAuthState("login"));

	if (scope) {
		loginUrl.searchParams.set("scope", scope);
	}

	if (getAdditionalRequestOptionsFor?.login) {
		const { searchParams = {} } = getAdditionalRequestOptionsFor.login();

		for (const key in searchParams) {
			loginUrl.searchParams.set(key, searchParams[key]);
		}
	}

	const reconfirmUrl = new URL(loginUrl);
	reconfirmUrl.searchParams.set("state", buildOAuthState("reconfirm"));
	for (const key in reconfirmParams) {
		reconfirmUrl.searchParams.set(key, reconfirmParams[key]);
	}

	const linkUrl = new URL(loginUrl);
	linkUrl.searchParams.set("state", buildOAuthState("link"));

	return {
		login: loginUrl.toString(),
		reconfirm: reconfirmUrl.toString(),
		link: linkUrl.toString(),
	};
};

/**
 * 주어진 프로바이더로 전송할 token 요청의 옵션을, Fetch API에서 사용할 수 있는
 * 형태로 생성합니다.
 * @param provider - OAuth 프로바이더
 * @param grantType - 토큰을 받기 위해 전달할 인가 수단의 유형
 * @param grantValue - grantType에 따른 인가 수단 (authorization code, refresh
 *                     token 등)
 * @returns `fetch()`의 두 번째 인수로 넘길 수 있는, access token 요청 옵션
 */
const buildTokenFetchOptions = (
	provider: TOAuthProvider,
	grantType: "authorization_code" | "refresh_token",
	grantValue: string
): RequestInit => {
	const { clientId, redirectUri, clientSecret } = oAuthProps[provider];

	const querystringPairs: { [key: string]: string } = {
		grant_type: grantType,
		client_id: clientId,
		redirect_uri: redirectUri,
		[grantTypeToKey[grantType]]: grantValue,
	};

	if (clientSecret) {
		querystringPairs.client_secret = clientSecret;
	}

	return {
		method: "POST",
		headers: {
			"Content-Type": oAuthRequestContentType,
		},
		body: stringify(querystringPairs),
	};
};

const fetchOAuthTokens = async (
	provider: TOAuthProvider,
	grantType: TOAuthTokenRequestGrantType,
	grantValue: string
) => {
	const oAuthTokenResponse = await fetch(
		oAuthProps[provider].requestEndpoint.token,
		buildTokenFetchOptions(provider, grantType, grantValue)
	);

	if (oAuthTokenResponse.status >= 500) {
		throw ServerError.etcError(
			500,
			"OAuth 서비스 제공사 오류로 OAuth 토큰 조회에 실패했습니다."
		);
	} else if (oAuthTokenResponse.status >= 400) {
		throw ServerError.badRequest(
			"인가 수단이 유효하지 않아서 OAuth 토큰 조회에 실패했습니다."
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
		"Content-type": oAuthRequestContentType,
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
	const oAuthTokens = await fetchOAuthTokens(
		provider,
		"authorization_code",
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

export const refreshOAuthAccessToken = async (
	provider: TOAuthProvider,
	oAuthRefreshToken: string
) => {
	const oAuthTokens = await fetchOAuthTokens(
		provider,
		"refresh_token",
		oAuthRefreshToken
	);

	return {
		oAuthAccessToken: oAuthTokens.access_token,
	};
};

const buildRevokeFetchParameters = (
	provider: TOAuthProvider,
	oAuthAccessToken: string
): [string, RequestInit] => {
	const {
		requestEndpoint: { revoke: revokeEndpoint },
		getAdditionalRequestOptionsFor,
	} = oAuthProps[provider];

	let searchParams, headers, body;

	if (getAdditionalRequestOptionsFor?.revoke) {
		const requestOptions = getAdditionalRequestOptionsFor.revoke({
			accessToken: oAuthAccessToken,
		});
		({ searchParams = null, headers = null, body = null } = requestOptions);
	} else {
		searchParams = null;
		headers = null;
		body = null;
	}

	const url = new URL(revokeEndpoint);
	if (searchParams) {
		for (const key in searchParams) {
			url.searchParams.set(key, searchParams[key]);
		}
	}

	const fetchOptions: RequestInit = {
		method: "POST",
	};
	if (headers) {
		fetchOptions.headers = { ...headers };
	}
	if (body) {
		fetchOptions.body = stringify(body);
	}

	return [url.toString(), fetchOptions];
};

export const revokeOAuth = async (
	provider: TOAuthProvider,
	oAuthAccessToken: string
) => {
	const oAuthRevokeResponse = await fetch(
		...buildRevokeFetchParameters(provider, oAuthAccessToken)
	);

	const payload = await oAuthRevokeResponse.json();

	if (oAuthRevokeResponse.status >= 500) {
		throw ServerError.etcError(
			500,
			"OAuth 서비스 제공사 오류로 OAuth 연동 해제에 실패했습니다."
		);
	} else if (oAuthRevokeResponse.status >= 400) {
		throw ServerError.badRequest(
			"인가 수단이 유효하지 않아서 OAuth 연동 해제에 실패했습니다."
		);
	} else if (payload.error) {
		throw ServerError.etcError(
			500,
			"서버의 요청 구성 문제로 OAuth 연동 해제에 실패했습니다."
		);
	}
};
