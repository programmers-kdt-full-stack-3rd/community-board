import express from "express";
import { handleGetUsers } from "../controller/admin_controller";

const router = express.Router();
router.use(express.json());

router.route("/user").get(handleGetUsers);
export default router;
