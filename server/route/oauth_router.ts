import express from "express";
import {
	handleOAuthLogin,
	handleOAuthReconfirm,
	handleOAuthLinkCreate,
	handleOAuthUrlReadFor,
	handleOAuthLinkDelete,
} from "../controller/oauth_controller";
import { requireLogin } from "../middleware/auth";
import {
	oAuthLoginValidatior,
	oAuthProviderParamValidator,
} from "../utils/validations/oauth/oauth";

const router = express.Router();
router.use(express.json());

router.get(
	"/login-url/:provider",
	oAuthProviderParamValidator(),
	handleOAuthUrlReadFor("login")
);
router.post("/login", oAuthLoginValidatior(), handleOAuthLogin);

router.get(
	"/reconfirm-url/:provider",
	oAuthProviderParamValidator(),
	handleOAuthUrlReadFor("reconfirm")
);
router.post(
	"/reconfirm",
	requireLogin,
	oAuthLoginValidatior(),
	handleOAuthReconfirm
);

router.get(
	"/link-url/:provider",
	oAuthProviderParamValidator(),
	handleOAuthUrlReadFor("link")
);
router.post(
	"/link",
	requireLogin,
	oAuthLoginValidatior(),
	handleOAuthLinkCreate
);

router.delete(
	"/link/:provider",
	requireLogin,
	oAuthProviderParamValidator(),
	handleOAuthLinkDelete
);

export default router;
