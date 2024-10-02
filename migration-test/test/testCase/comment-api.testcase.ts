import { IApiTestCase } from "../interface/api-test-case.interface";

export const CommentApiTests: Record<string, IApiTestCase> = {
	createComment: {
		description: "댓글 생성 성공",
		endpoint: "/api/comment",
		method: "post",
		data: {
			post_id: 1,
			content: "댓글 내용",
		},
		statusCode: 201,
	},

	readComments: {
		description: "댓글 목록 조회 성공",
		endpoint: "/api/comment?post_id=1",
		method: "get",
	},

	updateComment: {
		description: "댓글 수정 성공",
		endpoint: "/api/comment",
		method: "patch",
		data: {
			id: 1,
			content: "수정된 댓글 내용",
		},
	},

	deleteComment: {
		description: "댓글 삭제 성공",
		endpoint: "/api/comment/1",
		method: "delete",
	},
};
