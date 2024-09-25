import { Module } from "@nestjs/common";
import { PostModule } from "../post/post.module";
import { UserModule } from "../user/user.module";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";

@Module({
	imports: [UserModule, PostModule],
	controllers: [AdminController],
	providers: [AdminService],
})
export class AdminModule {}
