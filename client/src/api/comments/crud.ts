import { HttpMethod, convertToBody, httpRequest } from "../api";

export const sendGetCommentsRequest = async (query?: string) => {
  const url = `comment${query}`;
  return await httpRequest(url, HttpMethod.GET);
};

export const sendPostCommentRequest = async (body: object) => {
  const requestBody = convertToBody(body);
  return await httpRequest("comment", HttpMethod.POST, requestBody);
};

export const sendPatchCommentRequest = async (body: object) => {
  const requestBody = convertToBody(body);
  return await httpRequest("comment", HttpMethod.PATCH, requestBody);
};

export const sendDeleteCommentRequest = async (commentId: number) => {
  const url = `comment/${commentId}`;
  return await httpRequest(url, HttpMethod.DELETE);
};
