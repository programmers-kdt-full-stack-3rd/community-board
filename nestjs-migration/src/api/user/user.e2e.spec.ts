import { Test, TestingModule } from "@nestjs/testing";
import { ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { UserController } from "./user.controller";
import { CreateUserDto } from "./dto/create-user.dto";
import { VALIDATION_ERROR_MESSAGES } from "./constant/user.constants";
import { LoginGuard } from "src/common/guard/login.guard";
import { PasswordGuard } from "src/common/guard/password.guard";
import { AuthService } from "../auth/auth.service";
import { UserService } from "./user.service";
import { RbacService } from "../rbac/rbac.service";

describe("UserController (e2e)", () => {
	let app: INestApplication;

	let userService: UserService;

	const mockUserService = {
		login: jest.fn(),
		createUser: jest.fn(),
		logout: jest.fn(),
		checkPassword: jest.fn(),
		readUser: jest.fn(),
		updateUser: jest.fn(),
		deleteUser: jest.fn(),
		updateProfile: jest.fn(),
		updatePassword: jest.fn(),
	};

	const mockRbacService = {
		isAdmin: jest.fn(),
	};

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [UserController],
			providers: [
				LoginGuard,
				PasswordGuard,

				{
					provide: AuthService,
					useValue: {},
				},

				{
					provide: UserService,
					useValue: mockUserService,
				},
				{
					provide: RbacService,
					useValue: mockRbacService,
				},
			],
		}).compile();

		userService = moduleFixture.get<UserService>(UserService);

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe({ transform: true }));
		await app.init();
	});

	afterAll(async () => {
		await app.close();
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

		expect(response.body.message).toContain(
			VALIDATION_ERROR_MESSAGES.NICKNAME_REQUIRED
		);
	});

	it("회원 가입 테스트 - 성공", async () => {
		jest.spyOn(userService, "createUser").mockResolvedValue(undefined);

		const validDto: CreateUserDto = {
			email: "test@example.com",
			password: "Password123!",
			nickname: "TestUser",
		};

		const response = await request(app.getHttpServer())
			.post("/user/join")
			.send(validDto)
			.expect(201);

		expect(response.body).toEqual({ error: "" });
	});
});
