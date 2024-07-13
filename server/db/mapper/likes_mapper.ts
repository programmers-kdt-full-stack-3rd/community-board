import { TLikeTarget } from "../model/likes";

export const likeTargetToName: { [key in TLikeTarget]: string } = {
  post: "게시글",
  comment: "댓글",
};
