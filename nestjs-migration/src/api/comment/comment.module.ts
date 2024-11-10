import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostRepository } from "../post/post.repository";
import { UserRepository } from "../user/user.repository";
import { CommentController } from "./comment.controller";
import { CommentRepository } from "./comment.repository";
import { CommentService } from "./comment.service";
import { Comment } from "./entities/comment.entity";

@Module({
	imports: [TypeOrmModule.forFeature([Comment])],
	controllers: [CommentController],
	providers: [
		CommentService,
		CommentRepository,
		UserRepository,
		PostRepository,
	],
	exports: [CommentRepository],
})
export class CommentModule {}
