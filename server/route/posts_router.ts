import express from 'express';
import { createPost, getPost, getPosts, patchPost } from '../controller/posts_controller';
import { body, check } from "express-validator";
import { validate } from "../middleware/validate";
import { ServerError } from '../middleware/errors';

// Request body 유효성 검사
const postBodyValidation = [
  body("title")
    .notEmpty()
    .withMessage("게시글 제목을 입력해주세요.")
    .bail(),
  body("content")
    .notEmpty()
    .withMessage("게시글 내용을 입력해주세요.")
    .bail(),
  validate,
];

const patchBodyValidation = [
  body("title").custom((value, { req }) => {
    return value || req.body.content;
  }).withMessage("수정 사항이 없습니다."),
  validate
];

const router = express.Router();
router.use(express.json());

router.get("/", getPosts);
router.get("/:post_id", getPost);

router.post("/", postBodyValidation, createPost);

router.patch("/:post_id", patchBodyValidation, patchPost);

export default router;