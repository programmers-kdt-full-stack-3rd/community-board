import {
	EmptyRequest,
	ICheckPasswordRequest,
	ICheckUserRequest,
	ICheckUserResponse,
	IGetUserMySelfResponse,
	IJoinRequest,
	ILoginRequest,
	ILoginResponse,
	IUpdatePasswordRequest,
	IUpdateProfileRequest,
	IUpdateUserRequest,
	SuccessResponse,
} from "shared";
import { HttpMethod, httpRequest, sendRequest } from "../api";

export const sendDeleteUserRequest = async () => {
	return await httpRequest("user", HttpMethod.DELETE);
};

// refactoring

export const sendGetUserMyself = sendRequest<
	EmptyRequest,
	IGetUserMySelfResponse
>("user", HttpMethod.GET);

export const sendPostJoinRequest = sendRequest<IJoinRequest, SuccessResponse>(
	"user/Join",
	HttpMethod.POST
);

export const sendPostLoginRequest = sendRequest<ILoginRequest, ILoginResponse>(
	"user/login",
	HttpMethod.POST
);

export const sendPostLogoutRequest = sendRequest<EmptyRequest, SuccessResponse>(
	"user/logout",
	HttpMethod.POST
);

export const sendPostCheckPasswordRequest = sendRequest<
	ICheckPasswordRequest,
	SuccessResponse
>("user/check-password", HttpMethod.POST);

export const sendPostCheckUserRequest = sendRequest<
	ICheckUserRequest,
	ICheckUserResponse
>("user/check-duplicate", HttpMethod.POST);

export const sendPutUpdateUserRequest = sendRequest<
	IUpdateUserRequest,
	SuccessResponse
>("user", HttpMethod.PUT);

export const sendPatchProfileRequest = sendRequest<
	IUpdateProfileRequest,
	SuccessResponse
>("user/profile", HttpMethod.PATCH);

export const sendPatchPasswordRequest = sendRequest<
	IUpdatePasswordRequest,
	SuccessResponse
>("user/password", HttpMethod.PATCH);
