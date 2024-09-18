import { Module } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CommentController } from "./comment.controller";
import { CommentRepository } from "./comment.repository";
import { UserRepository } from "src/user/user.repository";
import { PostRepository } from "src/post/post.repository";

@Module({
	controllers: [CommentController],
	providers: [CommentService, CommentRepository, UserRepository,PostRepository],
})
export class CommentModule {}
