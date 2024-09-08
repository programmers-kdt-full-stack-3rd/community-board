import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { DbModule } from "../db/db.module";
import { UserRepository } from "./user.repository";

@Module({
	imports: [DbModule],
	controllers: [UserController],
	providers: [UserService, UserRepository],
})
export class UserModule {}
