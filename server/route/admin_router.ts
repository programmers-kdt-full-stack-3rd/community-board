import express from "express";
import {
	handleAdminDeletePost,
	handleAdminDeleteUser,
	handleAdminGetLogs,
	handleAdminGetPosts,
	handleAdminPrivatePost,
	handleAdminPublicPost,
	handleAdminRestorePost,
	handleAdminGetStats,
	handleAdminRestoreUser,
	handleGetUsers,
} from "../controller/admin_controller";
import {
	deletePostValidation,
	deleteUserValidation,
	privatePostValidation,
	publicPostValidation,
	restorePostValidation,
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
router
	.route("/post/:postId")
	.delete(deletePostValidation, handleAdminDeletePost);
router
	.route("/post/:postId/restore")
	.patch(restorePostValidation, handleAdminRestorePost);
router
	.route("/post/:postId/public")
	.patch(publicPostValidation, handleAdminPublicPost);
router
	.route("/post/:postId/private")
	.patch(privatePostValidation, handleAdminPrivatePost);

router.route("/log/:userId").get(handleAdminGetLogs);

router.route("/stat").get(handleAdminGetStats);
export default router;
