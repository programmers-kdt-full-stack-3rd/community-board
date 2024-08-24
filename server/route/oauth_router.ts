import express from "express";
import {
	handleOAuthLogin,
	handleOAuthReconfirm,
	handleOAuthLinkCreate,
	handleOAuthUrlReadFor,
} from "../controller/oauth_controller";
import { requireLogin } from "../middleware/auth";
import {
	getOAuthLoginUrlValidator,
	postOAuthLoginValidatior,
} from "../utils/validations/oauth/oauth";

const router = express.Router();
router.use(express.json());

router.get(
	"/login-url/:provider",
	getOAuthLoginUrlValidator(),
	handleOAuthUrlReadFor("login")
);
router.post("/login", postOAuthLoginValidatior(), handleOAuthLogin);

router.get(
	"/reconfirm-url/:provider",
	getOAuthLoginUrlValidator(),
	handleOAuthUrlReadFor("reconfirm")
);
router.post(
	"/reconfirm",
	requireLogin,
	postOAuthLoginValidatior(),
	handleOAuthReconfirm
);

router.get(
	"/link-url/:provider",
	getOAuthLoginUrlValidator(),
	handleOAuthUrlReadFor("link")
);
router.post(
	"/link",
	requireLogin,
	postOAuthLoginValidatior(),
	handleOAuthLinkCreate
);

export default router;
