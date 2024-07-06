import { Request, Response, NextFunction } from "express";
import { getComments } from "../db/context/comment_context";
import { ServerError } from "../middleware/errors";

export const getCommentsByPostId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = parseInt(req.params.post_id, 10);
    if (isNaN(postId)) {
      throw ServerError.badRequest("Invalid post ID");
    }

    const comments = await getComments(parseInt(req.params.post_id));
    res.status(200).json({ comments });
  } catch (err) {
    next(err);
  }
};
