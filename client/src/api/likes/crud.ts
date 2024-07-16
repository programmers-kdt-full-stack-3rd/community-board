import { HttpMethod, httpRequest } from "../api";

export const sendCreatePostLikeRequest = async (param : number) => {
    const url = `/like/post/${param}`;
    return await httpRequest(url, HttpMethod.POST);
};

export const sendDeletePostLikeRequest = async (param : number) => {
    const url = `/like/post/${param}`;
    return await httpRequest(url, HttpMethod.DELETE);
};