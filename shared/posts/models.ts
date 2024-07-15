export interface IPostInfo {
    id : number;
    title : string;
    content : string;
    author_id : number;
    author_nickname : string;
    created_at : Date;
    updated_at? : Date;
    views : number;
    likes : number;
    user_liked : boolean;
}

export interface IPostHeader {
    id : number;
    title : string;
    author_nickname : string;
    created_at : Date;
    likes : number;
}