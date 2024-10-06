import { IApiTestCase } from "../interface/api-test-case.interface";

export const LikeApiTests: Record<string, IApiTestCase> = {
	createLikeByPostId: {
		description: "게시글 좋아요 생성 성공",
		endpoint: "/api/like/post/1",
		method: "post",
		data: {
			post_id: 1,
		},
		statusCode: 201,
	},

	createLikeByCommentId: {
		description: "댓글 좋아요 생성 성공",
		endpoint: "/api/like/comment/1",
		method: "post",
		data: {
			comment_id: 1,
		},
		statusCode: 201,
	},

	deleteLikeByPostId: {
		description: "게시글 좋아요 삭제 성공",
		endpoint: "/api/like/post/1",
		method: "delete",
	},

	deleteLikeByCommentId: {
		description: "댓글 좋아요 삭제 성공",
		endpoint: "/api/like/comment/1",
		method: "delete",
	},
};
