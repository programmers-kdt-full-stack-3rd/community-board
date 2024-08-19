import express from "express";
import {
	handleRoomCreate,
	handleRoomsRead,
} from "../controller/chats_controller";

const router = express.Router();
router.use(express.json());

router.get("/rooms", handleRoomsRead);
router.post("/room", handleRoomCreate);

export default router;
