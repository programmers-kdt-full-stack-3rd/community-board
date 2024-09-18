import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Post } from "./entities/post.entity";
import { ReadPostsQueryDto, SortBy } from "./dto/read-posts-query.dto";
import { getPostHeadersDto } from "./dto/get-post-headers.dto";
import { Like } from "../like/entities/like.entity";

@Injectable()
export class PostRepository extends Repository<Post> {
    constructor(private dataSource: DataSource) {
        super(Post, dataSource.createEntityManager());
    };

    async getPostHeaders(readPostsQueryDto: ReadPostsQueryDto, userId: number): Promise<getPostHeadersDto[]> {

        let {index, perPage, keyword, sortBy } = readPostsQueryDto;

        const queryBuilder = 
            this.createQueryBuilder('post')
            .leftJoinAndSelect('post.author','user')
            .select(['post.id as id', 'title', 'user.nickname as author_nickname', 'post.created_at as created_at','views'])
            .addSelect(
                (subQuery) =>
                subQuery
                    .select('COUNT(*)')
                    .from(Like, 'likes')
                    .where('likes.post_id = post.id'),
                'likes'
            )
            .where('post.isDelete = :isDelete', {isDelete: false})
            .andWhere('post.is_private = :isPrivateFalse OR (post.is_private = :isPrivateTrue AND post.author_id = :authorId)', { 
                isPrivateFalse: false,
                isPrivateTrue: true,
                authorId: userId 
            });
            
          if(keyword) {
            queryBuilder.andWhere('post.title LIKE :keyword', { keyword: `%${keyword.trim()}%` });
          }

          if(sortBy === SortBy.LIKES) {
            queryBuilder.orderBy("post.likes","DESC");
          } else if (sortBy === SortBy.VIEWS) {
            queryBuilder.orderBy("post.views", "DESC");
          } else {
            queryBuilder.orderBy("post.created_at", "DESC");
          };
        
          queryBuilder
            .addOrderBy("user.id", "ASC")
            .limit(perPage)
            .offset(index * perPage);
          
          return await queryBuilder.getRawMany();    
    };

    async getPostTotal(readPostsQueryDto: ReadPostsQueryDto, userId: number ) {
        let { keyword } = readPostsQueryDto;
        userId ? userId: 0;

        const queryBuilder = 
            this.createQueryBuilder('post')
            .leftJoinAndSelect('post.author','user')
            .where('post.isDelete = :isDelete', {isDelete: false})
            .andWhere('post.is_private = :isPrivateFalse OR (post.is_private = :isPrivateTrue AND post.author_id = :authorId)', { 
                isPrivateFalse: false,
                isPrivateTrue: true,
                authorId: userId 
            });
        if (keyword) {
            queryBuilder.andWhere('post.title LIKE :keyword', { keyword: `%${keyword.trim()}%` });
        }     

        return await queryBuilder.getCount();    
    };

    async getPostHeader(post_id, user_id) {
        const author_id = user_id
        const queryBuilder = 
            this.createQueryBuilder('post')
            .select(
                ["post.id as id","title", "content", "author_id","user.nickname as author_nickname","(post.author_id = :author_id) AS is_author","post.created_at as created_at","post.updated_at as updated_at","views",
                `EXISTS(
                    SELECT 1
                    FROM post_likes AS pl
                    WHERE pl.post_id = post.id AND pl.user_id = :user_id
                ) AS user_liked`
            ])
            .addSelect(
                (subQuery) =>
                subQuery
                    .select('COUNT(*)')
                    .from(Like, "post_likes"),
                "likes"
            )
            .leftJoin('post.author', 'user')
            .where("post.isDelete = :isPostDeleted",
                {isPostDeleted: false}
            )
            .andWhere("user.is_delete = :isUserDeleted", { isUserDeleted: false})
            .andWhere("post.id = :post_id", {post_id: post_id})
            .setParameters({author_id, user_id})
        
        return await queryBuilder.getRawOne();
            
    };
}
