import { Request, Response, NextFunction } from "express";
import { createComment, readComments } from "../db/context/comments_context";

export const handleCommentsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = parseInt(req.params.post_id, 10);

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
      post_id: parseInt(req.body.post_id, 10),
      author_id: parseInt(req.body.author_id, 10), // TODO: 토큰 미들웨어 도입 시 req 객체에서 가져오기
      content: req.body.content,
    });

    res.status(201).end();
  } catch (err) {
    next(err);
  }
};
