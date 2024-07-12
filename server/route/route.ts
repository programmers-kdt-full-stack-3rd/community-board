import express from "express";
import { doTest, doTest2 } from "../controller/testController";
import postRouter from "./posts_router";
import userRouter from "./users_router";
import commentRouter from "./comments_router";


const router = express.Router();
router.use(express.json());

// router 등록
router.use("/post", postRouter);
router.use("/comment", commentRouter);
router.use("/user", userRouter);

// 테스팅 api -> 추후 삭제
router.get("/test", doTest);
router.post("/test", doTest2);

export default router;
