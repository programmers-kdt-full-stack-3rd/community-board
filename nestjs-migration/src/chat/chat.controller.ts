import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseIntPipe,
	Post,
	Query,
	UseGuards,
} from "@nestjs/common";
import { ChatService } from "./chat.service";
import { User } from "../common/decorator/user.decorator";
import { IUserEntity } from "../common/interface/user-entity.interface";
import { CreateRoomReq } from "./dto/create-room.dto";
import { ReadRoomQuery } from "./dto/read-room-query.dto";
import { LoginGuard } from "../common/guard/login.guard";
import { JoinRoomReq } from "./dto/join-room.dto";
import { EnterRoomReq } from "./dto/enter-room.dto";
import { LeaveRoomReq } from "./dto/leave-room.dto";
import { ServerError } from "../common/exceptions/server-error.exception";
import { IMessage } from "./dto/message.dto";
import {
	EnterRoomRes,
	GetRoomsRes,
	CreateRoomRes,
	JoinRoomRes,
	GetMsgLogsRes,
} from "./dto/chat-result.dto";
import { CHAT_ERROR_MESSAGES } from "./constant/chat.constants";

@Controller("chat")
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Post("/room")
	@UseGuards(LoginGuard)
	@HttpCode(HttpStatus.CREATED)
	async handleRoomCreate(
		@User() user: IUserEntity,
		@Body() createRoomReq: CreateRoomReq
	): Promise<CreateRoomRes> {
		try {
			const userId = user.userId;
			const createRoomDto = {
				...createRoomReq,
				userId,
			};

			const roomId = await this.chatService.addRoom(createRoomDto);

			return { roomId };
		} catch (err) {
			throw ServerError.reference(
				CHAT_ERROR_MESSAGES.CREATE_CHATROOM_ERROR
			);
		}
	}

	@Get("/rooms")
	@HttpCode(HttpStatus.OK)
	async handleRoomsRead(
		@Query() readRoomQuery: ReadRoomQuery,
		@User() user: IUserEntity
	): Promise<GetRoomsRes> {
		try {
			let { page, perPage, keyword, isSearch } = readRoomQuery;
			page = page ? page - 1 : page;
			keyword = keyword ? decodeURIComponent(keyword) : "";

			let results;

			if (isSearch) {
				const readRoomByKeywordDto = {
					page,
					perPage,
					keyword,
					isSearch,
				};
				results =
					await this.chatService.getRoomsBykeyword(
						readRoomByKeywordDto
					);
			} else {
				const readRoomByUserIdDto = {
					userId: user.userId,
					page,
					perPage,
				};
				results =
					await this.chatService.getRoomsByUserId(
						readRoomByUserIdDto
					);
			}

			return results;
		} catch (err) {
			throw ServerError.reference(
				CHAT_ERROR_MESSAGES.READ_CHATROOM_ERROR
			);
		}
	}

	@Get("/room/:room_id")
	@UseGuards(LoginGuard)
	@HttpCode(HttpStatus.OK)
	async handleMessageLogsRead(
		@Param("room_id", ParseIntPipe) roomId: number
	): Promise<GetMsgLogsRes> {
		try {
			const result = await this.chatService.getMessageLogs(roomId);

			return { messageLogs: result };
		} catch (err) {
			throw ServerError.reference(
				CHAT_ERROR_MESSAGES.READ_MESSAGELOG_ERROR
			);
		}
	}

	@Post("/join")
	@UseGuards(LoginGuard)
	@HttpCode(HttpStatus.OK)
	async handleRoomJoin(
		@Body() joinRoomReq: JoinRoomReq,
		@User() user: IUserEntity
	): Promise<JoinRoomRes> {
		try {
			const userId = user.userId;
			const joinRoomDto = {
				...joinRoomReq,
				userId,
			};

			const result = await this.chatService.addUserToRoom(joinRoomDto);

			return { roomId: result };
		} catch (err) {
			throw ServerError.reference(CHAT_ERROR_MESSAGES.ROOM_JOIN_ERROR);
		}
	}

	@Post("/enter")
	@UseGuards(LoginGuard)
	@HttpCode(HttpStatus.OK)
	async handleRoomEnter(
		@Body() enterRoomReq: EnterRoomReq,
		@User() user: IUserEntity
	): Promise<EnterRoomRes> {
		try {
			const userId = user.userId;

			const enterRoomDto = {
				...enterRoomReq,
				userId,
			};
			const memberId =
				await this.chatService.enterUserToRoom(enterRoomDto);

			return { memberId };
		} catch (err) {
			throw ServerError.reference(CHAT_ERROR_MESSAGES.ENTER_JOIN_ERROR);
		}
	}

	@Post("/leave")
	@UseGuards(LoginGuard)
	@HttpCode(HttpStatus.OK)
	async handleRoomLeave(
		@Body() leaveRoomReq: LeaveRoomReq,
		@User() user: IUserEntity
	): Promise<undefined> {
		try {
			const userId = user.userId;

			const leaveRoomDto = {
				...leaveRoomReq,
				userId,
			};

			await this.chatService.leaveRoom(leaveRoomDto);

			return;
		} catch (err) {
			throw ServerError.reference(CHAT_ERROR_MESSAGES.LEAVE_ROOM_ERROR);
		}
	}
}
