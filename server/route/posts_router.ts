import express from 'express';
import { getPosts } from '../controller/posts_controller';

const router = express.Router();
router.use(express.json());

router.get("/", getPosts);

export default router;