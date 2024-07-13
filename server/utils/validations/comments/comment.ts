import { body, check, param, query } from "express-validator";
import { validate } from "../../../middleware/validate";
import { ERROR_MESSAGES } from "./constants";

/** Request body의 댓글 본문 유효성 검사 */
const bodyContentValidator = () =>
  body("content")
    .notEmpty()
    .withMessage(ERROR_MESSAGES.CONTENT_REQUIRED)
    .bail()
    .isString()
    .withMessage(ERROR_MESSAGES.INVALID_CONTENT);

/**
 * 게시글 ID 유효성 검사
 * @param checkFunction - 유효성 검사 함수 (`body`, `param`, `query`, ...)
 * @param name - 필드명 (기본값: `"post_id"`)
 */
const postIdValidator = (
  checkFunction: typeof check,
  name: string = "post_id"
) =>
  checkFunction(name)
    .notEmpty()
    .withMessage(ERROR_MESSAGES.POST_ID_REQUIRED)
    .bail()
    .isInt({ min: 1 })
    .withMessage(ERROR_MESSAGES.INVALID_POST_ID);

/**
 * 댓글 ID 유효성 검사
 * @param checkFunction - 유효성 검사 함수 (`body`, `param`, `query`, ...)
 * @param name 필드명 (기본값: `"comment_id"`)
 */
const commentIdValidator = (
  checkFunction: typeof check,
  name: string = "comment_id"
) =>
  checkFunction(name)
    .notEmpty()
    .withMessage(ERROR_MESSAGES.COMMENT_ID_REQUIRED)
    .bail()
    .isInt({ min: 1 })
    .withMessage(ERROR_MESSAGES.INVALID_COMMENT_ID);

/** 댓글 목록 조회 API 유효성 검사 */
export const getCommentsValidation = [postIdValidator(query), validate];

/** 댓글 등록 API 유효성 검사 */
export const postCommentValidation = [
  bodyContentValidator(),
  postIdValidator(body),
  validate,
];

/** 댓글 수정 API 유효성 검사 */
export const patchCommentValidation = [
  commentIdValidator(body, "id"),
  bodyContentValidator(),
  validate,
];

/** 댓글 삭제 API 유효성 검사 */
export const deleteCommentValidation = [commentIdValidator(param), validate];
