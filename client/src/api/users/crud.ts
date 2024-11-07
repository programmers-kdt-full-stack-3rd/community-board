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
	DefaultResponse,
} from "shared";
import { HttpMethod, sendRequest } from "../api";

// refactoring

export const sendGetUserMyself = sendRequest<
	EmptyRequest,
	IGetUserMySelfResponse
>("user", HttpMethod.GET);

export const sendPostJoinRequest = sendRequest<IJoinRequest, DefaultResponse>(
	"user/join",
	HttpMethod.POST
);

export const sendPostLoginRequest = sendRequest<ILoginRequest, ILoginResponse>(
	"user/login",
	HttpMethod.POST
);

export const sendPostLogoutRequest = sendRequest<EmptyRequest, DefaultResponse>(
	"user/logout",
	HttpMethod.POST
);

export const sendPostCheckPasswordRequest = sendRequest<
	ICheckPasswordRequest,
	DefaultResponse
>("user/check-password", HttpMethod.POST);

export const sendPostCheckUserRequest = sendRequest<
	ICheckUserRequest,
	ICheckUserResponse
>("user/check-duplicate", HttpMethod.POST);

export const sendPutUpdateUserRequest = sendRequest<
	IUpdateUserRequest,
	DefaultResponse
>("user", HttpMethod.PUT);

export const sendPatchProfileRequest = sendRequest<
	IUpdateProfileRequest,
	DefaultResponse
>("user/profile", HttpMethod.PATCH);

export const sendPatchPasswordRequest = sendRequest<
	IUpdatePasswordRequest,
	DefaultResponse
>("user/password", HttpMethod.PATCH);

export const sendDeleteUserRequest = sendRequest<EmptyRequest, DefaultResponse>(
	"user",
	HttpMethod.DELETE
);
