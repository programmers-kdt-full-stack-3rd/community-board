import {
	Controller,
	Post,
	Body,
	UseGuards,
	HttpStatus,
	HttpCode,
} from "@nestjs/common";

import { LoginGuard } from "src/common/guard/login.guard";

import { GetQnAAcceptInfoReq, GetQnAAcceptInfoRes } from "./dto/get-qna.dto";
import { QnAService } from "./qna.service";
import { AcceptQnACommentReq } from "./dto/create-qna.dto";

@Controller("post/qna")
export class QnAController {
	constructor(private readonly qnaService: QnAService) {}

	@Post("/")
	@HttpCode(HttpStatus.OK)
	async getQnAAcceptInfo(
		@Body() { postIds }: GetQnAAcceptInfoReq
	): Promise<GetQnAAcceptInfoRes> {
		try {
			const { commentIds } = await this.qnaService.getQnAAcceptInfo({
				postIds,
			});
			return { commentIds };
		} catch (err) {
			throw err;
		}
	}

	@UseGuards(LoginGuard)
	@Post("/accept")
	@HttpCode(HttpStatus.OK)
	async acceptQnAComment(
		@Body() { postId, commentId }: AcceptQnACommentReq
	): Promise<void> {
		try {
			await this.qnaService.acceptQnAComment({ postId, commentId });
		} catch (err) {
			throw err;
		}
	}
}
