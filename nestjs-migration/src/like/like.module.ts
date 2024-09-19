import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { CommentLikeRepository, LikeRepository } from './like.repository';
import { Like } from './entities/like.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentLike } from './entities/comment-like.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Like,CommentLike])],
  controllers: [LikeController],
  providers: [LikeService, LikeRepository, CommentLikeRepository],
  exports: []
})
export class LikeModule {}
