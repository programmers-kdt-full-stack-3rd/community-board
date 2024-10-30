import { Response } from "../api";
import { ILoginUserInfo } from "./users";

// login

export interface ILoginRequest {
	email: string;
	password: string;
}

export interface ILoginResponse extends Response {
	userInfo: ILoginUserInfo;
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
