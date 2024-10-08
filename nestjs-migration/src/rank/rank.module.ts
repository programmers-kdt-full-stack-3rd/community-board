import { Module } from "@nestjs/common";
import { RankService } from "./rank.service";
import { RankController } from "./rank.controller";
import { AdminModule } from "src/admin/admin.module";
import { UserModule } from "src/user/user.module";
import { PostModule } from "src/post/post.module";
import { LogModule } from "src/log/log.module";
import { CommentModule } from "src/comment/comment.module";

@Module({
	imports: [UserModule, PostModule, LogModule, CommentModule, AdminModule],
	controllers: [RankController],
	providers: [RankService],
})
export class RankModule {}
