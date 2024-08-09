import { param } from "express-validator";
import { validate } from "../../../middleware/validate";
import { TLikeTarget } from "../../../db/model/likes";
import { ERROR_MESSAGES } from "./constants";

export const likeValidationWith = (targetType: TLikeTarget) => [
	param(`${targetType}_id`)
		.notEmpty()
		.withMessage(ERROR_MESSAGES.TARGET_ID_REQUIRED(targetType))
		.bail()
		.isInt({ min: 1 })
		.withMessage(ERROR_MESSAGES.INVALID_TARGET_ID(targetType)),
	validate,
];
