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
      }).withMessage("수정 사항이 없습니다.");

const deleteValidator =
    param('post_id')
        .notEmpty()
        .isInt({ min : 1 })
        .withMessage("유효하지 않은 게시글입니다.")
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