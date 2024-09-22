import { Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { Request } from 'express';
import { LoginGuard } from '../common/guard/login.guard';
import { ServerError } from '../common/exceptions/server-error.exception';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  	@UseGuards(LoginGuard)
	@Post("post/:post_id")
	@HttpCode(HttpStatus.CREATED)
	async handleAddLike(
		@Param('post_id',ParseIntPipe) postId: number,
		@Req() req: Request
	 ) : Promise<void>{
		try{
			const userId = req.user["userId"];
			const createPostLikeDto = {
				postId,
				userId,
			}
			await this.likeService.createPostLike(createPostLikeDto);
		} catch (err) {
			if (err?.code === "ER_DUP_ENTRY") {
				throw ServerError.badRequest(
					`이미 좋아요 표시한 게시물입니다.`
				);
			} else if (
				err?.code === "ER_NO_REFERENCED_ROW_2"
			) {
				throw ServerError.notFound(
					"게시물이 존재하지 않습니다." //throw필요
				);
			}
			throw err;
		}
		
	}

	@UseGuards(LoginGuard)
	@Delete("post/:post_id")
	@HttpCode(HttpStatus.OK)
	async handleDeleteLike( 
		@Param('post_id',ParseIntPipe) postId: number,
		@Req() req: Request
	) : Promise<void>{
		try{
			const userId = req.user["userId"];
			const deletePostDto = {
				postId,
				userId,
			}
			await this.likeService.deletePostLike(deletePostDto);
		} catch (err) {
      throw err;
		}
	}

	@UseGuards(LoginGuard)
	@Post("comment/:comment_id")
	@HttpCode(HttpStatus.CREATED)
	async handleAddCommentLike(
		@Param('comment_id',ParseIntPipe) commentId: number,
		@Req() req: Request
	 ): Promise<void> {
		try{
			const userId = req.user["userId"];
			const createCommentLikeDto = {
				commentId,
				userId,
			}
			await this.likeService.createCommentLike(createCommentLikeDto);
		} catch (err) {
			if (err?.code === "ER_DUP_ENTRY") {
				throw ServerError.badRequest(
					`이미 좋아요 표시한 댓글입니다.`
				);
			} else if (
				err?.code === "ER_NO_REFERENCED_ROW_2"
			) {
				throw ServerError.notFound(
					"댓글이 존재하지 않습니다."
				);
			}
			throw err;
		}
	}
	@UseGuards(LoginGuard)
	@Delete("comment/:comment_id")
	@HttpCode(HttpStatus.OK)
	async handleDeleteCommentLike( 
		@Param('comment_id',ParseIntPipe) commentId: number,
		@Req() req: Request
	): Promise<void> {
		try{
			const userId = req.user["userId"];
			const deleteCommentLikeDto = {
				commentId,
				userId,
			}
			await this.likeService.deleteCommentLike(deleteCommentLikeDto);
		} catch (err) {
      		throw err;
		}
	}
}
