export const COOKIE_CONSTANTS = {
	ACCESS_TOKEN: "accessToken",
	REFRESH_TOKEN: "refreshToken",
} as const;

export const ERROR_MESSAGES = {
	DELETED_USER: "탈퇴한 회원입니다.",
	INVALID_TOKEN: "검증되지 않은 토큰입니다.",
	EXPIRED_TOKEN: "토큰이 만료되었습니다.",
} as const;
