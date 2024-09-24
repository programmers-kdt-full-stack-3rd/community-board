import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentBodyDto } from './dto/create-comment.dto';
import { UpdateCommentBodyDto } from './dto/update-comment.dto';
import { LoginGuard } from '../common/guard/login.guard';
import { Request } from 'express';
import { CommentsResultDto, ReadCommentQueryDto } from './dto/read-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(LoginGuard)
  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  async handleCommentCreate(
    @Body() createCommentBodyDto: CreateCommentBodyDto,
    @Req() req: Request
  ) : Promise<void> {
    try {
      const authorId = req.user["userId"];
      const createCommentDto = {
        ...createCommentBodyDto,
        authorId
      };

      await this.commentService.createComment(createCommentDto);

    } catch (err) {
      throw err;
    }
  }

  @Get("/")
  @HttpCode(HttpStatus.OK)
  async handleCommentsRead(
    @Query() readCommentQueryDto: ReadCommentQueryDto,
    @Req() req: Request
  ) : Promise<CommentsResultDto> {

    try {
      let {post_id:postId, index, perPage} = readCommentQueryDto;
      const userId = req.user? req.user["userId"] : 0;
      const total = await this.commentService.getTotal(postId);

      perPage = Math.max(1,perPage || 50);
      const fallbackIndex = Math.max(1, Math.ceil(total / perPage));
      index = Math.max(1,
                  index || fallbackIndex
              ) - 1; 
      
      const readCommentsDto = {
        post_id:postId,
        index,
        perPage,
        userId
      }
      const comments = await this.commentService.readComments(readCommentsDto);

      return {total,comments,};

    } catch (err) {
      throw err;
    }
  }

  @UseGuards(LoginGuard)
  @Patch("/")
  @HttpCode(HttpStatus.OK)
  async handleCommentUpdate(
    @Body() updateCommentBodyDto: UpdateCommentBodyDto,
    @Req() req: Request
    ) : Promise<void> {
    try {

      const authorId = req.user["userId"];
      const {id: commentId, content} = updateCommentBodyDto;

      const updateCommentDto = {
        id: commentId,
        authorId: authorId,
        content,
      }

      await this.commentService.updateComment(updateCommentDto);


    } catch (err) {
      throw err;
    }
  }

  @UseGuards(LoginGuard)
  @Delete("/:comment_id")
  @HttpCode(HttpStatus.OK)
  async handleCommentDelete(
    @Param('comment_id', ParseIntPipe) commentId: number,
    @Req() req: Request,
  ) : Promise<void>{
    try {
      const authorId = req.user["userId"];
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
