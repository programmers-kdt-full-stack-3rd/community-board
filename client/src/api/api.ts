import { useUserStore } from "../state/store";

export enum HttpMethod {
  POST = "POST",
  GET = "GET",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

const setLogoutUser = useUserStore.getState().actions.setLogoutUser;

const isLogin = useUserStore.getState().isLogin;

const isTokenExpired = (message: string) =>
  message === "Expired Token: 토큰이 만료 되었습니다.";

const isUnauthorized = (message: string) =>
  message === "Unauthorized: 로그인이 필요합니다.";

export const convertToBody = (body: object) => {
  return JSON.stringify(body);
};

export const httpRequest = async (
  address: string,
  method: HttpMethod,
  body?: string
) => {
  const requestAddress = `${
    import.meta.env.VITE_SERVER_ADDRESS
  }/api/${address}`;

  const response = await fetch(requestAddress, {
    method: method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  let responseJson;

  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    responseJson = await response.json();
  } else {
    const textResponse = await response.text();

    if (textResponse) {
      responseJson = JSON.parse(textResponse);
    }
  }

  if (
    response.status === 401 &&
    (isTokenExpired(responseJson.message) ||
      (isUnauthorized(responseJson.message) && isLogin))
  ) {
    setLogoutUser();
  }

  return {
    ...responseJson,
    status: response.status,
  };
};
