import { body, param } from "express-validator";
import { oAuthProviders } from "../../../db/model/oauth";
import { validate } from "../../../middleware/validate";
import { ERROR_MESSAGES } from "./constants";

export const oAuthProviderParamValidator = () => [
	param("provider")
		.isIn(oAuthProviders)
		.withMessage(ERROR_MESSAGES.INVALID_OAUTH_PROVIDER),
	validate,
];

export const oAuthLoginValidatior = () => [
	body("provider")
		.isIn(oAuthProviders)
		.withMessage(ERROR_MESSAGES.INVALID_OAUTH_PROVIDER),
	body("code")
		.notEmpty()
		.withMessage(ERROR_MESSAGES.AUTHORIZATION_CODE_REQUIRED)
		.bail()
		.isString()
		.withMessage(ERROR_MESSAGES.INVALID_AUTHORIZATION_CODE),
	validate,
];
