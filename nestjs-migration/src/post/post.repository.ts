import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { IAdminPostResponse } from "shared";
import { GetTopPostsRes } from "src/rank/dto/get-top-posts.dto";
import { Brackets, DataSource, Repository } from "typeorm";
import { GetPostsDto } from "../admin/dto/get-posts.dto";
import { Like } from "../like/entities/like.entity";
import { GetPostHeadersDto } from "./dto/get-post-headers.dto";
import { GetPostDto } from "./dto/get-post.dto";
import { ReadPostsQuery, SortBy } from "./dto/read-posts-query.dto";
import { Post } from "./entities/post.entity";

@Injectable()
export class PostRepository extends Repository<Post> {
	constructor(private dataSource: DataSource) {
		super(Post, dataSource.createEntityManager());
	}

	async getPostHeaders(
		readPostsQueryDto: ReadPostsQuery,
		userId: number
	): Promise<GetPostHeadersDto[]> {
		let { index, perPage, category_id, keyword, sortBy } =
			readPostsQueryDto;
		index = index > 0 ? index - 1 : 0;

		const queryBuilder = this.createQueryBuilder("post")
			.leftJoinAndSelect("post.author", "user")
			.leftJoinAndSelect("post.category", "pc")
			.select([
				"post.id as id",
				"title",
				"pc.name as category",
				"user.nickname as author_nickname",
				"post.created_at as created_at",
				"views",
			])
			.addSelect(
				subQuery =>
					subQuery
						.select("COUNT(*)")
						.from(Like, "likes")
						.where("likes.post_id = post.id"),
				"likes"
			)
			.where("post.is_delete = :isDelete", { isDelete: false })
			.andWhere(
				new Brackets(qb => {
					qb.where("post.is_private = :isPrivateFalse", {
						isPrivateFalse: false,
					}).orWhere(
						"post.is_private = :isPrivateTrue AND post.author_id = :authorId",
						{
							isPrivateTrue: true,
							authorId: userId,
						}
					);
				})
			);

		if (keyword) {
			queryBuilder.andWhere("post.title LIKE :keyword", {
				keyword: `%${keyword.trim()}%`,
			});
		}

		if (category_id) {
			queryBuilder.andWhere("post.category_id = :categoryId", {
				categoryId: category_id,
			});
		}

		if (sortBy === SortBy.LIKES) {
			queryBuilder.orderBy("post.likes", "DESC");
		} else if (sortBy === SortBy.VIEWS) {
			queryBuilder.orderBy("post.views", "DESC");
		} else {
			queryBuilder.orderBy("post.created_at", "DESC");
		}

		queryBuilder
			.addOrderBy("user.id", "ASC")
			.limit(perPage) //TODO: .vs take, skip
			.offset(index * perPage);

		const results = await queryBuilder.getRawMany();

		return plainToInstance(GetPostHeadersDto, results);
	}

	async getPostTotal(
		readPostsQueryDto: ReadPostsQuery,
		userId: number
	): Promise<number> {
		let { keyword, category_id } = readPostsQueryDto;
		userId ? userId : 0;

		const queryBuilder = this.createQueryBuilder("post")
			.leftJoinAndSelect("post.author", "user")
			.where("post.is_delete = :isDelete", { isDelete: false })
			.andWhere(
				new Brackets(qb => {
					qb.where("post.is_private = :isPrivateFalse", {
						isPrivateFalse: false,
					}).orWhere(
						"post.is_private = :isPrivateTrue AND post.author_id = :authorId",
						{
							isPrivateTrue: true,
							authorId: userId,
						}
					);
				})
			);
		if (keyword) {
			queryBuilder.andWhere("post.title LIKE :keyword", {
				keyword: `%${keyword.trim()}%`,
			});
		}
		if (category_id) {
			queryBuilder.andWhere("post.category_id = :categoryId", {
				categoryId: category_id,
			});
		}

		return await queryBuilder.getCount();
	}

