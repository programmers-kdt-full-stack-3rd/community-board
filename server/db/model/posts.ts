export interface PostInfo {
    id : number;
    title : string;
    content : string;
    author_id : number;
    author_nickname : string;
    created_at : Date;
    updated_at : Date | null;
    views : number;
    likes : number;
}

export interface PostHeader {
    id : number;
    title : string;
    author_nickname : string;
    created_at : Date;
    likes : number;
}