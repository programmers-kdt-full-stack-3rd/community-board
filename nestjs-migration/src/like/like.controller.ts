import {
	Controller,
	Delete,
	HttpCode,
	HttpStatus,
	Param,
	ParseIntPipe,
	Post,
	UseGuards,
} from "@nestjs/common";
import { LikeService } from "./like.service";
import { LoginGuard } from "../common/guard/login.guard";
import { ServerError } from "../common/exceptions/server-error.exception";
import { HandleLikeDto } from "./dto/handle-like-dto";
import { HandleCommentLikeDto } from "./dto/handle-comment-like-dto";
import {
	LIKE_ERROR_CODES,
	LIKE_ERROR_MESSAGES,
} from "./constant/like.constants";
import { User } from "src/common/decorator/user.decorator";
import { IUserEntity } from "src/common/interface/user-entity.interface";

@Controller("like")
export class LikeController {
	constructor(private readonly likeService: LikeService) {}

	@UseGuards(LoginGuard)
	@Post("post/:post_id")
	@HttpCode(HttpStatus.CREATED)
	async handleAddLike(
		@Param("post_id", ParseIntPipe) postId: number,
		@User() user: IUserEntity
	): Promise<void> {
		try {
			const userId = user.userId;
			const createPostLikeDto: HandleLikeDto = {
				postId,
				userId,
			};
			await this.likeService.createPostLike(createPostLikeDto);
		} catch (err) {
			if (err?.code === LIKE_ERROR_CODES.DUPLICATED) {
				throw ServerError.badRequest(
					LIKE_ERROR_MESSAGES.DUPLICATED_POSTS
				);
			} else if (err?.code === LIKE_ERROR_CODES.NO_REFRERENCED) {
				throw ServerError.notFound(LIKE_ERROR_MESSAGES.NOT_FOUND_POST);
			}
			throw err;
		}
	}

	@UseGuards(LoginGuard)
	@Delete("post/:post_id")
	@HttpCode(HttpStatus.OK)
	async handleDeleteLike(
		@Param("post_id", ParseIntPipe) postId: number,
		@User() user: IUserEntity
	): Promise<void> {
		try {
			const userId = user.userId;
			const deletePostDto: HandleLikeDto = {
				postId,
				userId,
			};
			await this.likeService.deletePostLike(deletePostDto);
		} catch (err) {
			throw err;
		}
	}

	@UseGuards(LoginGuard)
	@Post("comment/:comment_id")
	@HttpCode(HttpStatus.CREATED)
	async handleAddCommentLike(
		@Param("comment_id", ParseIntPipe) commentId: number,
		@User() user: IUserEntity
	): Promise<void> {
		try {
			const userId = user.userId;
			const createCommentLikeDto: HandleCommentLikeDto = {
				commentId,
				userId,
			};
			await this.likeService.createCommentLike(createCommentLikeDto);
		} catch (err) {
			if (err?.code === LIKE_ERROR_CODES.DUPLICATED) {
				throw ServerError.badRequest(
					LIKE_ERROR_MESSAGES.DUPLICATED_COMMENTS
				);
			} else if (err?.code === LIKE_ERROR_CODES.DUPLICATED) {
				throw ServerError.notFound(
					LIKE_ERROR_MESSAGES.NOT_FOUND_COMMENT
				);
			}
			throw err;
		}
	}
	@UseGuards(LoginGuard)
	@Delete("comment/:comment_id")
	@HttpCode(HttpStatus.OK)
	async handleDeleteCommentLike(
		@Param("comment_id", ParseIntPipe) commentId: number,
		@User() user: IUserEntity
	): Promise<void> {
		try {
			const userId = user.userId;
			const deleteCommentLikeDto: HandleCommentLikeDto = {
				commentId,
				userId,
			};
			await this.likeService.deleteCommentLike(deleteCommentLikeDto);
		} catch (err) {
			throw err;
		}
	}
}
