import { Injectable } from "@nestjs/common";
import { DataSource, Like } from "typeorm";
import { CreateRoomDto } from "./dto/create-room.dto";
import { RoomRepository } from "./repositories/chat.room.repoistory";
import { MemberRepository } from "./repositories/chat.member.repository";
import {
	ReadRoomByKeywordDto,
	ReadRoomByUserIdDto,
} from "./dto/read-room-query.dto";
import { JoinRoomDto } from "./dto/join-room.dto";
import { EnterRoomDto } from "./dto/enter-room.dto";
import { LeaveRoomDto } from "./dto/leave-room.dto";
import { ServerError } from "../common/exceptions/server-error.exception";
import { IMessage } from "./dto/message.dto";
import { GetRoomsRes } from "./dto/chat-result.dto";
import { CHAT_ERROR_MESSAGES } from "./constant/chat.constants";

@Injectable()
export class ChatService {
	constructor(
		private dataSource: DataSource,
		private roomRepository: RoomRepository,
		private memberRepository: MemberRepository
	) {}

	async addRoom(createRoomDto: CreateRoomDto): Promise<number> {
		let isTransactionStarted = false;
		const queryRunner = this.dataSource.createQueryRunner();

		try {
			const { title, isPrivate, password, userId } = createRoomDto;

			await queryRunner.connect();
			await queryRunner.startTransaction();
			isTransactionStarted = true;

			const room = this.roomRepository.create({
				name: title,
				isPrivate: isPrivate,
				password: password,
			});

			const roomId = (await this.roomRepository.save(room)).id;

			const member = this.memberRepository.create({
				user: { id: userId },
				room: { id: roomId },
				isHost: true,
			});
			await this.memberRepository.save(member);
			await queryRunner.commitTransaction();

			return roomId;
		} catch (err) {
			if (isTransactionStarted) {
				await queryRunner.rollbackTransaction();
			}
			throw err;
		} finally {
			await queryRunner.release();
		}
	}

	async getRoomsBykeyword(
		readRoomByKeywordDto: ReadRoomByKeywordDto
	): Promise<GetRoomsRes> {
		const { keyword } = readRoomByKeywordDto;

		try {
			const result = await this.roomRepository.findAndCountBy({
				name: Like(`%${keyword.trim()}%`),
			});
			const totalRoomCount = result[1];

			const dataRows =
				await this.roomRepository.getRoomByKeyword(
					readRoomByKeywordDto
				);

			return {
				totalRoomCount,
				roomHeaders: dataRows.map((data: any) => ({
					...data,
					isPrivate: data.isPrivate !== 0,
				})),
			};
		} catch (err) {
			throw err;
		}
	}

	async getRoomsByUserId(
		readRoomByUserIdDto: ReadRoomByUserIdDto
	): Promise<GetRoomsRes> {
		const { userId } = readRoomByUserIdDto;

		try {
			const totalRoomCount =
				await this.memberRepository.getRoomCntByUserId(userId);

			const dataRows =
				await this.roomRepository.getRoomByUserId(readRoomByUserIdDto);

			return {
				totalRoomCount,
				roomHeaders: dataRows.map((data: any) => ({
					...data,
					isPrivate: data.isPrivate !== 0,
				})),
			};
		} catch (err) {
			throw err;
		}
	}

	async getMessageLogs(roomId: number): Promise<IMessage[]> {
		try {
			let dataRows = await this.roomRepository.getMessageLogs(roomId);

			return dataRows.map((data: any) => ({
				...data,
				isSystem: data.isSystem !== 0,
				isDeleted: data.isDeleted !== 0,
			}));
		} catch (err) {
			throw err;
		}
	}

	async addUserToRoom(joinRoomDto: JoinRoomDto): Promise<number> {
		const { userId, roomId } = joinRoomDto;

		try {
			const member = this.memberRepository.create({
				user: { id: userId },
				room: { id: roomId },
			});

			const result = await this.memberRepository.save(member);

			return roomId;
		} catch (err) {
			throw err;
		}
	}

	async enterUserToRoom(enterRoomDto: EnterRoomDto): Promise<number> {
		const { userId, roomId } = enterRoomDto;

		try {
			const result = await this.memberRepository.findOne({
				where: {
					user: { id: userId },
					room: { id: roomId },
				},
			});
			const memberId = result.id;

			return memberId;
		} catch (err) {
			throw err;
		}
	}

	async leaveRoom(leaveRoomDto: LeaveRoomDto): Promise<boolean> {
		const { userId, roomId } = leaveRoomDto;

		try {
			const result = await this.memberRepository.update(
				{ user: { id: userId }, room: { id: roomId } },
				{ isDeleted: true }
			);

			if (result.affected) {
				return true;
			} else {
				throw ServerError.reference(
					CHAT_ERROR_MESSAGES.LEAVE_ROOM_ERROR
				);
			}
		} catch (err) {
			throw err;
		}
	}
}
