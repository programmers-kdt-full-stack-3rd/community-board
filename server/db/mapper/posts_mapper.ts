import { PostInfo, PostHeader } from "../model/posts";

export const mapDBToPosts = (datas : any[]) : PostInfo[] => {
    return datas.map((data : any) => {
        return {
            id : data.id,
            title : data.title,
            content : data.content,
            author_id : data.author_id,
            author_nickname : data.author_nickname,
            created_at : new Date(data.created_at),
            updated_at : data.updated_at? new Date(data.updated_at) : null,
            views : data.views,
            likes : data.likes
        };
    });
};

export const mapDBToPostsHeader = (datas : []) : PostHeader[] => {
    return datas.map((data : any) => {
        return {
            id : data.id,
            title : data.title,
            content : data.content,
            author_id : data.author_id,
            author_nickname : data.author_nickname,
            created_at : new Date(data.created_at),
            updated_at : data.updated_at? new Date(data.updated_at) : null,
            views : data.views,
            likes : data.likes
        };
    });
}