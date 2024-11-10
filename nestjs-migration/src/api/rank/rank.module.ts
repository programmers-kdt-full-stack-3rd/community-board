import { Module } from "@nestjs/common";
import { RankService } from "./rank.service";
import { RankController } from "./rank.controller";
import { AdminModule } from "../admin/admin.module";
import { UserModule } from "../user/user.module";
import { PostModule } from "../post/post.module";
import { LogModule } from "../log/log.module";
import { CommentModule } from "../comment/comment.module";

@Module({
	imports: [UserModule, PostModule, LogModule, CommentModule, AdminModule],
	controllers: [RankController],
	providers: [RankService],
})
export class RankModule {}
