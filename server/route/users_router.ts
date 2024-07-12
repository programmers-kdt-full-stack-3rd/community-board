import express from "express";
import {
  handleLoginUser,
  handleLogoutUser,
  handleJoinUser,
  handleUpdateUser,
  handleCheckPassword,
  handleDeleteUser,
} from "../controller/users_controller";
import { requireLogin, requirePassword } from "../middleware/auth";
import {
  checkPasswordValidation,
  joinValidation,
  loginValidation,
  updateUserValidation,
} from "../utils/validations/users/user";

const router = express.Router();
router.use(express.json());

router.post("/join", joinValidation, handleJoinUser);
router.post("/login", loginValidation, handleLoginUser);
router.post("/logout", requireLogin, handleLogoutUser);
router.put(
  "/",
  updateUserValidation,
  requireLogin,
  requirePassword,
  handleUpdateUser
);
router.post(
  "/check-password",
  checkPasswordValidation,
  requireLogin,
  handleCheckPassword
);
router.delete("/", requireLogin, requirePassword, handleDeleteUser);

export default router;
