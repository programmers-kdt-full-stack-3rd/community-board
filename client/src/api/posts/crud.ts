import { HttpMethod, convertToBody, httpRequest } from "../api"

export const sendGetPostsRequest = async (query? : string) => {
    const url = query ? `post${query}` : `post`;
    
    return await httpRequest(url, HttpMethod.GET);
}

export const sendGetPostRequest = async (param : string) => {
    const url = `post/${param}`
    return await httpRequest(url, HttpMethod.GET);
}

export const sendCreatePostRequest = async (body : object) => {
    const requestBody = convertToBody(body);
    return await httpRequest(`post`, HttpMethod.POST, requestBody);
}

export const sendUpdatePostRequest = async (postId: number, body : object) => {
    const url = `post/${postId}`
    const requestBody = convertToBody(body);
    return await httpRequest(url, HttpMethod.PATCH, requestBody);
}

export const sendDeletePostRequest = async (param : string) => {
    const url = `post/${param}`
    return await httpRequest(url, HttpMethod.DELETE);
}
