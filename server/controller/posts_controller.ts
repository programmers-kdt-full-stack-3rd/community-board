import { Request, Response, NextFunction } from 'express';
import { getPostHeaders } from '../db/context/posts_context';

export interface PostRequest {
    index : number;
    perPage : number;
    keyword : string | null;
}

export const getPosts = async (req : Request, res : Response, next : NextFunction) => {
    try{
        const values : PostRequest = {
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