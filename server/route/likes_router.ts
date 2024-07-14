import express from "express";
import { requireLogin } from "../middleware/auth";
import {
  handleLikeCreateWith,
  handleLikeDeleteWith,
} from "../controller/likes_controller";
import { likeValidationWith } from "../utils/validations/likes/like";

const router = express.Router();
router.use(express.json());

router
  .route("/post/:post_id")
  .post(requireLogin, likeValidationWith("post"), handleLikeCreateWith("post"))
  .delete(
    requireLogin,
    likeValidationWith("post"),
    handleLikeDeleteWith("post")
  );

router
  .route("/comment/:comment_id")
  .post(
    requireLogin,
    likeValidationWith("comment"),
    handleLikeCreateWith("comment")
  )
  .delete(
    requireLogin,
    likeValidationWith("comment"),
    handleLikeDeleteWith("comment")
  );

export default router;
