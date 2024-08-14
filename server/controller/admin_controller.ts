import { Request, Response, NextFunction } from "express";
import { getUsersInfo } from "../db/context/users_context";
import { mapUsersInfoToResponse } from "../db/mapper/users_mapper";

export const handleGetUsers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const result = await getUsersInfo();
		res.status(200).json(mapUsersInfoToResponse(result));
	} catch (err: any) {
		next(err);
	}
};
