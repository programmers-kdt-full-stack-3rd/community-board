import { Request, Response, NextFunction } from 'express';
import { addPost, deletePost, getPostHeaders, getPostInfo, updatePost } from '../db/context/posts_context';
import { ServerError } from '../middleware/errors';
import { SortBy } from 'shared';

export interface IReadPostRequest {
    index : number;
    perPage : number;
    keyword? : string;
    sortBy? : SortBy;
}

export interface ICreatePostRequest {
    title : string;
    content : string;
    author_id : number;
}

export interface IUpdatePostRequest {
    title? : string;
    content? : string;
    author_id : number;
}

export const handlePostsRead = async (req : Request, res : Response, next : NextFunction) => {
    try{
        const values : IReadPostRequest = {
            index : parseInt(req.query.index as string) - 1 || 0,
            perPage : parseInt(req.query.perPage as string) || 10,
            keyword : req.query.keyword as string || undefined,
            sortBy : parseInt(req.query.sortBy as string) || undefined
        };

        console.log(values);

        const posts = await getPostHeaders(values);
        
        res.json({ total : posts.total, postHeaders : posts.postHeaders });
    }catch(err){
        next(err);
    }
}

export const handlePostRead = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const post_id = parseInt(req.params.post_id);
        if (isNaN(post_id)) {
            throw ServerError.badRequest("Invalid post ID");
        }
        const post = await getPostInfo(post_id, req.userId);
        res.status(200).json({ post : post });
    } catch (err) {
        next(err);
    }
}

export const handlePostCreate = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const reqBody : ICreatePostRequest = {
            title : req.body.title,
            content : req.body.content,
            author_id : req.userId
        };

        await addPost(reqBody);

        res.status(200).json({ message : "게시글 생성 success"});
    } catch (err) {
        next(err);
    }
}

export const handlePostUpdate = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const post_id = parseInt(req.params.post_id);

        if (isNaN(post_id)) {
            throw ServerError.badRequest("Invalid post ID");
        }

        const reqBody : IUpdatePostRequest = {
            title : req.body.title,
            content : req.body.content,
            author_id : req.userId
        };

        await updatePost(post_id, reqBody);

        res.status(200).json({ message : "게시글 수정 success"});
    } catch (err) {
        next(err);
    }
}

export const handlePostDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post_id = parseInt(req.params.post_id);

        await deletePost(post_id, req.userId);

        res.status(200).json({ message : "게시글 삭제 success"});
    } catch (err) {
        next(err);
    }
}