import express from 'express';
import { getPost, getPosts } from '../controller/posts_controller';

const router = express.Router();
router.use(express.json());

router.get("/", getPosts);
router.get("/:post_id", getPost);

export default router;