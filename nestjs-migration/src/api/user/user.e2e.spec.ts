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
