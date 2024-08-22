import { HttpMethod, httpRequest, convertToBody } from "../api";

// oauth 로그인 URL 가져오기
export const getOAuthLoginUrl = async (provider: string) => {
	try {
		const response = await httpRequest(
			`/oauth/login-url/${provider}`,
			HttpMethod.GET
		);
		return response.url;
	} catch (error) {
		console.error("getOAuthLoginUrl 에러", error);
		throw error;
	}
};

// oauth 로그인 처리
export const sendOAuthLoginRequest = async (provider: string, code: string) => {
	try {
		const body = { provider, code };
		const requestBody = convertToBody(body);
		const response = await httpRequest(
			"/oauth/login",
			HttpMethod.POST,
			requestBody
		);

		console.log("oauth 로그인 처리 성공");
		return response;
	} catch (error) {
		console.error("sendOAuthLoginRequest 에러:", error);
		throw error;
	}
};
