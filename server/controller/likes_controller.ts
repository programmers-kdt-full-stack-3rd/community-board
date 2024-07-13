import { Request, Response, NextFunction } from "express";
import { createLike, deleteLike, readLikes } from "../db/context/likes_context";
import { TLikeTarget } from "../db/model/likes";

export const handleLikeCreateWith =
  <T extends TLikeTarget>(targetType: T) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const targetId = parseInt(req.params[`${targetType}_id`], 10);

      await createLike(targetType, targetId, req.userId);
      const likes = await readLikes(targetType, targetId, req.userId);

      res.status(201).json({
        [`${targetType}_likes`]: likes,
      });
    } catch (err) {
      next(err);
    }
  };

export const handleLikeDeleteWith =
  <T extends TLikeTarget>(targetType: T) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const targetId = parseInt(req.params[`${targetType}_id`], 10);

      await deleteLike(targetType, targetId, req.userId);
      const likes = await readLikes(targetType, targetId, req.userId);

      res.status(200).json({
        [`${targetType}_likes`]: likes,
      });
    } catch (err) {
      next(err);
    }
  };
