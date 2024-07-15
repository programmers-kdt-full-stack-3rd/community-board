import { IComment } from "../model/comments";

export const mapDBToComments = (data: any[]): IComment[] => {
  return data.map((item) => ({
    id: item.id,
    content: item.content,
    author_id: item.author_id,
    author_nickname: item.author_nickname,
    is_author : !!item.is_author,
    created_at: new Date(item.created_at),
    updated_at: item.updated_at ? new Date(item.updated_at) : null,
    likes: item.likes,
    user_liked: !!item.user_liked,
  }));
};
