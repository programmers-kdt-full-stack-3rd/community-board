import { Module } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";
import { PostRepository } from "./post.repository";
import { Post } from "./entities/post.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RecrutingPost } from "./entities/recruting_posts.entity";

@Module({
	imports: [TypeOrmModule.forFeature([Post, RecrutingPost])],
	controllers: [PostController],
	providers: [PostService, PostRepository],
	exports: [PostService, PostRepository],
})
export class PostModule {}
