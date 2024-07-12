import express from 'express';
import { handlePostRead, handlePostsRead, handlePostCreate, handlePostUpdate, handlePostDelete } from '../controller/posts_controller';
import { body, param } from "express-validator";
import { validate } from "../middleware/validate";
import { requireLogin } from '../middleware/auth';

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

const deleteValidation = [
  param('post_id')
  .notEmpty()
  .isInt({ min : 1 })
  .withMessage("유효하지 않은 게시글입니다.")
  .bail(),
  validate
];

const router = express.Router();
router.use(express.json());

router.get("/", handlePostsRead);
router.get("/:post_id", handlePostRead);

router.post("/", requireLogin, postBodyValidation, handlePostCreate);

router.patch("/:post_id", requireLogin, patchBodyValidation, handlePostUpdate);

router.delete("/:post_id", requireLogin, deleteValidation, handlePostDelete);

export default router;