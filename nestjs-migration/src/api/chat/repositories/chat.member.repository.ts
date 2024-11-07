import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { Member } from "../entities/member.entity";
import { Room } from "../entities/room.entity";
import { IRoomMember, mapDBToIRoomMember } from "shared";
import { User } from "../../user/entities/user.entity";

@Injectable()
export class MemberRepository extends Repository<Member> {
	constructor(private dataSource: DataSource) {
		super(Member, dataSource.createEntityManager());
	}

	async getRoomCntByUserId(userId: number): Promise<number> {
		const queryBuilder = this.createQueryBuilder("m")
			.leftJoinAndSelect(Room, "r", "m.room_id = r.id")
			.where("m.user_id = :userId", { userId })
			.select("COUNT(r.id)", "total");

		const result = await queryBuilder.getRawOne();
		const totalCnt = parseInt(result.total);

		return totalCnt;
	}

	async getRoomMembers(roomId: number): Promise<IRoomMember[]> {
		const queryBuilder = this.createQueryBuilder("m")
			.leftJoinAndSelect(User, "u", "m.user_id = u.id")
			.where("m.room_id = :roomId AND m.is_deleted != :isDeleted", {
				roomId,
				isDeleted: true,
			})
			.select([
				"m.id as member_id",
				"u.nickname as nickname",
				"u.img_url as img_url",
				"m.is_host as is_host",
			]);

		const roomMembers = await queryBuilder.getRawMany();

		const result = roomMembers.map(roomMember => {
			return mapDBToIRoomMember(roomMember);
		});

		return result;
	}
}
