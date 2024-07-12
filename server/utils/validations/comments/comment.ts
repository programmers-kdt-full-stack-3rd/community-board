import { body, check, param, query } from "express-validator";
import { validate } from "../../../middleware/validate";

/** Request body의 댓글 본문 유효성 검사 */
const bodyContentValidator = () =>
  body("content")
    .notEmpty()
    .withMessage("본문을 입력해 주십시오.")
    .bail()
    .isString()
    .withMessage("본문이 문자열이 아닙니다.");

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
    .withMessage("게시글 ID를 입력해 주십시오.")
    .bail()
    .isInt({ min: 1 })
    .withMessage("게시글 ID가 양의 정수가 아닙니다.");

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
    .withMessage("댓글 ID를 입력해 주십시오.")
    .bail()
    .isInt({ min: 1 })
    .withMessage("댓글 ID가 양의 정수가 아닙니다.");

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
