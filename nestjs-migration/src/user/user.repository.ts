import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { User } from "./entities/user.entity";
@Injectable()
export class UserRepository extends Repository<User> {
	constructor(private dataSource: DataSource) {
		super(User, dataSource.createEntityManager());
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
