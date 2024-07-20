import { useUserStore } from "../state/store";
import { ClientError } from "./errors";
import { isTokenError, isUnauthorized } from "./users/utils";

export enum HttpMethod {
  POST = "POST",
  GET = "GET",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

const setLogoutUser = useUserStore.getState().actions.setLogoutUser;
const isLogin = useUserStore.getState().isLogin;

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

  return {
    ...responseJson,
    status: response.status,
  };
};

export const ApiCall = async(func : () => Promise<any>, onError? : () => void) => {
    func().then((res)=>{
      if(res.status >= 400){
        throw ClientError.autoFindErrorType(res.code, res.message);
      }
      // TODO : 지우기
      console.log(res);
      return res;
    }).catch((err : ClientError)=>{
      // TODO : 각각의 에러 상황 핸들링하기 + 출력 지우기
      if(err.code === 400){
        if(onError){
          onError();
        } else {
          alert(err.message);
        }
      }

      if (err.code === 401){
        if(isTokenError(err.message) || isUnauthorized(err.message) && isLogin){
          if(onError){
            onError();
          } else {
            alert("로그인이 만료되었습니다");
          }
          setLogoutUser();
        }
      }
    });
};