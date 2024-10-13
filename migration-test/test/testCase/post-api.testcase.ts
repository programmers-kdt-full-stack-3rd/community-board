import { IApiTestCase } from "../interface/api-test-case.interface";

export const PostApiTests: Record<string, IApiTestCase> = {
	createPost: {
		description: "게시글 생성 성공",
		endpoint: "/api/post",
		method: "post",
		data: {
			title: "게시글 제목",
			content: "게시글 내용",
			category_id: 1,
		},
	},
	readPost: {
		description: "게시글 조회 성공",
		endpoint: "/api/post",
		method: "get",
		ignoreFields: ["created_at"],
	},

	readPostById: {
		description: "게시글 상세 조회 성공",
		endpoint: "/api/post/1",
		method: "get",
		ignoreFields: ["created_at"],
	},

	updatePost: {
		description: "게시글 수정 성공",
		endpoint: "/api/post/1",
		method: "patch",
		data: {
			title: "수정된 게시글 제목",
			content: "수정된 게시글 내용",
		},
	},
	deletePost: {
		description: "게시글 삭제 성공",
		endpoint: "/api/post/1",
		method: "delete",
	},
};
