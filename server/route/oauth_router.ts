import express from "express";
import {
	handleOAuthLoginUrlRead,
	handleOAuthLogin,
} from "../controller/oauth_controller";
import {
	getOAuthLoginUrlValidation,
	postOAuthLoginValidation,
} from "../utils/validations/oauth/oauth";

const router = express.Router();
router.use(express.json());

router.get(
	"/login-url/:provider",
	getOAuthLoginUrlValidation,
	handleOAuthLoginUrlRead
);
router.post("/login", postOAuthLoginValidation, handleOAuthLogin);

export default router;
