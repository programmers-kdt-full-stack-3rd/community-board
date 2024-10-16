import {
	Controller,
	Post,
	UseInterceptors,
	UploadedFile,
	HttpStatus,
	HttpCode,
	UseGuards,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ImageService } from "./image.service";
import { LoginGuard } from "src/common/guard/login.guard";
import { UploadImageRes } from "./dto/upload-image.dto";

@Controller("image")
export class ImageController {
	constructor(private readonly imageService: ImageService) {}

	// 파일 업로드 엔드포인트
	@UseGuards(LoginGuard)
	@Post("/")
	@HttpCode(HttpStatus.OK)
	@UseInterceptors(FileInterceptor("image"))
	async handleUploadImage(
		@UploadedFile() file: Express.MulterS3.File
	): Promise<UploadImageRes> {
		try {
			const fileName = `${Date.now()}_${file.originalname}`;
			const ext = file.originalname.split(".").pop();
			console.log(fileName, ext);
			const imageUrl = await this.imageService.imageUploadToS3(
				fileName,
				file,
				ext
			);
			return { imgUrl: imageUrl };
		} catch (err) {
			throw err;
		}
	}
}
