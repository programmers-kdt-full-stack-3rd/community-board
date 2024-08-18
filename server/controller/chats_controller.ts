import { Request, Response, NextFunction } from "express";
import { ICreateRoomRequest, ICreateRoomResponse } from "shared";
import { addRoom } from "../db/context/chats_context";

export const handleRoomCreate = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const body: ICreateRoomRequest = req.body;
		const userId = req.userId;

		const createdRoomId = await addRoom(userId, body);

		res.status(200).json({ roomId: createdRoomId } as ICreateRoomResponse);
	} catch (err) {
		next(err);
	}
};
