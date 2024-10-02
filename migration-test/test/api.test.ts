import { exec } from "child_process";
import path from "path";
import request from "supertest";
import waitOn from "wait-on";
import initializeDatabase from "./init/db-init-setup";
import { IApiTestCase } from "./interface/api-test-case.interface";
import { CommentApiTests } from "./testCase/comment-api.testcase";
import { LikeApiTests } from "./testCase/like-api.testcase";
import { PostApiTests } from "./testCase/post-api.testcase";
import { UserApiTests } from "./testCase/user-api.testcase";

// 테스트 실행기 클래스
class ApiTestRunner {
	private expressCookies: string[] = [];
	private nestCookies: string[] = [];
	private expressTempToken: string | null = null;
	private nestTempToken: string | null = null;

	constructor(
		private expressUrl: string,
		private nestUrl: string
	) {}

	async runUrl(testCase: IApiTestCase) {
		const expressRes = await this.sendRequest(
			this.expressUrl,
			testCase,
			this.expressCookies,
			this.expressTempToken
		);
		const nestRes = await this.sendRequest(
			this.nestUrl,
			testCase,
			this.nestCookies,
			this.nestTempToken
		);
		if (testCase.endpoint === "/api/user/login") {
			this.expressCookies =
				(expressRes.headers["set-cookie"] as unknown as string[]) || [];
			this.nestCookies =
				(nestRes.headers["set-cookie"] as unknown as string[]) || [];
		}

		if (testCase.endpoint === "/api/user/logout") {
			this.expressCookies = [];
			this.nestCookies = [];
		}

		if (testCase.endpoint === "/api/user/check-password") {
			this.expressTempToken = (
				expressRes.headers["set-cookie"] as unknown as string[]
			)?.find(cookie => cookie.startsWith("tempToken="));

			this.nestTempToken = (
				nestRes.headers["set-cookie"] as unknown as string[]
			)?.find(cookie => cookie.startsWith("tempToken="));
		}

		return { expressRes, nestRes };
	}

	async testApi(testCase: IApiTestCase) {
		const { expressRes, nestRes } = await this.runUrl(testCase);
		const ignoreFields = testCase.ignoreFields;

		let expressBody = expressRes.body;
		let nestBody = nestRes.body;

		expect(expressRes.status).toBe(nestRes.status);

		if (
			ignoreFields?.length === 0 ||
			ignoreFields === undefined ||
			expressRes.status >= 300
		) {
			expect(expressBody).toEqual(nestBody);
			return;
		}

		const removeIgnoredFields = (obj: any): any => {
			if (Array.isArray(obj)) {
				return obj.map(removeIgnoredFields);
			}
			if (typeof obj === "object" && obj !== null) {
				const result: any = {};
				for (const [key, value] of Object.entries(obj)) {
					if (ignoreFields?.includes(key)) continue;
					result[key] = removeIgnoredFields(value);
				}
				return result;
			}
			return obj;
		};

		expressBody = removeIgnoredFields(expressRes.body);
		nestBody = removeIgnoredFields(nestRes.body);

		expect(expressBody).toEqual(nestBody);
	}

	private async sendRequest(
		url: string,
		testCase: IApiTestCase,
		cookies: string[],
		tempToken?: string
	): Promise<request.Response> {
		try {
			let req = request(url)[testCase.method](testCase.endpoint);

			if (tempToken) {
				req = req.set("Cookie", [...cookies, tempToken]);
			} else if (cookies.length > 0) {
				req = req.set("Cookie", cookies);
			}

			if (testCase.data) {
				req = req.send(testCase.data);
			}

			const result = await req;

			testCase.statusCode = testCase.statusCode || 200;

			if (result.status !== testCase.statusCode) {
				throw new Error(
					`Failed to send request to ${url}${testCase.endpoint}. Status code: ${result.status}, expected: ${testCase.statusCode} ,
                        body: ${JSON.stringify(result.body)} 
                        data: ${JSON.stringify(testCase.data)}`
				);
			}

			return result;
		} catch (error) {
			console.log(testCase);
			throw error;
		}
	}
}

