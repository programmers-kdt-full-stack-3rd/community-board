import { adminAccountEnv } from "../config/env.config";
import { IApiTestCase } from "../interface/api-test-case.interface";

export const UserApiTests: Record<string, IApiTestCase> = {
	join: {
		description: "회원가입 성공",
		endpoint: "/api/user/join",
		method: "post",
		data: {
			nickname: "asdasd123",
			email: "asdasd1@naver.com",
			password: "Admin123123",
			requiredPassword: "Admin123123",
		},
		statusCode: 201,
	},
	login: {
		description: "로그인 성공",
		endpoint: "/api/user/login",
		method: "post",
		data: {
			email: "asdasd1@naver.com",
			password: "Admin123123",
		},
		ignoreFields: ["loginTime"],
	},

	logout: {
		description: "로그아웃 성공",
		endpoint: "/api/user/logout",
		method: "post",
	},

	readUser: {
		description: "유저 정보 조회 성공",
		endpoint: "/api/user",
		method: "get",
	},

	checkPassword: {
		description: "비밀번호 확인 성공",
		endpoint: "/api/user/check-password",
		method: "post",
		data: {
			password: "Admin123123",
		},
	},

	updateUser: {
		description: "유저 정보 수정 성공",
		endpoint: "/api/user",
		method: "put",
		data: {
			nickname: "aasd123",
			password: "ASDasD123123",
		},
	},

	deleteUser: {
		description: "유저 정보 삭제 성공",
		endpoint: "/api/user",
		method: "delete",
	},

	adminLogin: {
		description: "어드민 로그인 성공",
		endpoint: "/api/user/login",
		method: "post",
		data: {
			email: adminAccountEnv.ADMIN_ACCOUNT,
			password: adminAccountEnv.ADMIN_PASSWORD,
		},
	},
};
