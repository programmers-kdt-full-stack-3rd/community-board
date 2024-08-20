import { param } from "express-validator";
import { ERROR_MESSAGES } from "./constants";
import { validate } from "../../../middleware/validate";

/*
  Validators
  - 각 입력 값에 대한 유효성 검사
*/
const userIdValidator = () =>
	param("userId")
		.isInt({ min: 1 })
		.withMessage(ERROR_MESSAGES.INVALID_USER_ID);

const postIdValidator = () =>
	param("postId")
		.isInt({ min: 1 })
		.withMessage(ERROR_MESSAGES.INVALID_POST_ID);

/*
  Validation
  - 각 API 엔드포인트에 대한 유효성 검사
*/
export const deleteUserValidation = [userIdValidator(), validate];
export const restoreUserValidation = [userIdValidator(), validate];

export const deletePostValidation = [postIdValidator(), validate];
export const restorePostValidation = [postIdValidator(), validate];
export const publicPostValidation = [postIdValidator(), validate];
export const privatePostValidation = [postIdValidator(), validate];

export const getUserLogsValidation = [userIdValidator(), validate];

export const getUserStatValidation = [userIdValidator(), validate];
