import { Controller, Delete, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { Request } from 'express';
import { LoginGuard } from 'src/common/guard/login.guard';
import { ServerError } from 'src/common/exceptions/server-error.exception';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  	@UseGuards(LoginGuard)
	@Post("post/:post_id")
	async handleAddLike(
		@Param('post_id',ParseIntPipe) postId: number,
		@Req() req: Request
	 ) {
		try{
			const userId = req.user["userId"];
			await this.likeService.createPostLike(postId, userId);
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
	async handleDeleteLike( 
		@Param('post_id',ParseIntPipe) postId: number,
		@Req() req: Request
	) {
		try{
			const userId = req.user["userId"];
			await this.likeService.deletePostLike(postId, userId);
		} catch (err) {
      throw err;
		}
	}

	@UseGuards(LoginGuard)
	@Post("comment/:comment_id")
	async handleAddCommentLike(
		@Param('comment_id',ParseIntPipe) commentId: number,
		@Req() req: Request
	 ) {
		try{
			const userId = req.user["userId"];
			await this.likeService.createCommentLike(commentId, userId);
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
	async handleDeleteCommentLike( 
		@Param('comment_id',ParseIntPipe) commentId: number,
		@Req() req: Request
	) {
		try{
			const userId = req.user["userId"];
			await this.likeService.deletePostLike(commentId, userId);
		} catch (err) {
      		throw err;
		}
	}
}
