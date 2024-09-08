import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Pool, RowDataPacket, FieldPacket } from "mysql2/promise";
import { DatabaseService } from "./db/db.service";

interface IUserAuthResult extends RowDataPacket {
	email: string;
}

@Injectable()
export class AppService {
	getHello(): string {
		return "Hello World!";
	}
}
