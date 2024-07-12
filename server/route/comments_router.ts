import express from "express";
import {
  handleCommentCreate,
  handleCommentDelete,
  handleCommentsRead,
  handleCommentUpdate,
} from "../controller/comments_controller";
import { requireLogin } from "../middleware/auth";
import {
  deleteCommentValidation,
  getCommentsValidation,
  patchCommentValidation,
  postCommentValidation,
} from "../utils/validations/comments/comment";

const router = express.Router();
router.use(express.json());

router.get("/", getCommentsValidation, handleCommentsRead);
router.post("/", requireLogin, postCommentValidation, handleCommentCreate);
router.patch("/", requireLogin, patchCommentValidation, handleCommentUpdate);
router.delete(
  "/:comment_id",
  requireLogin,
  deleteCommentValidation,
  handleCommentDelete
);

export default router;
