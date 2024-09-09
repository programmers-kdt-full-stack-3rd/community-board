import { HttpMethod, httpRequest, convertToBody } from "../api";

export type TLoginType = "login" | "reconfirm" | "link";

// oauth 로그인 URL 가져오기
export const getOAuthLoginUrl = async (
	loginType: TLoginType,
	provider: string
) => {
	const apiPath = `/oauth/${loginType}-url/${provider}`;
	return await httpRequest(apiPath, HttpMethod.GET);
};

// oauth 로그인 처리
export const sendOAuthLoginRequest = async (provider: string, code: string) => {
	const body = { provider, code };
	const requestBody = convertToBody(body);
	return await httpRequest("/oauth/login", HttpMethod.POST, requestBody);
};
