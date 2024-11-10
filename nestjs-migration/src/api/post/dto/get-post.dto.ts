import { Transform } from "class-transformer";

export class GetPostDto {
	authour_id: number;
	author_nickname: string;
	content: string;
	category: string;
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
