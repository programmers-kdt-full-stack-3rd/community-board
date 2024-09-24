export const USER_ERROR_CODES = {
	DUPLICATE_ENTRY: "ER_DUP_ENTRY",
};

export const USER_ERROR_MESSAGES = {
	DUPLICATE_EMAIL: "이미 존재하는 이메일 주소입니다.",
	DELETED_EMAIL: "탈퇴한 회원의 이메일입니다.",
	DUPLICATE_NICKNAME: "이미 사용 중인 닉네임입니다.",
	DUPLICATE_DATA: "중복된 데이터가 존재합니다.",
	USER_CREATION_ERROR: "사용자 생성 중 오류가 발생했습니다.",
	NOT_FOUND_EMAIL: "존재하지 않는 이메일 입니다.",
	NOT_FOUND_USER: "존재하지 않는 회원입니다.",
	DELETED_USER: "탈퇴한 회원입니다.",
	INVALID_LOGIN: "이메일 또는 비밀번호가 틀렸습니다.",
	FAILED_TOKEN_DELETE: "토큰 삭제 실패",
	INVALID_PASSWORD: "비밀번호가 틀렸습니다.",
	CANNOT_CHANGE_EMAIL: "한번 등록한 이메일은 변경할 수 없습니다.",
	SOCIAL_USER_NEED_EMAIL:
		"소셜 로그인으로 가입한 유저는 최초 정보 수정 시 이메일을 등록해야 합니다.",
	SAME_PASSWORD: "비밀번호가 현재와 동일합니다.",
	UPDATE_RESISTER_USER_EMAIL:
		"소셜 로그인으로 가입한 회원 정보에 이메일 등록 실패",
	UPDATE_USER_ERROR: "회원정보 수정 실패",
	DELETE_OAUTH_CONNECTION_ERROR: "소셜 로그인 전체 연동 해제 실패",
	DELETE_USER_ERROR: "사용자 삭제 실패",
};

export const PASSWORD_POLICY = {
	minLength: 10,
	minLowercase: 1,
	minUppercase: 1,
	minNumbers: 1,
	minSymbols: 0,
};

export const VALIDATION_ERROR_MESSAGES = {
	EMAIL_REQUIRED: "이메일을 입력해주십시오.",
	INVALID_EMAIL: "이메일 형식이 아닙니다.",
	PASSWORD_REQUIRED: "비밀번호를 입력해주십시오.",
	INVALID_PASSWORD: "올바른 형태의 비밀번호가 아닙니다.",
	NICKNAME_REQUIRED: "닉네임을 입력해주십시오.",
	LOGIN_FAILED: "이메일 또는 비밀번호가 틀렸습니다.",
	PASSWORD_CHECK_FAILED: "비밀번호가 틀렸습니다.",
	REQUIRED_PASSWORD_MISSING: "비밀번호 확인을 입력하세요.",
	REQUIRED_PASSWORD_MISMATCH: "비밀번호가 일치하지 않습니다.",
};

export const COOKIE_MAX_AGE = {
	accessToken: 1000 * 60 * 60,
	refreshToken: 1000 * 60 * 60 * 24,
	tempToken: 1000 * 60 * 60,
};
