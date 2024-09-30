import { exec } from "child_process";
import path from "path";
import request from "supertest";
import waitOn from "wait-on";
import initializeDatabase from "./init/db-init-setup";

interface ApiResponse {
	status: number;
	body: any;
}

// 테스트 케이스 타입 정의
type HttpMethod = "get" | "post" | "put" | "delete";

interface ApiTestCase {
	description: string;
	endpoint: string;
	method: HttpMethod;
	data?: Record<string, any>;
	ignoreFields?: string[];
	dependencies?: string[];
}

// 테스트 케이스 정의
const UserApiTests: Record<string, ApiTestCase> = {
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
		dependencies: ["join"],
	},
};

// 테스트 실행기 클래스
class ApiTestRunner {
	constructor(
		private expressUrl: string,
		private nestUrl: string
	) {}

	async runUrl(testCase: ApiTestCase) {
		const expressRes = await this.sendRequest(this.expressUrl, testCase);
		const nestRes = await this.sendRequest(this.nestUrl, testCase);

		return { expressRes, nestRes };
	}

	async runTest(testCase: ApiTestCase) {
		const { expressRes, nestRes } = await this.runUrl(testCase);
		const result = await this.compareResponses(
			expressRes,
			nestRes,
			testCase.ignoreFields
		);
		return result;
	}

	async compareResponses(
		expressRes: request.Response,
		nestRes: request.Response,
		ignoreFields: string[] = []
	) {
		if (expressRes.status !== nestRes.status) {
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
			return false;
		}

		return true;
	}

	private async sendRequest(
		url: string,
		testCase: ApiTestCase
	): Promise<request.Response> {
		let req = request(url)[testCase.method](testCase.endpoint);

		return await req;
	}

	private removeIgnoredFields(obj: any, ignoreFields: string[]): any {
		const cleaned = { ...obj };
		for (const field of ignoreFields) {
			delete cleaned[field];
		}
		return cleaned;
	}
}

describe("API Migration Tests", () => {
	const EXPRESS_APP_PATH = path.resolve(__dirname, "../../server");
	const NEST_APP_PATH = path.resolve(__dirname, "../../nestjs-migration");

	const EXPRESS_URL = "http://localhost:8000";
	const NEST_URL = "http://localhost:6555";

	beforeAll(async () => {
		try {
			exec("npm run stop:test", { cwd: EXPRESS_APP_PATH });
			exec("npm run stop:test", { cwd: NEST_APP_PATH });
		} catch (error) {
			console.log("No processes to stop");
		}

		await new Promise(resolve => setTimeout(resolve, 5000));

		exec("npm run start:test", { cwd: EXPRESS_APP_PATH });
		exec("npm run start:test", { cwd: NEST_APP_PATH });

		await waitOn({
			resources: [`${EXPRESS_URL}/health`, `${NEST_URL}/health`],
			timeout: 30000,
			interval: 500,
			verbose: true,
		});
	}, 60000);

	afterAll(async () => {
		exec("npm run stop:test", { cwd: EXPRESS_APP_PATH });
		exec("npm run stop:test", { cwd: NEST_APP_PATH });

		await initializeDatabase();
	});

	describe("User API tests", () => {
		it("Post /api/user/join", async () => {
			const runner = new ApiTestRunner(EXPRESS_URL, NEST_URL);
			const result = await runner.runTest(UserApiTests.join);
			expect(result).toBeTruthy();
		});
	});
});
