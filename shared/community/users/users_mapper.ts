import { TOAuthProvider } from "../oauth/oauths";
import { INonSensitiveUser } from "./users";

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
