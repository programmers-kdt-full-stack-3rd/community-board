import axios from "axios";
import { IReadRoomRequest } from "shared";

const apiClient = axios.create({
	baseURL: process.env.API_SERVER_ADDRESS || "http://localhost:8000",
	timeout: 5000,
	headers: {
		"Content-Type": "application/json",
	},
});

export const getMyRoomsToApi = async (params: IReadRoomRequest) => {
	return apiClient.get(`/api/chat/rooms`, {
		params,
	});
};
