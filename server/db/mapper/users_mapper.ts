import { IUser } from "../model/users";

export const mapDBToPartialUser = (data: any): Partial<IUser> => {
	return {
		id: data.id,
		email: data.email,
		nickname: data.nickname,
		isDelete: data.isDelete ? true : false,
		password: data.password,
		salt: data.salt,
	};
};
