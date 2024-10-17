import { HttpMethod, convertToBody, httpRequest } from "../api";

export const sendQnaAcceptedCommentIdsRequest = async (body: {
	postIds: number[];
}) => {
	const requestBody = convertToBody(body);
	return await httpRequest("post/qna", HttpMethod.POST, requestBody);
};

export const sendQnaAcceptCommentRequest = async (body: {
	postId: number;
	commentId: number;
}) => {
	const requestBody = convertToBody(body);
	return await httpRequest("post/qna/accept", HttpMethod.POST, requestBody);
};
