import { Request, Response, NextFunction } from "express";
import {
	deleteUser,
	getUsersInfo,
	restoreUser,
} from "../db/context/users_context";
import { mapUsersInfoToResponse } from "../db/mapper/users_mapper";
import { ServerError } from "../middleware/errors";

export const handleGetUsers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		let index = parseInt(req.query.index as string) - 1 || 0;
		let perPage = parseInt(req.query.perPage as string) || 10;
		if (index < 0 || perPage < 0) {
			index = 0;
			perPage = 10;
		}

		let nickname = req.query.nickname as string;
		let email = req.query.email as string;
		const result = await getUsersInfo({ index, perPage, nickname, email });
		res.status(200).json(mapUsersInfoToResponse(result));
	} catch (err: any) {
		next(err);
	}
};

export const handleAdminDeleteUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = parseInt(req.params.userId);

		await deleteUser(userId);
		res.status(200).json({ message: "회원 삭제 성공" });
	} catch (err: any) {
		next(err);
	}
};

export const handleAdminRestoreUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = parseInt(req.params.userId);

		await restoreUser(userId);
		res.status(200).json({ message: "회원 복구 성공" });
	} catch (err: any) {
		next(err);
	}
};
