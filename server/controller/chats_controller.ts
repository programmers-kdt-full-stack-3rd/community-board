import { Request, Response, NextFunction } from "express";
import {
	ICreateRoomRequest,
	ICreateRoomResponse,
	IEnterRoomResponse,
	IGetRoomMessageLogsRequest,
	IGetRoomMessageLogsResponse,
	IJoinRoomRequest,
	IJoinRoomResponse,
	ILeaveRoomRequest,
	IReadRoomRequest,
	IReadRoomResponse,
} from "shared";
import {
	addRoom,
	addUserToRoom,
	enterUserToRoom,
	getMessageLogs,
	getRoomsByKeyword,
	getRoomsByUserId,
	leaveRoom,
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
			isSearch: req.query.isSearch === "true",
			keyword: req.query.keyword
				? decodeURIComponent(req.query.keyword as string)
				: "",
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

export const handleMessageLogsRead = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const body: IGetRoomMessageLogsRequest = {
			roomId: parseInt(req.params.room_id),
		};

		const result = await getMessageLogs(body.roomId);
		const response: IGetRoomMessageLogsResponse = {
			messageLogs: result,
		};

		res.status(200).json(response);
	} catch (err) {
		next(err);
	}
};

export const handleRoomJoin = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const body: IJoinRoomRequest = {
			roomId: parseInt(req.body.roomId),
			isPrivate: req.body.isPrivate === "true",
			password: req.body.password || "",
		};
		const userId = req.userId;

		const result = await addUserToRoom(userId, body.roomId);

		const response: IJoinRoomResponse = {
			roomId: result,
		};

		res.status(200).json(response);
	} catch (err) {
		next(err);
	}
};

export const handleRoomEnter = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = req.userId;
		const roomId = parseInt(req.body.roomId);

		const result = await enterUserToRoom(userId, roomId);

		const response: IEnterRoomResponse = {
			memberId: result,
		};

		res.status(200).json(response);
	} catch (err) {
		next(err);
	}
};

export const handleRoomLeave = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const body: ILeaveRoomRequest = {
			roomId: parseInt(req.body.roomId),
		};

		const userId = req.userId;

		await leaveRoom(userId, body.roomId);

		res.status(200).json();
	} catch (err) {
		next(err);
	}
};
