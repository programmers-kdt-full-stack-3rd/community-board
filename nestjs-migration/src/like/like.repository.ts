import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Like } from "./entities/like.entity";
import { CommentLike } from "./entities/comment-like.entity";

@Injectable()
export class LikeRepository extends Repository<Like> {
    constructor(private dataSource: DataSource) {
        super(Like, dataSource.createEntityManager());
    };
}

@Injectable()
export class CommentLikeRepository extends Repository<CommentLike> {
    constructor(private dataSource: DataSource) {
        super(CommentLike, dataSource.createEntityManager());
    };
}