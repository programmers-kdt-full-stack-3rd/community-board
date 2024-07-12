import { HttpMethod, httpRequest } from "../api"

export const sendGetPostsRequest = async (query? : string) => {
    const url = query ? `post/${query}` : `post`;
    
    return await httpRequest(url, HttpMethod.GET);
}

export const sendGetPostRequest = async (param : string) => {
    const url = `post/${param}`
    return await httpRequest(url, HttpMethod.GET);
}