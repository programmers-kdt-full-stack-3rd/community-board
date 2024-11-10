import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { QnA } from "./entities/qna.entity";
import { QnAController } from "./qna.controller";
import { QnARepository } from "./qna.repository";
import { QnAService } from "./qna.service";

import { Post } from "../post/entities/post.entity";
import { Comment } from "../comment/entities/comment.entity";

@Module({
	imports: [TypeOrmModule.forFeature([QnA, Post, Comment])],
	controllers: [QnAController],
	providers: [QnAService, QnARepository],
	exports: [QnAService],
})
export class QnAModule {}
