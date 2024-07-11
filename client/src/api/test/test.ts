import { HttpMethod, httpRequest } from "../api"

export const sendGetTestRequest = async () => {
    return await httpRequest('test', HttpMethod.GET);
}