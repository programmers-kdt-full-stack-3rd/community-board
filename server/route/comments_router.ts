import express from "express";
import { getCommentsByPostId } from "../controller/comments_controller";

const router = express.Router();
router.use(express.json());

router.get("/:post_id", getCommentsByPostId);

export default router;
