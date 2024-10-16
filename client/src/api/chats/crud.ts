import { ICreateRoomRequest } from "shared";
import { HttpMethod, convertToBody, httpRequest } from "../api";

export const sendCreateRoomRequest = async (body: ICreateRoomRequest) => {
	const requestBody = convertToBody(body);
	return await httpRequest(`chat/room`, HttpMethod.POST, requestBody);
};

export const sendGetRoomHeadersRequest = async (query: string) => {
	const url = `chat/rooms/${query}`;
	return await httpRequest(url, HttpMethod.GET);
};

export const sendGetRoomMembersRequest = async (roomId: number) => {
	const url = `chat/members/${roomId}`;
	return await httpRequest(url, HttpMethod.GET);
};

export const sendJoinRoomRequest = async (roomId: number) => {
	const requestBody = convertToBody({ roomId: roomId });
	const url = `chat/join`;
	return await httpRequest(url, HttpMethod.POST, requestBody);
};
