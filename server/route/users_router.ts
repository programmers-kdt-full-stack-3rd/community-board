import express from "express";
import {
	handleLoginUser,
	handleLogoutUser,
	handleJoinUser,
	handleUpdateUser,
	handleCheckPassword,
	handleCheckNickname,
	handleDeleteUser,
	handleReadUser,
	handleUpdateProfile,
	handleUpdatePassword,
} from "../controller/users_controller";
import { requireLogin, requirePassword } from "../middleware/auth";
import {
	checkPasswordValidation,
	joinValidation,
	loginValidation,
	updateProfileValidation,
	updateUserValidation,
} from "../utils/validations/users/user";

const router = express.Router();
router.use(express.json());

router.post("/join", joinValidation, handleJoinUser);
router.post("/login", loginValidation, handleLoginUser);
router.post("/logout", requireLogin, handleLogoutUser);
router.get("/", requireLogin, handleReadUser);
router.put(
	"/",
	requireLogin,
	requirePassword,
	updateUserValidation,
	handleUpdateUser
);
router.post(
	"/check-password",
	requireLogin,
	checkPasswordValidation,
	handleCheckPassword
);

router.post("/check-nickname", requireLogin, handleCheckNickname);
router.patch("/profile", requireLogin, handleUpdateProfile);
router.patch("/password", requireLogin, handleUpdatePassword);

router.delete("/", requireLogin, requirePassword, handleDeleteUser);

export default router;
