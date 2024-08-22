export interface IUser {
    id : number;
    email : string;
    nickname : string; 
    createdAt : Date;
    isDelete : boolean;
    statistics : {
        comments : number;
        posts : number;
    };    
}