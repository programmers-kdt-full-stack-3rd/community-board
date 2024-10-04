import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { ServerError } from "../middleware/errors";
import { NextFunction, Request, Response } from "express";

dotenv.config({ path: "./../.env" });

// multerS3를 사용한 파일 업로드 미들웨어
export const upload = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		if (
			!process.env.REGION ||
			!process.env.ACCESS_KEY_ID ||
			!process.env.SECRET_ACCESS_KEY ||
			!process.env.BUCKET_NAME
		) {
			throw new ServerError(500, "aws config is undefined");
		}

		const s3 = new S3Client({
			region: process.env.REGION,
			credentials: {
				accessKeyId: process.env.ACCESS_KEY_ID,
				secretAccessKey: process.env.SECRET_ACCESS_KEY,
			},
		});

		const uploadMiddleware = multer({
			storage: multerS3({
				s3,
				bucket: process.env.BUCKET_NAME, // S3 버킷 이름
				contentType: multerS3.AUTO_CONTENT_TYPE,
				key: (req, file, cb) => {
					// 파일명 설정
					const fileName = `${Date.now()}_${file.originalname}`;
					cb(null, fileName);
				},
			}),
			// limits: { fileSize: 5 * 1024 * 1024 }, // 파일 크기 제한 설정 가능
		}).single("image");

		// 생성한 `multer` 미들웨어를 즉시 실행
		uploadMiddleware(req, res, (err: any) => {
			if (err) {
				return next(err); // 에러가 있으면 next로 넘김
			}
			// 에러 없이 완료되면 다음 미들웨어 호출
			next();
		});
	} catch (err) {
		next(err);
	}
};
