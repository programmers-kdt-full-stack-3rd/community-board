import { TOAuthLoginType, TOAuthProvider } from "shared";
import { HttpMethod, httpRequest, convertToBody } from "../api";

// oauth 로그인 URL 가져오기
export const getOAuthLoginUrl = async (
	loginType: TOAuthLoginType,
	provider: TOAuthProvider
) => {
	const apiPath = `/oauth/${loginType}-url/${provider}`;
	return await httpRequest(apiPath, HttpMethod.GET);
};

// oauth 로그인 처리
export const sendOAuthLoginRequest = async (
	provider: TOAuthProvider,
	code: string,
	loginType: TOAuthLoginType
) => {
	const apiPath = `/oauth/${loginType}`;
	const body = { provider, code };
	const requestBody = convertToBody(body);
	return await httpRequest(apiPath, HttpMethod.POST, requestBody);
};
