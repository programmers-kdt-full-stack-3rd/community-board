import { RowDataPacket } from "mysql2";

export interface IAdminPost {
	id: number;
	title: string;
	author_id: number;
	created_at: Date;
	updated_at: Date;
	isDelete: boolean;
	is_private: boolean;
}

export interface IAdminPostRow extends IAdminPost, RowDataPacket {}
