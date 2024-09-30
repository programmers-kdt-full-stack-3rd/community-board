import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config({ path: "./../.env" });

const s3 = new S3Client({
	region: process.env.REGION || "",
	credentials: {
		accessKeyId: process.env.ACCESS_KEY_ID || "",
		secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
	},
});

// multerS3를 사용한 파일 업로드 미들웨어
export const upload = multer({
	storage: multerS3({
		s3,
		bucket: "hungkung-burket", // S3 버킷 이름
		key: (req, file, cb) => {
			// 파일명 설정 (예: 날짜 기반 파일명)
			const fileName = `${Date.now()}_${file.originalname}`;
			cb(null, fileName);
		},
	}),
	// limits: { fileSize: 5 * 1024 * 1024 },
});
