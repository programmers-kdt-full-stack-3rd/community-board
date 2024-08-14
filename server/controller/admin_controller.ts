import { Request, Response, NextFunction } from "express";
import { getUsersInfo } from "../db/context/users_context";
import { mapUsersInfoToResponse } from "../db/mapper/users_mapper";

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
		const result = await getUsersInfo({ index, perPage });
		res.status(200).json(mapUsersInfoToResponse(result));
	} catch (err: any) {
		next(err);
	}
};
