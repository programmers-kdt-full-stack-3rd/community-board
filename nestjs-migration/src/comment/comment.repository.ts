import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Comment } from "./entities/comment.entity";
import { CommentsDto, CommentsResultDto, ReadCommentQueryDto } from "./dto/read-comment.dto";
import { Like } from "src/like/entities/like.entity";
import { plainToInstance } from "class-transformer";
import { CommentLikes } from "./entities/comment-likes.entity";

@Injectable()
export class CommentRepository extends Repository<Comment> {
    constructor(private dataSource: DataSource) {
        super(Comment, dataSource.createEntityManager());
    };

    async getTotalComments (postId: number) : Promise<number> {
        const queryBuilder = this.createQueryBuilder("comment")
        .innerJoin("comment.post", "post")
        .andWhere("post_id = :postId ", {postId,})
        .innerJoin("comment.author", "author")
        .andWhere("comment.is_delete = :isDelete", {isDelete: 0})
        .andWhere("author.is_delete = :isDelete", {isDelete: 0})
        
        const total = await queryBuilder.getCount();
        return total;
    }

    async getComments(readCommentsQueryDto: ReadCommentQueryDto) : Promise <CommentsDto[]> {
        let {post_id: postId, userId, index, perPage} = readCommentsQueryDto;
        const authorId = userId;

        const queryBuilder = this.createQueryBuilder("comment")
        .select(["comment.id as id", 
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
                subQuery.select("COUNT(*)")
                        .from(CommentLikes, "cl")
                        .where("cl.comment_id = comment.id"),
                "likes"
        )
        .innerJoin("comment.post", "post")
        .andWhere("comment.post_id = :postId", {postId,})
        .innerJoin("comment.author","author")
        .andWhere("comment.is_delete = :isDelete", {isDelete: 0})
        .andWhere("author.is_delete = :isDelete", {isDelete: 0})
        .orderBy("comment.created_at")
        .addOrderBy("comment.id")
        .limit(perPage)
        .offset(index * perPage)
        .setParameters({ authorId, userId });

        const results = await queryBuilder.getRawMany();
        const comments = plainToInstance(CommentsDto, results)

        return comments
    }

}