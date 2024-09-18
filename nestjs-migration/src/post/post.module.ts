import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { UserRepository } from 'src/user/user.repository';
import { PostRepository } from './post.repository';

@Module({
  imports: [],
  controllers: [PostController],
  providers: [PostService,
             UserRepository,
            PostRepository],
})
export class PostModule {}
