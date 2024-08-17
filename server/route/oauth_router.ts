import express from "express";
import {
	handleOAuthLoginUrlRead,
	handleOAuthLogin,
} from "../controller/oauth_controller";

const router = express.Router();
router.use(express.json());

// TODO: {provider}는 TOAuthProvider 타입임을 고려하여 유효성 검사 작성
router.get("/login-url/:provider", handleOAuthLoginUrlRead);
router.post("/login", handleOAuthLogin);

export default router;
