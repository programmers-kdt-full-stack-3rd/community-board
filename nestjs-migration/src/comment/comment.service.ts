import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { DataSource } from 'typeorm';
import { CommentRepository } from './comment.repository';
import { UserRepository } from 'src/user/user.repository';
import { makeLogTitle } from 'src/utils/user-logs-utils';
import { ServerError } from 'src/common/exceptions/server-error.exception';
import { Comment } from './entities/comment.entity';
import { Log } from 'src/log/entities/log.entity';
import { ReadCommentsDto } from './dto/read-comment.dto';
import { PostRepository } from 'src/post/post.repository';
import { DeleteCommentDto } from './dto/delete-comment.dto';

@Injectable()
export class CommentService {
  constructor(private dataSource: DataSource,
              private commentRepository: CommentRepository,
              private userRepository: UserRepository,
              private postRepository: PostRepository
  ) {}

  async createComment(createCommentDto: CreateCommentDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    let isTransactionStarted = false;

    try {
      let {authorId, content, post_id: postId } = createCommentDto;

      const logTitle = makeLogTitle(content);
      const logValue = Object.assign(new Log(), {title: logTitle, userId: authorId, categoryId: 2 });

      await queryRunner.connect();
      await queryRunner.startTransaction();
      isTransactionStarted = true;

      const newComment = Object.assign(new Comment(), { content, post: postId, author: authorId });
      await queryRunner.manager.save(newComment);
      await queryRunner.manager.getRepository(Log).save(logValue);

      await queryRunner.commitTransaction();

      return

    } catch (err) {
      if (isTransactionStarted) {
          await queryRunner.rollbackTransaction();
      }
      if (
        err?.code === "ER_NO_REFERENCED_ROW_2" &&
        err?.sqlMessage?.includes("post_id")
      ) {
        throw ServerError.notFound("게시글 ID가 존재하지 않습니다.");
      } else {
        throw err;
      }
    } 
    finally { 
      await queryRunner.release();
    }
  }

  async getTotal(postId: number) {
    const {total} = await this.commentRepository.getTotalComments(postId);

    return total;
  }

  async readComments(readCommentsDto : ReadCommentsDto) {
    return await this.commentRepository.getComments(readCommentsDto)
  }

  async updateComment(updateCommentDto: UpdateCommentDto) {
    const {id, authorId, content} = updateCommentDto;

    const author = await this.userRepository.findOne({where: {id: authorId}});
    const comment = await this.commentRepository.findOne({ where: { id, } });

    if (!(author && comment && !comment.isDelete)) {
      throw ServerError.notFound("없는 유저이거나 존재하지 않는 댓글입니다.")
    };

    await this.commentRepository.update({id, author: authorId, isDelete: false}, {content,});
    return true;
  }

  async deleteComment(deleteCommentDto: DeleteCommentDto) {

    const {id, authorId} = deleteCommentDto;
    
    const result = await this.commentRepository
      .update({id, isDelete:false, author: authorId}, {isDelete: true});

    if(result.affected) {
      return true;
    } else {
      throw ServerError.reference("댓글 삭제 실패");
    };
  }
}
