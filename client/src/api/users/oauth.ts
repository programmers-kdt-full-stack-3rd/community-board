import { HttpMethod, httpRequest, convertToBody } from "../api";

// TODO: TOAuthLoginType을 서버 코드에서 shared로 추출하고,
//       oAuthProviders와 TOAuthProvider처럼 배열로부터 Type alias 정의
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
export const sendOAuthLoginRequest = async (
	provider: string,
	code: string,
	loginType: string
) => {
	const apiPath = `/oauth/${loginType}`;
	const body = { provider, code };
	const requestBody = convertToBody(body);
	return await httpRequest(apiPath, HttpMethod.POST, requestBody);
};
