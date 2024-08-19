import { Request, Response, NextFunction } from "express";
import {
	ICreateRoomRequest,
	ICreateRoomResponse,
	IReadRoomRequest,
	IReadRoomResponse,
} from "shared";
import {
	addRoom,
	getRoomsByKeyword,
	getRoomsByUserId,
} from "../db/context/chats_context";

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

export const handleRoomsRead = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const body: IReadRoomRequest = {
			page: parseInt(req.query.page as string) - 1 || 0,
			perPage: parseInt(req.query.perPage as string) || 2,
			isSearch: (req.body.isSearch as boolean) || false,
			keyword: (req.query.keyword as string) || "",
		};

		let response: IReadRoomResponse = {
			totalRoomCount: 0,
			roomHeaders: [],
		};

		if (body.isSearch) {
			const result = await getRoomsByKeyword(body);

			response.totalRoomCount = result.totalRoomCount;
			response.roomHeaders = result.roomHeaders;
		} else {
			const userId = req.userId;
			const result = await getRoomsByUserId(
				userId,
				body.page,
				body.perPage
			);

			response.totalRoomCount = result.totalRoomCount;
			response.roomHeaders = result.roomHeaders;
		}

		res.status(200).json(response);
	} catch (err) {
		next(err);
	}
};
