export const USER_ERROR_CODES = {
	DUPLICATE_ENTRY: "ER_DUP_ENTRY",
};

export const USER_ERROR_MESSAGES = {
	DUPLICATE_ENTRY: "이미 존재하는 이메일입니다.",
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
