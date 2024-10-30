import { Response } from "../api";
import { ILoginUserInfo, INonSensitiveUser } from "./users";

// login

export interface ILoginRequest {
	email: string;
	password: string;
}

export interface ILoginResponse extends Response {
	userInfo: ILoginUserInfo;
}

// getUserMySelf
export interface EmptyRequest {}

export interface IGetUserMySelfResponse extends Response {
	nonSensitiveUser: INonSensitiveUser;
}

// update profile

export interface IUpdateProfileRequest {
	nickname?: string;
	imgUrl?: string;
}

export interface IUpdateProfileResponse {
	success: boolean;
}

export interface IUpdatePasswordRequest {
	originPassword: string;
	newPassword: string;
}
