import express from "express";
import {
	handleAdminDeleteUser,
	handleGetUsers,
} from "../controller/admin_controller";

const router = express.Router();
router.use(express.json());

router.route("/user").get(handleGetUsers);
router.route("/user/:userId").delete(handleAdminDeleteUser);
export default router;
