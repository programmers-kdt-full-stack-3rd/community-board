import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { DataSource, Repository } from "typeorm";
import { CommentLike } from "../like/entities/comment-like.entity";
import { CommentsDto, ReadCommentQuery } from "./dto/read-comment.dto";
import { Comment } from "./entities/comment.entity";
import { GetTopCommentsRes } from "src/rank/dto/get-top-comments.dto";

@Injectable()
export class CommentRepository extends Repository<Comment> {
	constructor(private dataSource: DataSource) {
		super(Comment, dataSource.createEntityManager());
	}

	async getTotalComments(postId: number): Promise<number> {
		const queryBuilder = this.createQueryBuilder("comment")
			.innerJoin("comment.post", "post")
			.andWhere("post_id = :postId ", { postId })
			.innerJoin("comment.author", "author")
			.andWhere("comment.is_delete = :isDelete", { isDelete: false })
			.andWhere("author.is_delete = :isDelete", { isDelete: false });

		const total = await queryBuilder.getCount();
		return total;
	}

	async getComments(
		readCommentsQueryDto: ReadCommentQuery
	): Promise<CommentsDto[]> {
		let { post_id: postId, userId, index, perPage } = readCommentsQueryDto;
		const authorId = userId;

		const queryBuilder = this.createQueryBuilder("comment")
			.select([
				"comment.id as id",
				"comment.content as content",
				"comment.author_id as author_id",
				"author.nickname as author_nickname",
				"comment.author_id = :authorId as is_author",
				"comment.created_at as created_at",
				"comment.updated_at as updated_at",
				`EXISTS(
                    SELECT *
                    FROM comment_likes
                    WHERE comment_likes.comment_id = comment.id
                    AND comment_likes.user_id = :userId
                ) AS user_liked`,
			])
			.addSelect(
				subQuery =>
					subQuery
						.select("COUNT(*)")
						.from(CommentLike, "cl")
						.where("cl.comment_id = comment.id"),
				"likes"
			)
			.innerJoin("comment.post", "post")
			.andWhere("comment.post_id = :postId", { postId })
			.innerJoin("comment.author", "author")
			.andWhere("comment.is_delete = :isDelete", { isDelete: false })
			.andWhere("author.is_delete = :isDelete", { isDelete: false })
			.orderBy("comment.created_at")
			.addOrderBy("comment.id")
			.limit(perPage)
			.offset(index * perPage)
			.setParameters({ authorId, userId });

		const results = await queryBuilder.getRawMany();
		const comments = plainToInstance(CommentsDto, results);

		return comments;
	}

	async countActiveComments() {
		const result = await this.createQueryBuilder("comment")
			.select("COUNT(comment.id)", "count")
			.innerJoin("comment.author", "user")
			.innerJoin("comment.post", "post")
			.where("comment.isDelete = :isDelete", { isDelete: false })
			.andWhere("user.isDelete = :isDelete", { isDelete: false })
			.andWhere("post.isDelete = :isDelete", { isDelete: false })
			.getRawOne();

		return parseInt(result.count, 10);
	}

	async getIntervalStats(
		dateFormat: string,
		startDate?: Date,
		endDate?: Date
	) {
		const queryBuilder = this.createQueryBuilder("comment")
			.select("DATE_FORMAT(comment.createdAt, :dateFormat)", "date")
			.setParameter("dateFormat", dateFormat)
			.addSelect("COUNT(comment.id)", "count")
			.innerJoin("comment.author", "user")
			.innerJoin("comment.post", "post")
			.where("user.isDelete = :isDelete", { isDelete: false })
			.andWhere("post.isDelete = :isDelete", { isDelete: false })
			.andWhere("comment.isDelete = :isDelete", { isDelete: false });

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

	async getCommentStatByUser(userId: number) {
		const queryBuilder = this.createQueryBuilder("comment")
			.select("COUNT(*)", "count")
			.innerJoin("comment.author", "user")
			.where("comment.isDelete = :isDelete", { isDelete: false })
			.andWhere("user.isDelete = :isDelete", { isDelete: false })
			.andWhere("comment.author_id = :authorId", { authorId: userId });

		const result = await queryBuilder.getRawOne();

		return {
			count: parseInt(result.count, 10),
		};
	}

	async getTopComments() {
		const queryBuilder = this.createQueryBuilder("comment")
			.leftJoin("comment.author", "user")
			.leftJoin("comment.comment_likes", "cl")
			.select([
				"user.nickname as nickname",
				"COUNT(*) as likeCount",
				"comment.id",
			])
			.where("comment.is_delete = :isDeleted", { isDeleted: false })
			.andWhere("user.is_delete = :isDeleted", {
				isDeleted: false,
			})
			.groupBy("comment.id")
			.orderBy("likeCount", "DESC") // 좋아요 수로 정렬
			.limit(5);

		const results = await queryBuilder.getRawMany();

		return plainToInstance(GetTopCommentsRes, results);
	}
}
