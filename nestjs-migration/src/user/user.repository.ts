import { Injectable } from "@nestjs/common";
import { FieldPacket, ResultSetHeader } from "mysql2/promise";
import { DatabaseService } from "../db/db.service";
import { CreateUserDto } from "./dto/create-user.dto";

//TODO: TYPEORM 사용으로 최종 결정시 제거

@Injectable()
export class UserRepository {
	constructor(private db: DatabaseService) {}

	async createUser({
		email,
		password,
		nickname,
	}: CreateUserDto): Promise<ResultSetHeader> {
		const query = `
            INSERT INTO users (email, password, nickname)
            VALUES (?, ?, ?)
        `;
		const [rows]: [ResultSetHeader, FieldPacket[]] =
			await this.db.withConnection(conn =>
				conn.query(query, [email, password, nickname])
			);
		return rows;
	}
}
