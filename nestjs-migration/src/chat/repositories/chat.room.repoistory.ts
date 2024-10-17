import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Room } from "../entities/room.entity";
import { plainToInstance } from "class-transformer";
import { Member } from "../entities/member.entity";
import {
	ReadRoomByKeywordDto,
	ReadRoomByUserIdDto,
} from "../dto/read-room-query.dto";
import { User } from "../../user/entities/user.entity";
import { Message } from "../entities/message.entity";
import { IMessage } from "../dto/message.dto";
import { RoomHeader } from "../dto/chat-result.dto";

@Injectable()
export class RoomRepository extends Repository<Room> {
	constructor(private dataSource: DataSource) {
		super(Room, dataSource.createEntityManager());
	}

	async getRoomByKeyword(
		readRoomByKeywordDto: ReadRoomByKeywordDto
	): Promise<RoomHeader[]> {
		const { keyword, perPage, page } = readRoomByKeywordDto;

		const queryBuilder = this.createQueryBuilder("r")
			.select([
				"COUNT(m.id) as totalMembersCount",
				"r.id as roomId",
				"r.name as title",
				"r.is_private as isPrivate",
			])
			.innerJoin(
				Member,
				"m",
				"r.id = m.room_id AND m.is_deleted != :isDeleted AND r.name Like :keyword",
				{ isDeleted: true, keyword: `%${keyword.trim()}%` }
			)
			.groupBy("r.id")
			.addGroupBy("r.name")
			.addGroupBy("r.is_private")
			.limit(perPage)
			.offset(page * perPage);

		const results = await queryBuilder.getRawMany();
		const getRoomsResultDto = plainToInstance(RoomHeader, results);

		return getRoomsResultDto;
	}

	async getRoomByUserId(
		readRoomByUserIdDto: ReadRoomByUserIdDto
	): Promise<RoomHeader[]> {
		const { page, perPage, userId } = readRoomByUserIdDto;

		const queryBuilder = this.createQueryBuilder("r")
			.select([
				"COUNT(m2.id) AS totalMembersCount",
				"r.id AS roomId",
				"r.name AS title",
				"r.is_private AS isPrivate",
			])
			.innerJoin(
				Member,
				"m1",
				"r.id = m1.room_id AND m1.is_deleted != :isDeleted AND m1.user_id = :userId",
				{ isDeleted: true, userId }
			)
			.leftJoin(
				Member,
				"m2",
				"r.id = m2.room_id AND m2.is_deleted != :isDeleted",
				{ isDeleted: true }
			)
			.groupBy("r.id")
			.addGroupBy("r.name")
			.addGroupBy("r.is_private")
			.limit(perPage)
			.offset(page * perPage);

		const results = await queryBuilder.getRawMany();
		const getRoomsResultDto = plainToInstance(RoomHeader, results);

		return getRoomsResultDto;
	}

	async getMessageLogs(roomId: number): Promise<IMessage[]> {
		console.log("roomId:", roomId);

		const queryBuilder = this.createQueryBuilder("r")
			.select([
				"msg.id AS id",
				"mem.id AS memberId",
				"mem.room_id AS roomId",
				"usr.nickname",
				"msg.message AS message",
				"msg.created_at AS createdAt",
				"msg.is_system AS isSystem",
				"usr.is_delete AS isDeleted",
			])
			.innerJoin(Member, "mem", "r.id = mem.room_id AND r.id = :roomId", {
				roomId,
			})
			.innerJoin(User, "usr", "usr.id = mem.user_id")
			.innerJoin(Message, "msg", "msg.member_id = mem.id")
			.orderBy("msg.created_at", "ASC");

		const results = await queryBuilder.getRawMany();

		console.log(results.length);

		return results;
	}
}
