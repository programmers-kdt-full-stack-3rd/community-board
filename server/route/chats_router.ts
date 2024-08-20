import express from "express";
import {
	handleALLRoomMembersRead,
	handleMessageLogsRead,
	handleRoomCreate,
	handleRoomsRead,
} from "../controller/chats_controller";

const router = express.Router();
router.use(express.json());

router.get("/room_members", handleALLRoomMembersRead);
router.get("/room/:room_id", handleMessageLogsRead);
router.get("/rooms", handleRoomsRead);
router.post("/room", handleRoomCreate);

export default router;
