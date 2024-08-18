import express from "express";
import {
	handleAdminDeleteUser,
	handleAdminRestoreUser,
	handleGetUsers,
} from "../controller/admin_controller";
import {
	deleteUserValidation,
	restoreUserValidation,
} from "../utils/validations/admin/admin";

const router = express.Router();
router.use(express.json());

router.route("/user").get(handleGetUsers);
router
	.route("/user/:userId")
	.delete(deleteUserValidation, handleAdminDeleteUser);
router
	.route("/user/:userId/restore")
	.patch(restoreUserValidation, handleAdminRestoreUser);
export default router;
