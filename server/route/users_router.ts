import express from "express";
import { postJoin } from "../controller/users_controller";

const router = express.Router();
router.use(express.json());

router.post("/join", postJoin);

export default router;
