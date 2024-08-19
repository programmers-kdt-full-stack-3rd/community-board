import { body } from "express-validator";
import { validate } from "../../../middleware/validate";
import { ERROR_MESSAGES, PASSWORD_POLICY } from "./constants";

type TErrorMessage = (typeof ERROR_MESSAGES)[keyof typeof ERROR_MESSAGES];

/*
  Validators
  - 각 입력 값에 대한 유효성 검사
*/

/**
 * 이메일 유효성 검사
 * @param invalidMessage 유효하지 않은 이메일 형식에 대한 오류 메시지
 */
const emailValidator = (
	invalidMessage: TErrorMessage = ERROR_MESSAGES.INVALID_EMAIL
) =>
	body("email")
		.notEmpty()
		.withMessage(ERROR_MESSAGES.EMAIL_REQUIRED)
		.bail()
		.isEmail()
		.withMessage(invalidMessage);

/**
 * 비밀번호 유효성 검사
 * @param invalidMessage 유효하지 않은 비밀번호 형식에 대한 오류 메시지
 */
const passwordValidator = (
	invalidMessage: TErrorMessage = ERROR_MESSAGES.INVALID_PASSWORD
) =>
	body("password")
		.notEmpty()
		.withMessage(ERROR_MESSAGES.PASSWORD_REQUIRED)
		.bail()
		.isStrongPassword(PASSWORD_POLICY)
		.withMessage(invalidMessage);

/**
 * 비밀번호 확인 유효성 검사
 */
const requiredPasswordValidator = () =>
	body("requiredPassword")
		.notEmpty()
		.withMessage(ERROR_MESSAGES.REQUIRED_PASSWORD_MISSING)
		.bail()
		.custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error(ERROR_MESSAGES.REQUIRED_PASSWORD_MISMATCH);
			}
			return true;
		});

/**
 * 닉네임 유효성 검사
 */
const nicknameValidator = () =>
	body("nickname").notEmpty().withMessage(ERROR_MESSAGES.NICKNAME_REQUIRED);

/*
  Validation
  - 각 API 엔드포인트에 대한 유효성 검사
*/

/**
 * 회원가입 API 유효성 검사
 */
export const joinValidation = [
	emailValidator(),
	passwordValidator(),
	requiredPasswordValidator(),
	nicknameValidator(),
	validate,
];

/**
 * 로그인 API 유효성 검사
 */
export const loginValidation = [
	emailValidator(ERROR_MESSAGES.LOGIN_FAILED),
	passwordValidator(ERROR_MESSAGES.LOGIN_FAILED),
	validate,
];

/**
 * 회원 정보 수정 API 유효성 검사
 */
export const updateUserValidation = [
	nicknameValidator(),
	passwordValidator(),
	validate,
];

/**
 * 비밀번호 확인 API 유효성 검사
 */
export const checkPasswordValidation = [
	passwordValidator(ERROR_MESSAGES.PASSWORD_CHECK_FAILED),
	validate,
];
