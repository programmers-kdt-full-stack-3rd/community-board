import { Request, Response, NextFunction } from "express";
import {
	createComment,
	deleteComment,
	getTotalComments,
	readComments,
	updateComment,
} from "../db/context/comments_context";
import { addLog } from "../db/context/logs_context";
import pool from "../db/connect";
import { PoolConnection } from "mysql2/promise";
import { makeLogTitle } from "../utils/user-logs-utils";

export const handleCommentsRead = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const postId = parseInt(String(req.query.post_id), 10);

		const { total } = await getTotalComments(postId);

		const perPage = Math.max(
			1,
			parseInt(String(req.query.perPage), 10) || 50
		);
		const fallbackIndex = Math.max(1, Math.ceil(total / perPage));
		const index =
			Math.max(
				1,
				parseInt(String(req.query.index), 10) || fallbackIndex
			) - 1;

		const { comments } = await readComments(
			postId,
			index,
			perPage,
			req.userId
		);

		res.status(200).json({ total, comments });
	} catch (err) {
		next(err);
	}
};

export const handleCommentCreate = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let conn: PoolConnection | null = null;
	try {
		conn = await pool.getConnection();
		await conn.beginTransaction();

		await createComment(
			{
				post_id: req.body.post_id,
				author_id: req.userId,
				content: req.body.content,
			},
			conn
		);

		const logTitle = makeLogTitle(req.body.content);

		await addLog(
			{
				user_id: req.userId,
				title: logTitle,
				category_id: 2,
			},
			conn
		);
		await conn.commit();
		res.status(201).end();
	} catch (err) {
		if (conn) await conn.rollback();
		next(err);
	} finally {
		if (conn) conn.release();
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
