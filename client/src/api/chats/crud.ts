import { ICreateRoomRequest } from "shared";
import { HttpMethod, convertToBody, httpRequest } from "../api";

export const sendCreateRoomRequest = async (body: ICreateRoomRequest) => {
	const requestBody = convertToBody(body);
	return await httpRequest(`chat/room`, HttpMethod.POST, requestBody);
};
