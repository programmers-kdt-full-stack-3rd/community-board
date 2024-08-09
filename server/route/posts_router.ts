import express from "express";
import {
	handlePostRead,
	handlePostsRead,
	handlePostCreate,
	handlePostUpdate,
	handlePostDelete,
} from "../controller/posts_controller";
import { requireLogin } from "../middleware/auth";
import {
	deleteValidation,
	patchValidation,
	postValidation,
} from "../utils/validations/posts/posts";

const router = express.Router();
router.use(express.json());

router.get("/", handlePostsRead);
router.get("/:post_id", handlePostRead);

router.post("/", requireLogin, postValidation, handlePostCreate);

router.patch("/:post_id", requireLogin, patchValidation, handlePostUpdate);

router.delete("/:post_id", requireLogin, deleteValidation, handlePostDelete);

export default router;
