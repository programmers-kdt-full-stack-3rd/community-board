import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./user.entity";

@Injectable()
export class UserRepository {
	constructor(
		@InjectRepository(User)
		private readonly repository: Repository<User>
	) {}

	async save(createUserDto: CreateUserDto): Promise<User> {
		return this.repository.save(createUserDto);
	}

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
