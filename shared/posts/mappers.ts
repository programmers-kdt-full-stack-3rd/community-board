import { IPostHeader, IPostInfo } from "./models";

export const mapDBToPostInfo = (data : any) : IPostInfo => {
    return {
        id : data.id,
        title : data.title,
        content : data.content,
        author_id : data.author_id,
        author_nickname : data.author_nickname,
        created_at : new Date(data.created_at),
        updated_at : data.updated_at? new Date(data.updated_at) : undefined,
        views : data.views,
        likes : data.likes,
        user_liked : !!data.user_liked,
    };
};

export const mapDBToPostHeaders = (datas : any[]) : IPostHeader[] => {
    return datas.map((data : any) => {
        return {
            id : data.id,
            title : data.title,
            author_nickname : data.author_nickname,
            created_at : new Date(data.created_at),
            likes : data.likes
        };
    });
}