import { HttpMethod, convertToBody, httpRequest } from "../api";

export type TPostListClientSearchParams = {
	index: number;
	perPage: number;
	sortBy: number;
	keyword: string;
};

type TPostListRequestSearchParams = TPostListClientSearchParams & {
	category_id: number;
};

export const sendGetPostsRequest = async (
	param: Partial<TPostListRequestSearchParams>
) => {
	const stringified: Record<string, string> = {
		index: "1",
		perPage: "10",
	};

	for (const key in param) {
		const value = param[key as keyof TPostListRequestSearchParams];

		if (value !== undefined) {
			stringified[key] = String(value);
		}
	}

	const searchParams = new URLSearchParams(stringified);
	return await httpRequest(`post?${searchParams.toString()}`, HttpMethod.GET);
};

export const sendGetPostRequest = async (param: string) => {
	const url = `post/${param}`;
	return await httpRequest(url, HttpMethod.GET);
};

export const sendCreatePostRequest = async (body: object) => {
	const requestBody = convertToBody(body);
	return await httpRequest(`post`, HttpMethod.POST, requestBody);
};

export const sendUpdatePostRequest = async (postId: number, body: object) => {
	const url = `post/${postId}`;
	const requestBody = convertToBody(body);
	return await httpRequest(url, HttpMethod.PATCH, requestBody);
};

export const sendDeletePostRequest = async (param: string) => {
	const url = `post/${param}`;
	return await httpRequest(url, HttpMethod.DELETE);
};

export const uploadImageRequest = async (file: File | Blob) => {
	const url = `image`;

	const form = new FormData();

	form.append("image", file, "image");

	return await httpRequest(url, HttpMethod.POST, form, true);
};
