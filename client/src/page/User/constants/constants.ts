export const REGEX = {
	EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/,
	PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/,
	NICKNAME: /^[가-힣a-zA-Z0-9]{1,12}$/,
};

export const ERROR_MESSAGE = {
	EMAIL_REGEX: "올바른 이메일 형식이 아닙니다.",
	EMAIL_DUPLE: "중복되는 이메일입니다.",
	NICKNAME_REGEX: "12자 이하의 한글, 영문, 숫자를 사용해주세요.",
	NICKNAME_DUPLE: "중복되는 닉네임입니다.",
	PASSWORD_REGEX: "10자 이상의 영문 대/소문자, 숫자를 사용해 주세요.",
	PASSWORD_MISMATCH: "비밀번호가 일치하지 않습니다.",
};
