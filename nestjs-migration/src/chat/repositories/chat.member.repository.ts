import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { Member } from "../entities/member.entity";
import { Room } from "../entities/room.entity";

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
}
