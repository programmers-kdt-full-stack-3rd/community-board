import express from 'express';
import { createPost, getPost, getPosts } from '../controller/posts_controller';
import { body } from "express-validator";
import { validate } from "../middleware/validate";

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

const router = express.Router();
router.use(express.json());

router.get("/", getPosts);
router.get("/:post_id", getPost);

router.post("/", postBodyValidation, createPost);

export default router;