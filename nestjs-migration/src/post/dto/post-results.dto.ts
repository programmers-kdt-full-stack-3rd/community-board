import { getPostHeadersDto } from "./get-post-headers.dto";
import { getPostDto } from "./get-post.dto";

export class createPostRes {
	postId: number;
	message: string;
}

export class getPostsHeaderRes {
	total: number;
	postHeaders: getPostHeadersDto[];
}

export class getPostRes {
	post: getPostDto;
}

export class updatePostRes {
	message: string;
}

export class deletePostRes {
	message: string;
}
