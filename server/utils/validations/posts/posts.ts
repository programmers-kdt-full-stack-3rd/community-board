import { body, param } from "express-validator";
import { validate } from "../../../middleware/validate";
import { ERROR_MESSAGES } from "./constants";

const postTitleValidator = body("title")
        .notEmpty()
        .withMessage(ERROR_MESSAGES.TITLE_REQUIRED)
        .bail();

const postContentValidator = body("content")
        .notEmpty()
        .withMessage(ERROR_MESSAGES.CONTENT_REQUIRED)
        .bail();

const patchBodyValidator =
    body("title").custom((value, { req }) => {
        return value || req.body.content;
      }).withMessage(ERROR_MESSAGES.UPDATE_DATA_REQUIRED);

const deleteValidator =
    param('post_id')
        .notEmpty()
        .isInt({ min : 1 })
        .withMessage(ERROR_MESSAGES.INVALID_POSR_ID)
        .bail();

export const postValidation = [
    postTitleValidator,
    postContentValidator,
    validate
];

export const patchValidation = [
    patchBodyValidator,
    validate
];

export const deleteValidation = [
    deleteValidator,
    validate
];