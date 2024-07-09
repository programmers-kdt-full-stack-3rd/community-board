import { Request, Response, NextFunction } from "express";
import { createComment, getComments } from "../db/context/comment_context";

export const getCommentsByPostId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = parseInt(req.params.post_id, 10);

    const comments = await getComments(postId);

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

    await createComment({
      post_id: postId,
      author_id: req.body.author_id,
      content: req.body.content,
    });

    res.status(201).end();
  } catch (err) {
    next(err);
  }
};
