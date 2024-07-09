import express from "express";
import { body, param } from "express-validator";
import {
  createCommentByPostId,
  getCommentsByPostId,
} from "../controller/comments_controller";
import { validate } from "../middleware/validate";

const postCommentValidation = [
  body("content")
    .notEmpty()
    .withMessage("본문을 입력해 주십시오.")
    .bail()
    .isString()
    .withMessage("본문이 문자열이 아닙니다."),
  param("post_id")
    .notEmpty()
    .withMessage("게시글 ID를 입력해 주십시오.")
    .bail()
    .isInt({ min: 1 })
    .withMessage("게시글 ID가 양의 정수가 아닙니다."),
  validate,
];

const router = express.Router();
router.use(express.json());

router.get("/:post_id", getCommentsByPostId);
router.post("/:post_id", postCommentValidation, createCommentByPostId);

export default router;
