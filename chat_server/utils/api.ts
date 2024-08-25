import axios from "axios";
import { IJoinRoomRequest, IReadRoomRequest } from "shared";

const apiClient = axios.create({
	baseURL: process.env.API_SERVER_ADDRESS || "http://localhost:8000",
	timeout: 5000,
	headers: {
		"Content-Type": "application/json",
	},
});

export const getMyRoomsToApi = async (
	params: IReadRoomRequest,
	cookies: string
) => {
	return apiClient.get(`/api/chat/rooms`, {
		params,
		headers: {
			Cookie: `${cookies}`,
		},
	});
};

export const joinRoomToApi = async (
	params: IJoinRoomRequest,
	cookies: string
) => {
	return apiClient.post(`/api/chat/join`, {
		params,
		headers: {
			Cookie: `${cookies}`,
		},
	});
};
