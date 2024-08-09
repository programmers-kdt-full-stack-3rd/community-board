export const isTokenError = (message: string) =>
	message.indexOf("Token") !== -1;

export const isUnauthorized = (message: string) =>
	message === "Unauthorized: 로그인이 필요합니다.";
