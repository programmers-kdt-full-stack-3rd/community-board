import {
	EmptyRequest,
	IGetUserMySelfResponse,
	ILoginRequest,
	ILoginResponse,
	IUpdatePasswordRequest,
	IUpdateProfileRequest,
} from "shared";
import { HttpMethod, convertToBody, httpRequest, sendRequest } from "../api";

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
export const sendPostCheckUserRequest = async (body: object) => {
	return await httpRequest(
		"user/check-duplicate",
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

export const sendPatchProfileRequest = async (body: IUpdateProfileRequest) => {
	return await httpRequest(
		"user/profile",
		HttpMethod.PATCH,
		convertToBody(body)
	);
};

export const sendPatchPasswordRequest = async (
	body: IUpdatePasswordRequest
) => {
	return await httpRequest(
		"user/password",
		HttpMethod.PATCH,
		convertToBody(body)
	);
};

export const sendDeleteUserRequest = async () => {
	return await httpRequest("user", HttpMethod.DELETE);
};

// refactoring

export const sendGetUserMyself = sendRequest<
	EmptyRequest,
	IGetUserMySelfResponse
>("user", HttpMethod.GET);

export const sendPostLoginRequest = sendRequest<ILoginRequest, ILoginResponse>(
	"user/login",
	HttpMethod.POST
);
