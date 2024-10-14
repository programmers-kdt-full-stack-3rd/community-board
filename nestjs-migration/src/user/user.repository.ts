import { Injectable } from "@nestjs/common";
import { IUserInfoResponse } from "shared";
import { DataSource, Repository } from "typeorm";
import { GetUsersDto } from "../admin/dto/get-users.dto";
import { User } from "./entities/user.entity";
import { plainToInstance } from "class-transformer";
import { GetTopActivties } from "src/rank/dto/get-top-activities.dto";
@Injectable()
export class UserRepository extends Repository<User> {
	constructor(private dataSource: DataSource) {
		super(User, dataSource.createEntityManager());
	}

	readUserByOAuth(provider: string, oauthAccountId: string) {
		return this.createQueryBuilder("user")
			.innerJoin("oauth_connections", "oc", "oc.userId = user.id")
			.innerJoin("oauth_providers", "op", "op.id = oc.oauth_provider_id")
			.where("oc.oauth_account_id = :oauthAccountId", { oauthAccountId })
			.andWhere("op.name = :provider", { provider })
			.select([
				"user.id",
				"user.email",
				"user.nickname",
				"user.is_delete",
			])
			.getOne();
	}

	updateUser(
		userId: number,
		updateData: Partial<Pick<User, "nickname" | "password" | "salt">>
	) {
		return this.createQueryBuilder("user")
			.update()
			.set(updateData)
			.where("id = :userId", { userId })
			.andWhere("isDelete = :isDelete", { isDelete: false })
			.execute();
	}

	registerUserEmail(
		userId: number,
		updateData: Partial<
			Pick<User, "email" | "nickname" | "password" | "salt">
		>
	) {
		return this.createQueryBuilder("user")
			.update()
			.where("id = :userId", { userId })
			.set(updateData)
			.andWhere("isDelete = :isDelete", { isDelete: false })
			.execute();
	}

	deleteUser(userId: number) {
		return this.createQueryBuilder("user")
			.update()
			.set({ isDelete: true })
			.where("id = :userId", { userId })
			.andWhere("isDelete = :isDelete", { isDelete: false })
			.execute();
	}

	async getUserInfo({
		index,
		perPage,
		nickname,
		email,
	}: GetUsersDto): Promise<IUserInfoResponse> {
		const queryBuilder = this.createQueryBuilder("user").select([
			"user.id",
			"user.email",
			"user.nickname",
			"user.isDelete",
			"user.createdAt",
			"(SELECT COUNT(*) FROM posts WHERE posts.author_id = user.id) AS postCount",
			"(SELECT COUNT(*) FROM comments WHERE comments.author_id = user.id) AS commentCount",
		]);

		if (nickname) {
			queryBuilder.andWhere("user.nickname LIKE :nickname", {
				nickname: `%${nickname}%`,
			});
		}

		if (email) {
			queryBuilder.andWhere("user.email LIKE :email", {
				email: `%${email}%`,
			});
		}

		queryBuilder
			.orderBy("user.id", "ASC")
			.limit(perPage)
			.offset(index * perPage);

		const [userInfo, total] = await Promise.all([
			queryBuilder.getRawMany(),
			queryBuilder.getCount(),
		]);

		return {
			total,
			userInfo: userInfo.map(row => ({
				id: row.user_id,
				email: row.user_email,
				nickname: row.user_nickname,
				createdAt: row.user_created_at,
				isDelete: row.user_is_delete,
				statistics: {
					comments: parseInt(row.commentCount),
					posts: parseInt(row.postCount),
				},
			})),
		};
	}

	restoreUser(userId: number) {
		return this.createQueryBuilder("user")
			.update()
			.set({ isDelete: false })
			.where("id = :userId", { userId })
			.andWhere("isDelete = :isDelete", { isDelete: true })
			.execute();
	}

	async countActiveUsers() {
		return this.count({ where: { isDelete: false } });
	}

	async getIntervalStats(
		dateFormat: string,
		startDate?: Date,
		endDate?: Date
	) {
		const queryBuilder = this.createQueryBuilder("user")
			.select("DATE_FORMAT(user.createdAt, :dateFormat)", "date")
			.setParameter("dateFormat", dateFormat)
			.addSelect("COUNT(user.id)", "count")
			.where("user.isDelete = :isDelete", { isDelete: false });

		if (startDate) {
			queryBuilder.andWhere("user.createdAt >= :startDate", {
				startDate,
			});
		}

		if (endDate) {
			queryBuilder.andWhere("user.createdAt <= :endDate", { endDate });
		}

		const result = await queryBuilder.groupBy("date").getRawMany();

		return result.map(row => ({
			...row,
			count: parseInt(row.count, 10),
		}));
	}

	async getTopUserActivities() {
		const queryBuilder = this.createQueryBuilder("user")
			.leftJoin("user.posts", "post")
			.leftJoin("user.comments", "comment")
			.select(
				`(SELECT COALESCE(COUNT(posts.id), 0) FROM posts WHERE posts.author_id = user.id AND posts.is_delete = false)`,
				"postCount"
			)
			.addSelect(
				`(SELECT COALESCE(COUNT(comments.id), 0) FROM comments WHERE comments.author_id = user.id AND comments.is_delete = false)`,
				"commentCount"
			)
			.addSelect("user.nickname as nickname")
			.groupBy("user.id")
			.orderBy("postCount", "DESC")
			.addOrderBy("commentCount", "DESC")
			.addOrderBy("user.id", "ASC")
			.limit(5);

		const results = await queryBuilder.getRawMany();

		return plainToInstance(GetTopActivties, results);
	}

	// true : 같은 사용자 있음 (에러 상황)
	async findSameUser(nickname?: string, email?: string): Promise<boolean> {
		const queryBuilder = this.createQueryBuilder("user").select(`user.id`);

		if (nickname) {
			queryBuilder.orWhere("nickname = :nickname", { nickname });
		}

		if (email) {
			queryBuilder.orWhere("email = :email", { email });
		}

		const sameUserCount = await queryBuilder.getCount();

		return sameUserCount !== 0;
	}

	async updateUserProfile(
		userId: number,
		nickname?: string,
		imgUrl?: string
	) {
		const updateData: Partial<{ nickname?: string; imgUrl?: string }> = {};

		if (nickname) {
			updateData.nickname = nickname;
		}

		if (imgUrl) {
			updateData.imgUrl = imgUrl;
		}

		return this.createQueryBuilder("user")
			.update()
			.set(updateData)
			.where("id = :userId", { userId })
			.andWhere("isDelete = :isDelete", { isDelete: false })
			.execute();
	}

	async updateUserPassword(userId: number, newPassword: string) {
		return this.createQueryBuilder("user")
			.update()
			.set({ password: newPassword })
			.where("id = :userId", { userId })
			.andWhere("isDelete = :isDelete", { isDelete: false })
			.execute();
	}
	//예시 코드

	// async customMethod(id: number): Promise<User> {
	//     return await this.createQueryBuilder('user')
	//       .where('user.id = :id', { id })
	//       .getOneOrFail();
	//   }

	//TODO: TYPEORM 사용으로 최종 결정시 제거
	// async createUser({
	// 	email,
	// 	password,
	// 	nickname,
	// }: CreateUserDto): Promise<ResultSetHeader> {
	// 	const query = `
	//         INSERT INTO users (email, password, nickname)
	//         VALUES (?, ?, ?)
	//     `;
	// 	const [rows]: [ResultSetHeader, FieldPacket[]] =
	// 		await this.db.withConnection(conn =>
	// 			conn.query(query, [email, password, nickname])
	// 		);
	// 	return rows;
	// }
}
