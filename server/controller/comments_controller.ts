import { Request, Response, NextFunction } from "express";
import { createComment, getComments } from "../db/context/comment_context";
import { ServerError } from "../middleware/errors";

export const getCommentsByPostId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

export const createCommentByPostId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = parseInt(req.params.post_id, 10);
    if (isNaN(postId)) {
      throw ServerError.badRequest("Invalid post ID");
    }

    await createComment({
      post_id: parseInt(req.params.post_id),
      author_id: req.body.author_id,
      content: req.body.content,
    });

    res.status(201).end();
  } catch (err) {
    next(err);
  }
};
