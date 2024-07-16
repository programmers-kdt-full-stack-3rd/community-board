import { HttpMethod, convertToBody, httpRequest } from "../api";

export const sendPostLoginRequest = async (body: object) => {
  return await httpRequest("user/login", HttpMethod.POST, convertToBody(body));
};

export const sendPostJoinRequest = async (body: object) => {
  return await httpRequest("user/Join", HttpMethod.POST, convertToBody(body));
};

export const sendPOSTCheckPasswordRequest = async (body: object) => {
  return await httpRequest(
    "user/check-password",
    HttpMethod.POST,
    convertToBody(body)
  );
};

export const sendPostLogoutRequest = async () => {
  return await httpRequest("user/logout", HttpMethod.POST);
};
