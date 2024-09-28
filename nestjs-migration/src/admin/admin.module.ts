import { Module } from "@nestjs/common";
import { CommentModule } from "../comment/comment.module";
import { LogModule } from "../log/log.module";
import { PostModule } from "../post/post.module";
import { UserModule } from "../user/user.module";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";

@Module({
	imports: [UserModule, PostModule, LogModule, CommentModule],
	controllers: [AdminController],
	providers: [AdminService],
})
export class AdminModule {}
