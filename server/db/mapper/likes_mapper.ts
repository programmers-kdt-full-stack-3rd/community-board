import { TLikes, TLikeTarget } from "../model/likes";

export const mapDBToLikes = <T extends TLikeTarget = TLikeTarget>(
  targetType: T,
  targetId: number,
  data: any
): TLikes<T> => {
  return {
    [`${targetType}_id`]: targetId,
    likes: data.likes,
    user_liked: !!data.user_liked,
  };
};

export const likeTargetToName: { [key in TLikeTarget]: string } = {
  post: "게시글",
  comment: "댓글",
};
