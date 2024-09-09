export interface IComment {
	id: number;
	content: string;
	author_id: number;
	author_nickname: string;
	is_author: boolean;
	created_at: Date;
	updated_at?: Date | null;
	likes: number;
	user_liked: boolean;
}
