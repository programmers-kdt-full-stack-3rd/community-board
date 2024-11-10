import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	UseGuards,
} from "@nestjs/common";
import { User } from "src/common/decorator/user.decorator";
import { IUserEntity } from "src/common/interface/user-entity.interface";
import { Permissions } from "../../common/decorator/rbac.decorator";
import { LoginGuard } from "../../common/guard/login.guard";
import { CommentService } from "./comment.service";
import { CreateCommentReq } from "./dto/create-comment.dto";
import { CommentsResultDto, ReadCommentQuery } from "./dto/read-comment.dto";
import { UpdateCommentReq } from "./dto/update-comment.dto";

@Controller("comment")
export class CommentController {
	constructor(private readonly commentService: CommentService) {}

	@UseGuards(LoginGuard)
	@Post("/")
	@HttpCode(HttpStatus.CREATED)
	@Permissions("create:comment")
	async handleCommentCreate(
		@Body() createCommentBodyDto: CreateCommentReq,
		@User() user: IUserEntity
	): Promise<void> {
		try {
			const authorId = user.userId;
			const createCommentDto = {
				...createCommentBodyDto,
				authorId,
			};

			await this.commentService.createComment(createCommentDto);
		} catch (err) {
			throw err;
		}
	}

	@Get("/")
	@HttpCode(HttpStatus.OK)
	@Permissions("read:comment")
	async handleCommentsRead(
		@Query() readCommentQueryDto: ReadCommentQuery,
		@User() user: IUserEntity
	): Promise<CommentsResultDto> {
		try {
			let { post_id: postId, index, perPage } = readCommentQueryDto;
			const userId = user ? user.userId : 0;
			const total = await this.commentService.getTotal(postId);

			perPage = Math.max(1, perPage || 50);
			const fallbackIndex = Math.max(1, Math.ceil(total / perPage));
			index = Math.max(1, index || fallbackIndex) - 1;

			const readCommentsDto = {
				post_id: postId,
				index,
				perPage,
				userId,
			};
			const comments =
				await this.commentService.readComments(readCommentsDto);

			return { total, comments };
		} catch (err) {
			throw err;
		}
	}

	@UseGuards(LoginGuard)
	@Patch("/")
	@HttpCode(HttpStatus.OK)
	async handleCommentUpdate(
		@Body() updateCommentBodyDto: UpdateCommentReq,
		@User() user: IUserEntity
	): Promise<void> {
		try {
			const authorId = user.userId;
			const { id: commentId, content } = updateCommentBodyDto;

			const updateCommentDto = {
				id: commentId,
				authorId: authorId,
				content,
			};

			await this.commentService.updateComment(updateCommentDto);
		} catch (err) {
			throw err;
		}
	}

	@UseGuards(LoginGuard)
	@Delete("/:comment_id")
	@HttpCode(HttpStatus.OK)
	async handleCommentDelete(
		@Param("comment_id", ParseIntPipe) commentId: number,
		@User() user: IUserEntity
	): Promise<void> {
		try {
			const authorId = user.userId;
			const deleteCommentDto = {
				id: commentId,
				authorId,
			};
			await this.commentService.deleteComment(deleteCommentDto);
		} catch (err) {
			throw err;
		}
	}
}
