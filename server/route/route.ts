import express from 'express';
import { doTest } from '../controller/testController';
import postRouter from "./posts_router";

const router = express.Router();
router.use(express.json());

// router 등록
router.use("/post", postRouter);

// 테스팅 api -> 추후 삭제
router.get("/", doTest);


export default router;