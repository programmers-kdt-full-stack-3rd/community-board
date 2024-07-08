import { Request, Response, NextFunction } from 'express';
import { getPostHeaders, getPostInfo } from '../db/context/posts_context';
import { ServerError } from '../middleware/errors';

export interface IReadPostRequest {
    index : number;
    perPage : number;
    keyword : string | null;
}

export interface ICreatePostRequest {
    title : string;
    content : string;
    author_id : number;
}

export const getPosts = async (req : Request, res : Response, next : NextFunction) => {
    try{
        const values : IReadPostRequest = {
            index : parseInt(req.query.index as string) - 1 || 0,
            perPage : parseInt(req.query.perPage as string) || 10,
            keyword : req.query.keyword as string || null
        };
        const posts = await getPostHeaders(values);
        res.json({ posts });
    }catch(err){
        next(err);
    }
}

export const getPost = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const post_id = parseInt(req.params.post_id);
        if (isNaN(post_id)) {
            throw ServerError.badRequest("Invalid post ID");
        }
        const post = await getPostInfo(post_id);
        res.status(200).json({ post : post });
    } catch (err) {
        next(err);
    }
}