describe("API Migration Tests", () => {
	const EXPRESS_APP_PATH = path.resolve(__dirname, "../../server");
	const NEST_APP_PATH = path.resolve(__dirname, "../../nestjs-migration");

	const EXPRESS_URL = "http://localhost:8000";
	const NEST_URL = "http://localhost:6555";

	const loginTestCase = UserApiTests.login;
	const adminLoginTestCase = UserApiTests.adminLogin;
	const checkPasswordTestCase = UserApiTests.checkPassword;

	const changePassword = "ASDasD123123";

	const updateUserLoginTestCase = {
		...loginTestCase,
		data: {
			...loginTestCase.data,
			password: changePassword,
		},
	};

	const updateUserCheckPasswordTestCase = {
		...checkPasswordTestCase,
		data: {
			...checkPasswordTestCase.data,
			password: changePassword,
		},
	};

	let runner: ApiTestRunner;

	beforeAll(async () => {
		exec("npm run start:test", { cwd: EXPRESS_APP_PATH });
		exec("npm run start:test", { cwd: NEST_APP_PATH });

		await Promise.all([
			waitOn({
				resources: [`${EXPRESS_URL}/health`],
				timeout: 30000,
				interval: 500,
			}),
			waitOn({
				resources: [`${NEST_URL}/health`],
				timeout: 30000,
				interval: 500,
			}),
		]);

		runner = new ApiTestRunner(EXPRESS_URL, NEST_URL);
	}, 60000);

	afterAll(async () => {
		exec("npm run stop:test", { cwd: EXPRESS_APP_PATH });
		exec("npm run stop:test", { cwd: NEST_APP_PATH });

		await initializeDatabase();
	});

	describe("User API tests", () => {
		it("POST /api/user/join", async () => {
			const testCase = UserApiTests.join;
			await runner.testApi(testCase);
		});

		it("POST /api/user/login", async () => {
			const testCase = UserApiTests.login;
			await runner.testApi(testCase);
		});

		it("GET /api/user", async () => {
			const testCase = UserApiTests.readUser;
			await runner.testApi(testCase);
		});

		it("POST /api/user/check-password", async () => {
			const testCase = UserApiTests.checkPassword;
			await runner.testApi(testCase);
		});

		it("PUT /api/user", async () => {
			const testCase = UserApiTests.updateUser;

			await runner.testApi(testCase);
			await runner.testApi(updateUserLoginTestCase);
		});

		it("POST /api/user/logout", async () => {
			const testCase = UserApiTests.logout;
			await runner.testApi(testCase);

			await runner.runUrl(updateUserLoginTestCase);
		});
	});

	describe("Post API tests", () => {
		it("POST /api/post", async () => {
			const testCase = PostApiTests.createPost;

			await runner.testApi(testCase);
		});

		it("GET /api/post", async () => {
			const testCase = PostApiTests.readPost;

			await runner.testApi(testCase);
		});

		it("GET /api/post/1", async () => {
			const testCase = PostApiTests.readPostById;
			await runner.testApi(testCase);
		});

		it("PATCH /api/post/1", async () => {
			const testCase = PostApiTests.updatePost;
			await runner.testApi(testCase);
		});
	});

	describe("Comment API tests", () => {
		it("POST /api/comment", async () => {
			const testCase = CommentApiTests.createComment;
			await runner.testApi(testCase);
		});

		it("GET /api/comment?post_id=1", async () => {
			const testCase = CommentApiTests.readComments;

			await runner.testApi(testCase);
		});

		it("PATCH /api/comment/1", async () => {
			const testCase = CommentApiTests.updateComment;
			await runner.testApi(testCase);
		});
	});

	describe("like API tests", () => {
		// TODO: 좋아요 삭제시에 실제로 삭제 성공했는지 확인하는 기능 필요시에 추가

		it("POST /api/like/post/1", async () => {
			const testCase = LikeApiTests.createLikeByPostId;
			await runner.testApi(testCase);
		});

		it("DELETE /api/like/post/1", async () => {
			const testCase = LikeApiTests.deleteLikeByPostId;

			await runner.testApi(testCase);
		});

		it("POST /api/like/comment/1", async () => {
			const testCase = LikeApiTests.createLikeByCommentId;

			await runner.testApi(testCase);
		});

		it("DELETE /api/like/comment/1", async () => {
			const testCase = LikeApiTests.deleteLikeByCommentId;

			await runner.testApi(testCase);
		});
	});

	describe("DELETE API 테스트", () => {
		// TODO: 각각 삭제시에 실제로 삭제 성공했는지 확인하는 기능 필요시에 추가

		it("DELETE /api/post/1", async () => {
			const testCase = PostApiTests.deletePost;

			await runner.testApi(testCase);
		});

		it("DELETE /api/comment/1", async () => {
			const testCase = CommentApiTests.deleteComment;

			await runner.testApi(testCase);
		});

		it("DELETE /api/user", async () => {
			const testCase = UserApiTests.deleteUser;
			const deleteUserTestCase: IApiTestCase = {
				...loginTestCase,
				data: {
					...loginTestCase.data,
					password: changePassword,
				},
				statusCode: 400,
			};

			await runner.runUrl(updateUserCheckPasswordTestCase);
			await runner.testApi(testCase);
			await runner.testApi(deleteUserTestCase);
		});
	});
});
