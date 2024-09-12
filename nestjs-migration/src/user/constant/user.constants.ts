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
