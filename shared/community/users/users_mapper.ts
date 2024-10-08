import { TOAuthProvider } from "../oauth/oauths";
import { INonSensitiveUser, IUserProfile } from "./users";

export const mapResponseToNonSensitiveUser = (
	response: any
): INonSensitiveUser => {
	return {
		email: response.email ?? null,
		nickname: response.nickname ?? "",
		connected_oauth:
			response.connected_oauth instanceof Array
				? (response.connected_oauth as TOAuthProvider[])
				: [],
	};
};

export const mapDBToUserProfile = (data: any): IUserProfile => {
	return {
		id: data.id,
		email: data.email,
		nickname: data.nickname,
		imgUrl: data.imgUrl,
	};
};