	async getPost(postId: number, userId: number): Promise<GetPostDto> {
		const authorId = userId;
		const queryBuilder = this.createQueryBuilder("post")
			.leftJoin("post.author", "user")
			.leftJoin("post.recrutingPosts", "rp", "rp.post_id = post.id") // RecrutingPosts와 조인
			.select([
				"post.id as id",
				"post.title as title",
				"post.content as content",
				"pc.name as category",
				"post.author_id as author_id",
				"user.nickname as author_nickname",
				"(post.author_id = :authorId) AS is_author",
				"post.created_at as created_at",
				"post.updated_at as updated_at",
				"post.views as views",
				`EXISTS(
					SELECT 1
					FROM post_likes AS pl
					WHERE pl.post_id = post.id AND pl.user_id = :userId
				) AS user_liked`,
				"rp.room_id as room_id", // room_id 추가
			])
			.addSelect(
				subQuery =>
					subQuery
						.select("COUNT(*)")
						.from(Like, "likes")
						.where("likes.post_id = post.id"),
				"likes"
			)
			.leftJoin("post.category", "pc")
			.where("post.is_delete = :isPostDeleted", { isPostDeleted: false })
			.andWhere("user.is_delete = :isUserDeleted", {
				isUserDeleted: false,
			})
			.andWhere("post.id = :postId", { postId: postId })
			.andWhere(
				new Brackets(qb => {
					qb.where("post.is_private = :isPrivateFalse", {
						isPrivateFalse: false,
					}).orWhere(
						"post.is_private = :isPrivateTrue AND post.author_id = :authorId",
						{
							isPrivateTrue: true,
							authorId: userId,
						}
					);
				})
			)
			.setParameters({ authorId, userId });

		const result = await queryBuilder.getRawOne();
		const post = plainToInstance(GetPostDto, result);

		return post;
	}

	async getAdminPosts(getPostsDto: GetPostsDto): Promise<IAdminPostResponse> {
		const { index, perPage, keyword } = getPostsDto;

		const queryBuilder = this.createQueryBuilder("post")
			.select([
				"post.id",
				"post.title",
				"user.nickname as author",
				"post.created_at",
				"post.is_delete",
				"post.is_private",
			])
			.leftJoin("post.author", "user")
			.where("post.is_delete = :isDelete", { isDelete: false });

		if (keyword) {
			queryBuilder.andWhere("post.title LIKE :keyword", {
				keyword: `%${keyword}%`,
			});
		}

		queryBuilder
			.orderBy("post.id", "ASC")
			.limit(perPage)
			.offset(index * perPage);

		const [posts, total] = await Promise.all([
			queryBuilder.getRawMany(),
			queryBuilder.getCount(),
		]);

		return {
			total,
			postHeaders: posts.map(post => {
				return {
					id: post.post_id,
					title: post.post_title,
					author: post.author,
					createdAt: post.created_at,
					isDelete: post.is_delete,
					isPrivate: post.is_private,
				};
			}),
		};
	}

	async getPostStats() {
		const result = await this.createQueryBuilder("post")
			.select("COUNT(post.id)", "count")
			.addSelect("COALESCE(SUM(post.views),0)", "views")
			.innerJoin("post.author", "user")
			.where("post.isDelete = :isDelete", { isDelete: false })
			.andWhere("user.isDelete = :isDelete", { isDelete: false })
			.getRawOne();

		return {
			count: parseInt(result.count, 10),
			views: parseInt(result.views, 10),
		};
	}

	async getIntervalStats(
		dateFormat: string,
		startDate?: Date,
		endDate?: Date
	) {
		const queryBuilder = this.createQueryBuilder("post")
			.select("DATE_FORMAT(post.createdAt, :dateFormat)", "date")
			.setParameter("dateFormat", dateFormat)
			.addSelect("COUNT(post.id)", "count")
			.addSelect("COALESCE(SUM(post.views), 0)", "views")
			.innerJoin("post.author", "user")
			.where("user.isDelete = :isDelete", { isDelete: false })
			.andWhere("post.isDelete = :isDelete", { isDelete: false });

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
			views: parseInt(row.views, 10),
		}));
	}

	async getPostStatByUser(userId: number) {
		const queryBuilder = this.createQueryBuilder("post")
			.select("COUNT(*)", "count")
			.addSelect("COALESCE(SUM(post.views),0)", "views")
			.where("post.isDelete = :isDelete", { isDelete: false })
			.andWhere("post.author_id = :authorId", { authorId: userId });

		const result = await queryBuilder.getRawOne();

		return {
			count: parseInt(result.count, 10),
			views: parseInt(result.views, 10),
		};
	}

	async getTopPosts() {
		const queryBuilder = this.createQueryBuilder("post")
			.innerJoin("post.author", "user")
			.leftJoin("post.likes", "pl")
			.select([
				"post.title as title",
				"post.id as postId",
				"user.nickname as nickname",
				"COALESCE(COUNT(pl.id), 0) as likeCount",
			])
			.where("post.is_delete = :isPostDeleted", { isPostDeleted: false })
			.andWhere("user.is_delete = :isUserDeleted", {
				isUserDeleted: false,
			})
			.groupBy("post.id")
			.orderBy("likeCount", "DESC")
			.addOrderBy("post.id", "ASC")
			.limit(5);

		const results = await queryBuilder.getRawMany();

		return plainToInstance(GetTopPostsRes, results);
	}
}
