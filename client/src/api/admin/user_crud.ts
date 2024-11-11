import { TInterval } from "shared";
import { HttpMethod, httpRequest } from "../api";

export const sendGetAdminUsersRequest = async (
	currentPage: number,
	itemsPerPage: number,
	nickname: string,
	email: string
) => {
	const url = `admin/user?index=${currentPage}&perPage=${itemsPerPage}${nickname ? `&nickname=${encodeURIComponent(nickname)}` : ""}${email ? `&email=${encodeURIComponent(email)}` : ""}`;
	return await httpRequest(url, HttpMethod.GET);
};

export const handleDeleteAdminUser = async (userId: number) => {
	const url = `admin/user/${userId}`;
	return await httpRequest(url, HttpMethod.DELETE);
};

export const handleRestoreAdminUser = async (userId: number) => {
	const url = `admin/user/${userId}/restore`;
	return await httpRequest(url, HttpMethod.PATCH);
};

export const fetchUserLogs = async (
	userId: number,
	currentPage: number,
	itemsPerPage: number
) => {
	const url = `admin/log/${userId}?index=${currentPage}&perPage=${itemsPerPage}`;
	return await httpRequest(url, HttpMethod.GET);
};

export const fetchUserStats = async (userId: number) => {
	const url = `admin/stat/${userId}`;
	return await httpRequest(url, HttpMethod.GET);
};

export const fetchTotalStats = async (
	startDate: string,
	endDate: string,
	interval: TInterval
) => {
	const url = `admin/stat?startDate=${startDate}&endDate=${endDate}&interval=${interval}`;
	return await httpRequest(url, HttpMethod.GET);
};
