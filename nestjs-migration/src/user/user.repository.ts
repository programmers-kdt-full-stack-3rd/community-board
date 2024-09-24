import { Injectable } from "@nestjs/common";
import { IUserInfoResponse } from "shared";
import { DataSource, Repository } from "typeorm";
import { GetUsersDto } from "../admin/dto/get-users.dto";
import { User } from "./entities/user.entity";
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
