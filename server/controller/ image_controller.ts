import { Request, Response, NextFunction } from "express";
import { ServerError } from "../middleware/errors";
import { getPostInfo } from "../db/context/posts_context";

export const handleUploadImage = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		if (!req.file) {
			throw ServerError.badRequest("파일 업로드 실패");
		}

		const multerFile = req.file as Express.MulterS3.File;
		const imageURL = multerFile.location;

		res.status(200).json({ imgUrl: imageURL });
	} catch (err) {
		next(err);
	}
};
