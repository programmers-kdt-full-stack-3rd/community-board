import express from "express";
import {
	handleOAuthLoginUrlRead,
	handleOAuthLogin,
	handleOAuthReconfirmUrlRead,
} from "../controller/oauth_controller";
import {
	getOAuthLoginUrlValidator,
	postOAuthLoginValidation,
} from "../utils/validations/oauth/oauth";

const router = express.Router();
router.use(express.json());

router.get(
	"/login-url/:provider",
	getOAuthLoginUrlValidator(),
	handleOAuthLoginUrlRead
);
router.post("/login", postOAuthLoginValidation, handleOAuthLogin);

router.get(
	"/reconfirm-url/:provider",
	getOAuthLoginUrlValidator(),
	handleOAuthReconfirmUrlRead
);

export default router;
