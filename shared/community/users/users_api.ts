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
