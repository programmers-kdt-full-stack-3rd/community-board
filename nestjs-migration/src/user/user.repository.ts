import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../db/db.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { FieldPacket, ResultSetHeader } from "mysql2/promise";

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
