export type TLikeTarget = "post" | "comment";

interface ILikesSummary {
  likes: number;
  user_liked: boolean;
}

type TLikeTargetIdWrapper<T extends TLikeTarget> = {
  [key in `${T}_id`]: number;
};

export type TLikes<T extends TLikeTarget> =
  | ILikesSummary
  | TLikeTargetIdWrapper<T>;
