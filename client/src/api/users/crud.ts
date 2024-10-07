import { HttpMethod, convertToBody, httpRequest } from "../api";

export const getUserMyself = async () => {
	return await httpRequest("user", HttpMethod.GET);
};

export const sendPostLoginRequest = async (body: object) => {
	return await httpRequest(
		"user/login",
		HttpMethod.POST,
		convertToBody(body)
	);
};

export const sendPostJoinRequest = async (body: object) => {
	return await httpRequest("user/Join", HttpMethod.POST, convertToBody(body));
};

export const sendPOSTCheckPasswordRequest = async (body: object) => {
	return await httpRequest(
		"user/check-password",
		HttpMethod.POST,
		convertToBody(body)
	);
};

// 닉네임 중복 확인
export const sendPostCheckNicknameRequest = async (body: object) => {
	return await httpRequest(
		"user/check-nickname",
		HttpMethod.POST,
		convertToBody(body)
	);
};

export const sendPostLogoutRequest = async () => {
	return await httpRequest("user/logout", HttpMethod.POST);
};

export const sendPutUpdateUserRequest = async (body: object) => {
	return await httpRequest("user", HttpMethod.PUT, convertToBody(body));
};

export const sendDeleteUserRequest = async () => {
	return await httpRequest("user", HttpMethod.DELETE);
};
