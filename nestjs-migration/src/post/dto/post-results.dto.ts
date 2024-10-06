import { GetPostHeadersDto } from "./get-post-headers.dto";
import { GetPostDto } from "./get-post.dto";

export class CreatePostRes {
	postId: number;
	message: string;
}

export class GetPostsHeaderRes {
	total: number;
	postHeaders: GetPostHeadersDto[];
}

export class GetPostRes {
	post: GetPostDto;
}

export class UpdatePostRes {
	message: string;
}

export class DeletePostRes {
	message: string;
}
