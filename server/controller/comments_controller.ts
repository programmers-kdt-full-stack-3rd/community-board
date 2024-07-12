import { Request, Response, NextFunction } from "express";
import {
  createComment,
  deleteComment,
  readComments,
  updateComment,
} from "../db/context/comments_context";

export const handleCommentsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = parseInt(String(req.query.post_id), 10);

    const comments = await readComments(postId);

    res.status(200).json({ comments });
  } catch (err) {
    next(err);
  }
};

export const handleCommentCreate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await createComment({
      post_id: req.body.post_id,
      author_id: req.userId,
      content: req.body.content,
    });

    res.status(201).end();
  } catch (err) {
    next(err);
  }
};

export const handleCommentUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await updateComment({
      id: req.body.id,
      author_id: req.userId,
      content: req.body.content,
    });

    res.status(200).end();
  } catch (err) {
    next(err);
  }
};

export const handleCommentDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteComment({
      id: parseInt(req.params.comment_id, 10),
      author_id: req.userId,
    });

    res.status(200).end();
  } catch (err) {
    next(err);
  }
};
