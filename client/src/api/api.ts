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
	body?: string | FormData,
	isMultipart?: boolean
) => {
	let requestAddress = `${
		import.meta.env.VITE_SERVER_ADDRESS
	}/api/${address}`;

	requestAddress = requestAddress.replace(/([^:]\/)\/+/g, "$1");

	const requestInit: RequestInit = {
		method: method,
		credentials: "include",
		body,
	};

	if (!isMultipart) {
		requestInit.headers = {
			"Content-Type": "application/json",
		};
	}

	const response = await fetch(requestAddress, requestInit);

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

export const handleApiError = (
	error: ClientError,
	onError: (err: ClientError) => void
) => {
	switch (error.code) {
		/* bad request */
		case 400:
			onError(error);
			break;
		/* unauthorized or tokenError */
		case 401:
			if (
				isTokenError(error.message) ||
				(isUnauthorized(error.message) && isLogin)
			) {
				setLogoutUser();
				onError(error);
			} else {
				onError(error);
				console.log(error.message);
			}
			break;
		/* not found */
		case 404:
			onError(error);
			console.log(error.message);
			break;
		/* server error */
		case 500:
			onError(error);
			console.log(error.message);
			break;
		/* 기타 에러 */
		default:
			onError(error);
			console.log(error.message);
			break;
	}
};

export const ApiCall = async (
	func: () => Promise<any>,
	onError: (err: ClientError) => void
) => {
	return func()
		.then(res => {
			if (res.status >= 400) {
				throw ClientError.autoFindErrorType(res.status, res.message);
			}
			return res;
		})
		.catch((err: ClientError) => {
			// TODO : 각각의 에러 상황 핸들링하기 + 출력 지우기
			handleApiError(err, onError);
			return err;
		});
};
