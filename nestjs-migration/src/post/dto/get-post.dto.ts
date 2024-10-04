import { Exclude, Transform } from "class-transformer";

export class getPostDto {
	authour_id: number;
	author_nickname: string;
	content: string;
	id: number;

	@Transform(({ value }) => !!value)
	is_author: boolean;

	title: string;
	created_at: Date;

	@Transform(({ value }) => parseInt(value))
	likes: number;

	@Transform(({ value }) => !!value)
	user_liked: boolean;

	views: number;

	@Transform(({ value }) => (value === null ? undefined : value))
	updated_at: Date;
}
