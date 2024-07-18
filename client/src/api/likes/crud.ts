import { HttpMethod, httpRequest } from "../api";

export const sendCreatePostLikeRequest = async (param : number) => {
    const url = `/like/post/${param}`;
    return await httpRequest(url, HttpMethod.POST);
};

export const sendDeletePostLikeRequest = async (param : number) => {
    const url = `/like/post/${param}`;
    return await httpRequest(url, HttpMethod.DELETE);
};

export const sendCreateCommentLikeRequest = async (param : number) => {
    const url = `/like/comment/${param}`;
    return await httpRequest(url, HttpMethod.POST);
};

export const sendDeleteCommentLikeRequest = async (param : number) => {
    const url = `/like/comment/${param}`;
    return await httpRequest(url, HttpMethod.DELETE);
};
