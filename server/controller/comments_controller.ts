import { Request, Response, NextFunction } from "express";
import { getComments } from "../db/context/comment_context";

export const getCommentsByPostId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comments = await getComments(parseInt(req.params.post_id));
    res.json(comments);
  } catch (err) {
    next(err);
  }
};
