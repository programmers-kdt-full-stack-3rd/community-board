import { IApiTestCase } from "../interface/api-test-case.interface";

export const AdminApiTests: Record<string, IApiTestCase> = {
	getUserList: {
		description: "사용자 목록 조회 성공",
		endpoint: "/api/admin/user",
		method: "get",
		ignoreFields: ["createdAt", "isDelete"],
	},

	deleteUser: {
		description: "사용자 삭제 성공",
		endpoint: "/api/admin/user/2",
		method: "delete",
	},

	restoreUser: {
		description: "사용자 복구 성공",
		endpoint: "/api/admin/user/2/restore",
		method: "patch",
	},

	getUserLog: {
		description: "사용자 로그 조회 성공",
		endpoint: "/api/admin/log/2",
		method: "get",
		ignoreFields: ["createdAt"],
	},

	getPostList: {
		description: "게시글 목록 조회 성공",
		endpoint: "/api/admin/post",
		method: "get",
		ignoreFields: ["createdAt", "isDelete"],
	},

	deletePost: {
		description: "게시글 삭제 성공",
		endpoint: "/api/admin/post/1",
		method: "delete",
	},

	restorePost: {
		description: "게시글 복구 성공",
		endpoint: "/api/admin/post/1/restore",
		method: "patch",
	},

	publicPost: {
		description: "게시글 공개 성공",
		endpoint: "/api/admin/post/1/public",
		method: "patch",
	},

	privatePost: {
		description: "게시글 비공개 성공",
		endpoint: "/api/admin/post/1/private",
		method: "patch",
	},

	totalStat: {
		description: "전체 통계 조회 성공",
		endpoint: "/api/admin/stat",
		method: "get",
	},

	getUserStat: {
		description: "사용자 통계 조회 성공",
		endpoint: "/api/admin/stat/1",
		method: "get",
	},
};
