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
			page: req.body.page > 0 ? req.body.page - 1 : 0,
			perPage: req.body.perPage,
			isSearch: req.body.isSearch,
			keyword: req.body.keyword,
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
