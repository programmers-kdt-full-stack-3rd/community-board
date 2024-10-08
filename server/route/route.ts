import express from "express";
import postRouter from "./posts_router";
import userRouter from "./users_router";
import commentRouter from "./comments_router";
import likeRouter from "./likes_router";
import chatRouter from "./chats_router";
import adminRouter from "./admin_router";
import oauthRouter from "./oauth_router";
import imageRouter from "./image_router";

const router = express.Router();
router.use(express.json());

// router 등록
router.use("/post", postRouter);
router.use("/comment", commentRouter);
router.use("/user", userRouter);
router.use("/like", likeRouter);
router.use("/chat", chatRouter);
router.use("/admin", adminRouter);
router.use("/oauth", oauthRouter);
router.use("/image", imageRouter);

export default router;
