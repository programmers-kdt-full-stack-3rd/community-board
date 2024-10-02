import { Injectable } from "@nestjs/common";
import { Message } from "../entities/message.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class MessageRepository extends Repository<Message> {
	constructor(private dataSource: DataSource) {
		super(Message, dataSource.createEntityManager());
	}
}
