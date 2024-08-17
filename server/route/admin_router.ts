import express from "express";
import {
	handleAdminDeletePost,
	handleAdminDeleteUser,
	handleAdminGetPosts,
	handleAdminPrivatePost,
	handleAdminPublicPost,
	handleAdminRestorePost,
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

router.route("/post").get(handleAdminGetPosts);
router.route("/post/:postId").delete(handleAdminDeletePost);
router.route("/post/:postId/restore").patch(handleAdminRestorePost);
router.route("/post/:postId/public").patch(handleAdminPublicPost);
router.route("/post/:postId/private").patch(handleAdminPrivatePost);

export default router;
