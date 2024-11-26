import { Test, TestingModule } from "@nestjs/testing";
import { ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import {
	USER_ERROR_MESSAGES,
	VALIDATION_ERROR_MESSAGES,
} from "./constant/user.constants";
import { ServerError } from "src/common/exceptions/server-error.exception";
import { AppModule } from "src/app.module";
import { GlobalExceptionFilter } from "src/common/filters/global-exception.filter";
import { UserRepository } from "./user.repository";
import { LoginDto } from "./dto/login.dto";
import { getKstNow } from "src/utils/date.util";
import * as cookieParser from "cookie-parser";

describe("UserController (e2e)", () => {
	let app: INestApplication;
	let userRepository: UserRepository;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(
			new ValidationPipe({
				disableErrorMessages: true,
				exceptionFactory: errors => {
					const errorMessage = Object.values(
						errors[0].constraints
					)[0];
					throw ServerError.badRequest(errorMessage);
				},
				transform: true,
			})
		);
		app.use(cookieParser());
		app.useGlobalFilters(new GlobalExceptionFilter());
		userRepository = moduleFixture.get(UserRepository);
		await app.init();
	});

	afterAll(async () => {
		await userRepository.query("SET FOREIGN_KEY_CHECKS = 0;");
		await userRepository.query("TRUNCATE TABLE users;");
		await userRepository.query("SET FOREIGN_KEY_CHECKS = 1;");
		await app.close();
	});

	let cookies;

	describe("POST /user/join", () => {
		it("회원 가입 테스트 - 성공", async () => {
			const validDto: CreateUserDto = {
				email: "test@example.com",
				password: "Password123!",
				nickname: "TestUser1",
			};

			const response = await request(app.getHttpServer())
				.post("/user/join")
				.send(validDto)
				.expect(201);

			expect(response.body).toEqual({ error: "" });
		});

		it("회원 가입 테스트 - 실페 (1) - nickname is null", async () => {
			const invalidDto = {
				email: "test@example.com",
				password: "Password123!",
			};

			const response = await request(app.getHttpServer())
				.post("/user/join")
				.send(invalidDto)
				.expect(400);

			expect(response.body.error).toContain(
				VALIDATION_ERROR_MESSAGES.NICKNAME_REQUIRED
			);
		});

		it("회원 가입 테스트 - 실패 (2) - 중복 이메일", async () => {
			const validDto: CreateUserDto = {
				email: "test@example.com",
				password: "Password123!",
				nickname: "TestUser2",
			};

			const response = await request(app.getHttpServer())
				.post("/user/join")
				.send(validDto)
				.expect(400);

			expect(response.body.error).toContain(
				USER_ERROR_MESSAGES.DUPLICATE_DATA
			);
		});

		it("회원 가입 테스트 - 실패 (3) - 중복 닉네임", async () => {
			const validDto: CreateUserDto = {
				email: "test2@example.com",
				password: "Password123!",
				nickname: "TestUser1",
			};

			const response = await request(app.getHttpServer())
				.post("/user/join")
				.send(validDto)
				.expect(400);

			expect(response.body.error).toContain(
				USER_ERROR_MESSAGES.DUPLICATE_DATA
			);
		});
	});

	describe("POST /user/login", () => {
		it("로그인 테스트 - 성공", async () => {
			const loginDto: LoginDto = {
				email: "test@example.com",
				password: "Password123!",
			};

			const response = await request(app.getHttpServer())
				.post("/user/login")
				.send(loginDto)
				.expect(200);

			cookies = response.headers["set-cookie"];

			const { error, userInfo } = response.body;
			const { nickname, email, imgUrl, loginTime } = userInfo;

			expect(error).toEqual("");
			expect(nickname).toEqual("TestUser1");
			expect(email).toEqual("test@example.com");
			expect(imgUrl).toEqual(null);
			expect(new Date(loginTime).getTime()).toBeLessThanOrEqual(
				new Date(getKstNow()).getTime()
			);
		});

		// TODO : 로그인 실패 - 이메일이 잘못되었을 때와 비밀번호가 잘못 되었을 때 같은 에러를 전달하는게 좋을 듯?
		it("로그인 테스트 - 실패 (1) - 잘못된 이메일", async () => {
			const loginDto: LoginDto = {
				email: "wrong_test@example.com",
				password: "Password123!",
			};

			const response = await request(app.getHttpServer())
				.post("/user/login")
				.send(loginDto)
				.expect(400);

			expect(response.body.error).toContain(
				USER_ERROR_MESSAGES.NOT_FOUND_EMAIL
			);
		});

		it("로그인 테스트 - 실패 (2) - 잘못된 비밀번호", async () => {
			const loginDto: LoginDto = {
				email: "test@example.com",
				password: "testCase123!",
			};

			const response = await request(app.getHttpServer())
				.post("/user/login")
				.send(loginDto)
				.expect(400);

			expect(response.body.error).toContain(
				USER_ERROR_MESSAGES.INVALID_LOGIN
			);
		});

		it("로그인 테스트 - 실패 (3) - 이메일 양식", async () => {
			const loginDto: LoginDto = {
				email: "testexample.com",
				password: "testCase123!",
			};

			const response = await request(app.getHttpServer())
				.post("/user/login")
				.send(loginDto)
				.expect(400);

			expect(response.body.error).toContain(
				VALIDATION_ERROR_MESSAGES.INVALID_EMAIL
			);
		});

		it("로그인 테스트 - 실패 (4) - 비밀번호 양식", async () => {
			const loginDto: LoginDto = {
				email: "test@example.com",
				password: "testcase123!",
			};

			const response = await request(app.getHttpServer())
				.post("/user/login")
				.send(loginDto)
				.expect(400);

			expect(response.body.error).toContain(
				VALIDATION_ERROR_MESSAGES.INVALID_PASSWORD
			);
		});
	});

	describe("POST /user/logout", () => {
		it("로그아웃 테스트 - 성공", async () => {
			const cookieHeader = cookies.map(
				cookie => cookie.split(";")[0] + ";"
			);

			const response = await request(app.getHttpServer())
				.post("/user/logout")
				.set("Cookie", cookieHeader.join(" "))
				.expect(200);

			expect(response.body.error).toEqual("");
		});

		it("로그아웃 테스트 - 실패 (1) - 로그인 상태 아님", async () => {
			const response = await request(app.getHttpServer())
				.post("/user/logout")
				.expect(401);

			expect(response.body.error).toContain("로그인이 필요합니다.");
		});
	});

	describe("POST /user/check-password", () => {});

	describe("POST /user/check-duplicate", () => {});

	describe("POST /user/check-admin", () => {});

	describe("GET /user", () => {});

	describe("PUT /user", () => {});

	describe("PATCH /user/profile", () => {});

	describe("PATCH /user/password", () => {});

	describe("DELETE /user", () => {});
});
