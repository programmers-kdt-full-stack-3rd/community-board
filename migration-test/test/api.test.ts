import { exec } from "child_process";
import path from "path";
import request from "supertest";
import waitOn from "wait-on";
import initializeDatabase from "./init/db-init-setup";
import { IApiTestCase } from "./interface/api-test-case.interface";
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

	async runTest(testCase: IApiTestCase) {
		const { expressRes, nestRes } = await this.runUrl(testCase);
		const result = await this.compareResponses(
			expressRes,
			nestRes,
			testCase.ignoreFields
		);

		return {
			result,
			expressRes: expressRes,
			nestRes: nestRes,
		};
	}

	async compareResponses(
		expressRes: request.Response,
		nestRes: request.Response,
		ignoreFields?: string[]
	) {
		if (expressRes.status !== nestRes.status) {
			return false;
		}

		if (
			ignoreFields?.length === 0 ||
			ignoreFields === undefined ||
			expressRes.status >= 300
		) {
			if (
				JSON.stringify(expressRes.body) === JSON.stringify(nestRes.body)
			) {
				return true;
			}

			console.log("expressRes.body", expressRes.body);
			console.log("nestRes.body", nestRes.body);
			return false;
		}

		const cleanedExpressBody = this.removeIgnoredFields(
			expressRes.body,
			ignoreFields
		);
		const cleanedNestBody = this.removeIgnoredFields(
			nestRes.body,
			ignoreFields
		);

		if (
			JSON.stringify(cleanedExpressBody) !==
			JSON.stringify(cleanedNestBody)
		) {
			console.log("expressRes.body", expressRes.body);
			console.log("nestRes.body", nestRes.body);
			return false;
		}

		return true;
	}

	async testApi(testCase: IApiTestCase) {
		const { result } = await this.runTest(testCase);
		expect(result).toBe(true);
	}

	private async sendRequest(
		url: string,
		testCase: IApiTestCase,
		cookies: string[],
		tempToken?: string
	): Promise<request.Response> {
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
				`Failed to send request to ${url}${testCase.endpoint}. Status code: ${result.status}, expected: ${testCase.statusCode}`
			);
		}

		return result;
	}

	private removeIgnoredFields(obj: any, ignoreFields?: string[]): any {
		if (!obj) return obj;
		if (!ignoreFields || !Array.isArray(ignoreFields)) return obj;

		const cleaned = { ...obj };
		for (const field of ignoreFields) {
			delete cleaned.result[field];
		}
		return cleaned;
	}
}

describe("API Migration Tests", () => {
	const EXPRESS_APP_PATH = path.resolve(__dirname, "../../server");
	const NEST_APP_PATH = path.resolve(__dirname, "../../nestjs-migration");

	const EXPRESS_URL = "http://localhost:8000";
	const NEST_URL = "http://localhost:6555";

	const loginTestCase = UserApiTests.login;
	const checkPasswordTestCase = UserApiTests.checkPassword;

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
	}, 60000);

	afterAll(async () => {
		exec("npm run stop:test", { cwd: EXPRESS_APP_PATH });
		exec("npm run stop:test", { cwd: NEST_APP_PATH });

		await initializeDatabase();
	});

	describe("User API tests", () => {
		let runner: ApiTestRunner;

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
				password: changePassword,
			},
		};

		beforeAll(() => {
			runner = new ApiTestRunner(EXPRESS_URL, NEST_URL);
		});

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

			await runner.runUrl(updateUserLoginTestCase);
			await runner.runUrl(updateUserCheckPasswordTestCase);
			await runner.testApi(testCase);
			await runner.testApi(deleteUserTestCase);
		});
	});
});
