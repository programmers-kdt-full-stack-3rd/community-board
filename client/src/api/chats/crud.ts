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

interface IJoinRoomRequest {
	roomId: number;
	isPrivate: boolean;
	password: string;
	nickname?: string;
}

export const sendJoinRoomRequest = async (body: IJoinRoomRequest) => {
	const requestBody = convertToBody(body);
	const url = `chat/join`;
	return await httpRequest(url, HttpMethod.POST, requestBody);
};
