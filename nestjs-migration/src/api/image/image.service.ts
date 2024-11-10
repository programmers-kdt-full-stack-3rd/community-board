import { Injectable } from "@nestjs/common";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ImageService {
	private s3: S3Client;

	constructor(private readonly configService: ConfigService) {
		this.s3 = new S3Client({
			region: this.configService.get<string>("REGION"),
			credentials: {
				accessKeyId: this.configService.get<string>("ACCESS_KEY_ID"),
				secretAccessKey:
					this.configService.get<string>("SECRET_ACCESS_KEY"),
			},
		});
	}

	async imageUploadToS3(
		fileName: string, // 업로드할 파일의 이름 (시간 + originalname)
		file: Express.MulterS3.File, // 업로드할 파일
		ext: string // 파일 확장자
	) {
		// AWS S3에 이미지 업로드 명령을 생성합니다. 파일 이름, 파일 버퍼, 파일 접근 권한, 파일 타입 등을 설정합니다.
		const command = new PutObjectCommand({
			Bucket: this.configService.get("BUCKET_NAME"), // S3 버킷 이름
			Key: fileName, // 업로드될 파일의 이름
			Body: file.buffer, // 업로드할 파일
			ContentType: `image/${ext}`, // 파일 타입
		});

		// 생성된 명령을 S3 클라이언트에 전달하여 이미지 업로드를 수행합니다.
		await this.s3.send(command);

		// 업로드된 이미지의 URL을 반환합니다.
		return `https://s3.${process.env.REGION}.amazonaws.com/${process.env.BUCKET_NAME}/${fileName}`;
	}
}
