import express from "express";
import { handleRoomCreate } from "../controller/chats_controller";

const router = express.Router();
router.use(express.json());

router.post("/room", handleRoomCreate);

export default router;
