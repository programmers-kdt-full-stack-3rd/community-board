import { HttpMethod, httpRequest } from "../api";

export const sendGetAdminPostsRequest = async (
	currentPage: number,
	itemsPerPage: number,
	keyword: string
) => {
	const url = `admin/post?index=${currentPage}&perPage=${itemsPerPage}${keyword ? `&keyword=${encodeURIComponent(keyword)}` : ""}`;
	return await httpRequest(url, HttpMethod.GET);
};

export const handleDeleteAdminPost = async (postId: number) => {
	const url = `admin/post/${postId}`;
	return await httpRequest(url, HttpMethod.DELETE);
};

export const handleRestoreAdminPost = async (postId: number) => {
	const url = `admin/post/${postId}/restore`;
	return await httpRequest(url, HttpMethod.PATCH);
};

export const handleAdminPostPublic = async (postId: number) => {
	const url = `admin/post/${postId}/public`;
	return await httpRequest(url, HttpMethod.PATCH);
};

export const handleAdminPostPrivate = async (postId: number) => {
	const url = `admin/post/${postId}/private`;
	return await httpRequest(url, HttpMethod.PATCH);
};
