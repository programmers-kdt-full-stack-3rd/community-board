import express from "express";
import {
	handleMessageLogsRead,
	handleRoomCreate,
	handleRoomEnter,
	handleRoomJoin,
	handleRoomLeave,
	handleRoomsRead,
} from "../controller/chats_controller";

const router = express.Router();
router.use(express.json());

router.get("/room/:room_id", handleMessageLogsRead);
router.get("/rooms", handleRoomsRead);
router.post("/enter", handleRoomEnter);
router.post("/room", handleRoomCreate);
router.post("/join", handleRoomJoin);
router.post("/leave", handleRoomLeave);

export default router;
