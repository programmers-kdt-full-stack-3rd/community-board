import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import { RoomRepository } from "./repositories/chat.room.repoistory";
import { MemberRepository } from "./repositories/chat.member.repository";
import { MessageRepository } from "./repositories/chat.messages.repository";

@Module({
	controllers: [ChatController],
	providers: [
		ChatService,
		RoomRepository,
		MemberRepository,
		MessageRepository,
	],
	imports: [],
})
export class ChatModule {}
