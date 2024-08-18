import { Request, Response, NextFunction } from "express";
import {
	addPost,
	deletePost,
	getPostHeaders,
	getPostInfo,
	updatePost,
} from "../db/context/posts_context";
import { ServerError } from "../middleware/errors";
import { SortBy } from "shared";
import * as fs from "fs";
import { changeBadWords, getRegex } from "../utils/bad-word-regex/regexTask";
import regexs from "../utils/bad-word-regex/regexs.json";
import { addLog } from "../db/context/logs_context";

import pool from "../db/connect";
import { PoolConnection } from "mysql2/promise";

export interface IReadPostRequest {
	index: number;
	perPage: number;
	keyword?: string;
	sortBy?: SortBy;
}

export interface ICreatePostRequest {
	title: string;
	content: string;
	author_id: number;
}

export interface IUpdatePostRequest {
	title?: string;
	content?: string;
	author_id: number;
}

export const handlePostsRead = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const values: IReadPostRequest = {
			index: parseInt(req.query.index as string) - 1 || 0,
			perPage: parseInt(req.query.perPage as string) || 10,
			keyword: (req.query.keyword as string) || undefined,
			sortBy: parseInt(req.query.sortBy as string) || undefined,
		};

		const posts = await getPostHeaders(values);

		res.json({ total: posts.total, postHeaders: posts.postHeaders });
	} catch (err) {
		next(err);
	}
};

export const handlePostRead = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const post_id = parseInt(req.params.post_id);
		if (isNaN(post_id)) {
			throw ServerError.badRequest("Invalid post ID");
		}
		const post = await getPostInfo(post_id, req.userId);
		res.status(200).json({ post: post });
	} catch (err) {
		next(err);
	}
};

export const handlePostCreate = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let conn: PoolConnection | null = null;
	try {
		conn = await pool.getConnection();
		await conn.beginTransaction();

		const reqBody: ICreatePostRequest = {
			title: req.body.title,
			content: req.body.content,
			author_id: req.userId,
		};

		// 필터링
		const doFilter = req.body.doFilter;

		if (doFilter) {
			const regex = getRegex(regexs);
			const newText = changeBadWords(reqBody.content, regex);
			reqBody.content = newText;
		}
		// 필터링

		const postId = await addPost(reqBody, conn);

		await addLog(
			{
				user_id: req.userId,
				title: reqBody.title,
				category_id: 1,
			},
			conn
		);

		await conn.commit();
		res.status(200).json({ postId, message: "게시글 생성 success" });
	} catch (err) {
		if (conn) await conn.rollback();
		next(err);
	} finally {
		if (conn) conn.release();
	}
};

export const handlePostUpdate = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const post_id = parseInt(req.params.post_id);

		if (isNaN(post_id)) {
			throw ServerError.badRequest("Invalid post ID");
		}

		const reqBody: IUpdatePostRequest = {
			title: req.body.title,
			content: req.body.content,
			author_id: req.userId,
		};

		// 필터링
		const doFilter = req.body.doFilter;

		if (doFilter && reqBody.content) {
			const regex = getRegex(regexs);
			const newText = changeBadWords(reqBody.content, regex);
			reqBody.content = newText;
		}
		// 필터링

		await updatePost(post_id, reqBody);

		res.status(200).json({ message: "게시글 수정 success" });
	} catch (err) {
		next(err);
	}
};

export const handlePostDelete = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const post_id = parseInt(req.params.post_id);

		await deletePost(post_id, req.userId);

		res.status(200).json({ message: "게시글 삭제 success" });
	} catch (err) {
		next(err);
	}
};
