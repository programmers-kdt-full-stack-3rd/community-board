import { stringify } from "node:querystring";
import { TOAuthProvider } from "shared";
import { ServerError } from "../common/exceptions/server-error.exception";
import {
	grantTypeToKey,
	oAuthRequestContentType,
} from "../api/oauth/constants/oauth.constants";
import {
	INaverUser,
	IOAuthUser,
	TOAuthLoginType,
	TOAuthProps,
} from "../api/oauth/interfaces/oauth.interface";

export const buildOAuthState = (loginType: TOAuthLoginType) => {
	return stringify({
		login_type: loginType,
	});
};

export const isNaverUserResponse = (payload: any): payload is INaverUser => {
	return "response" in payload && "id" in payload.response;
};

export const isOAuthUserResponse = (payload: any): payload is IOAuthUser => {
	return "id" in payload;
};

export const extractOAuthAccountId = (
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

export const buildTokenFetchOptions = (
	provider: TOAuthProvider,
	grantType: "authorization_code" | "refresh_token",
	grantValue: string,
	oAuthProps: Record<TOAuthProvider, TOAuthProps>
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

export const buildRevokeFetchParameters = (
	provider: TOAuthProvider,
	oAuthAccessToken: string,
	oAuthProps: Record<TOAuthProvider, TOAuthProps>
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

//TODO: 자연스러운 닉네임 생성
export const generateNickname = () => {
	return (
		"신규 " +
		Math.floor(0x1000000 * Math.random())
			.toString(16)
			.padStart(6, "0")
	);
};
