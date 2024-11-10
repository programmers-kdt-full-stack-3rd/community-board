//
import { Injectable } from "@nestjs/common";

import { DataSource, Repository } from "typeorm";

import { QnA } from "./entities/qna.entity";

@Injectable()
export class QnARepository extends Repository<QnA> {
	constructor(dataSource: DataSource) {
		super(QnA, dataSource.createEntityManager());
	}

	async findByPostId(postId: number): Promise<QnA | null> {
		return await this.findOne({
			where: { post: { id: postId } },
			relations: ["comment"],
		});
	}
}
