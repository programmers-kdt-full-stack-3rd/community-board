import { HttpMethod, convertToBody, httpRequest } from "../api"

export const sendGetTestRequest = async () => {
    return await httpRequest('test', HttpMethod.GET);
}

export const sendPostTestRequest = async (body : object) => {
    return await httpRequest('test', HttpMethod.POST, convertToBody(body));
}