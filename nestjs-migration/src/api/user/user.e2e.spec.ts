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

	const cookies = {
		login: [],
		delete: [],
		admin: [],
	};

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

	const sendRequest = (
		method: "get" | "post" | "delete" | "put" | "patch",
		url: string,
		dto?: object,
		cookie?: string
	) => {
		let responseBuilder = request(app.getHttpServer())[method](url);

		if (dto) {
			responseBuilder = responseBuilder.send(dto);
		}

		if (cookie) {
			responseBuilder = responseBuilder.set("Cookie", cookie);
		}

		return responseBuilder;
	};

	const normalUserInfo: CreateUserDto = {
		email: "test@example.com",
		password: "Password123!",
		nickname: "TestUser1",
	};

	const deleteUserInfo: CreateUserDto = {
		email: "deleteTest@example.com",
		password: "Password123!",
		nickname: "DeleteUser",
	};

	const adminUserInfo: CreateUserDto = {
		email: "adminTest@example.com",
		password: "Password123!",
		nickname: "adminUser",
	};

	describe("POST /user/join", () => {
		it("회원 가입 테스트 - 성공 (1)", async () => {
			const response = await sendRequest(
				"post",
				"/user/join",
				normalUserInfo
			).expect(201);

			expect(response.body.error).toEqual("");
		});

		it("회원 가입 테스트 - 성공 (2)", async () => {
			const response = await sendRequest(
				"post",
				"/user/join",
				deleteUserInfo
			).expect(201);

			expect(response.body).toEqual({ error: "" });
		});

		it("회원 가입 테스트 - 성공 (3)", async () => {
			const response = await sendRequest(
				"post",
				"/user/join",
				adminUserInfo
			).expect(201);

			expect(response.body).toEqual({ error: "" });

			// 회원 가입 성공 -> admin 권한 부여
			await userRepository
				.createQueryBuilder()
				.update("users")
				.set({ roleId: 1 })
				.where("email = :email", { email: adminUserInfo.email })
				.execute();
		});

		it("회원 가입 테스트 - 실페 (1) - invalid DTO", async () => {
			const invalidUserInfo = {
				email: "test@example.com",
				password: "Password123!",
				nickname: "",
			};

			const response = await sendRequest(
				"post",
				"/user/join",
				invalidUserInfo
			).expect(400);

			expect(response.body.error).toContain(
				VALIDATION_ERROR_MESSAGES.NICKNAME_REQUIRED
			);
		});

		it("회원 가입 테스트 - 실패 (2) - 중복 이메일", async () => {
			const invalidDto: CreateUserDto = {
				email: normalUserInfo.email,
				password: "Password123!",
				nickname: "TestUser2",
			};

			const response = await sendRequest(
				"post",
				"/user/join",
				invalidDto
			).expect(400);

			expect(response.body.error).toContain(
				USER_ERROR_MESSAGES.DUPLICATE_DATA
			);
		});

		it("회원 가입 테스트 - 실패 (3) - 중복 닉네임", async () => {
			const invalidDto: CreateUserDto = {
				email: "test2@example.com",
				password: "Password123!",
				nickname: normalUserInfo.nickname,
			};

			const response = await sendRequest(
				"post",
				"/user/join",
				invalidDto
			).expect(400);

			expect(response.body.error).toContain(
				USER_ERROR_MESSAGES.DUPLICATE_DATA
			);
		});
	});

	describe("POST /user/login", () => {
		it("로그인 테스트 - 성공 (1)", async () => {
			const loginDto: LoginDto = {
				email: "test@example.com",
				password: "Password123!",
			};

			const response = await request(app.getHttpServer())
				.post("/user/login")
				.send(loginDto)
				.expect(200);

			const cookieHeader = response.get("Set-Cookie");

			cookieHeader.forEach(cookie => {
				cookies["login"].push(cookie.split(";")[0] + ";");
			});

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

		it("로그인 테스트 - 성공 (2)", async () => {
			const loginDto: LoginDto = {
				email: "deleteTest@example.com",
				password: "Password123!",
			};

			const response = await request(app.getHttpServer())
				.post("/user/login")
				.send(loginDto)
				.expect(200);

			const cookieHeader = response.get("Set-Cookie");

			cookieHeader.forEach(cookie => {
				cookies["delete"].push(cookie.split(";")[0] + ";");
			});

			const { error, userInfo } = response.body;
			const { nickname, email, imgUrl, loginTime } = userInfo;

			expect(error).toEqual("");
			expect(nickname).toEqual("DeleteUser");
			expect(email).toEqual("deleteTest@example.com");
			expect(imgUrl).toEqual(null);
			expect(new Date(loginTime).getTime()).toBeLessThanOrEqual(
				new Date(getKstNow()).getTime()
			);
		});

		it("로그인 테스트 - 성공 (3)", async () => {
			const loginDto: LoginDto = {
				email: adminUserInfo.email,
				password: adminUserInfo.password,
			};

			const response = await sendRequest(
				"post",
				"/user/login",
				loginDto
			).expect(200);

			const cookieHeader = response.get("Set-Cookie");

			cookieHeader.forEach(cookie => {
				cookies["admin"].push(cookie.split(";")[0] + ";");
			});

			const { error, userInfo } = response.body;
			const { nickname, email, imgUrl, loginTime } = userInfo;

			expect(error).toEqual("");
			expect(nickname).toEqual(adminUserInfo.nickname);
			expect(email).toEqual(adminUserInfo.email);
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

	describe("POST /user/check-password", () => {
		it("비밀 번호 확인 테스트 - 성공 (1) - 삭제할 사용자", async () => {
			const response = await request(app.getHttpServer())
				.post("/user/check-password")
				.set("Cookie", cookies["delete"].join(" "))
				.send({ password: "Password123!" })
				.expect(200);

			expect(response.body).toEqual({ error: "" });

			cookies["delete"].push(response.get("Set-Cookie")[0]);
		});

		it("비밀 번호 확인 테스트 - 실패 (1) - 비밀번호 불일치", async () => {
			const response = await request(app.getHttpServer())
				.post("/user/check-password")
				.set("Cookie", cookies["delete"].join(" "))
				.send({ password: "Password123@" })
				.expect(400);

			expect(response.body.error).toContain(
				VALIDATION_ERROR_MESSAGES.PASSWORD_CHECK_FAILED
			);
		});

		it("비밀 번호 확인 테스트 - 실패 (2) - 비밀번호 null", async () => {
			const response = await request(app.getHttpServer())
				.post("/user/check-password")
				.set("Cookie", cookies["delete"].join(" "))
				.send({ password: "" })
				.expect(400);

			expect(response.body.error).toContain(
				VALIDATION_ERROR_MESSAGES.INVALID_PASSWORD
			);
		});
	});

	describe("DELETE /user", () => {
		it("회원 탈퇴 테스트 - 성공", async () => {
			const response = await request(app.getHttpServer())
				.delete("/user")
				.set("Cookie", cookies["delete"].join(" "))
				.expect(200);

			expect(response.body).toEqual({ error: "" });
		});

		it("회원 탈퇴 테스트 - 실패 (1) - 이미 삭제된 사용자", async () => {
			const response = await request(app.getHttpServer())
				.delete("/user")
				.set("Cookie", cookies["delete"].join(" "))
				.expect(400);

			expect(response.body.error).toContain(
				USER_ERROR_MESSAGES.DELETED_USER
			);
		});

		it("회원 탈퇴 테스트 - 실패 (2) - 비밀번호 확인 x", async () => {
			const response = await request(app.getHttpServer())
				.delete("/user")
				.set("Cookie", cookies["login"].join(" "))
				.expect(401);

			expect(response.body.error).toContain(
				"비밀번호 확인이 필요합니다."
			);
		});

		it("회원 탈퇴 테스트 - 실패 (3) - 비 로그인 상태", async () => {
			const response = await request(app.getHttpServer())
				.delete("/user")
				.expect(403);

			expect(response.body.error).toContain("권한이 없습니다.");
		});
	});

	describe("GET /user", () => {
		it("사용자 정보 조회 - 성공", async () => {
			const response = await request(app.getHttpServer())
				.get("/user")
				.set("Cookie", cookies["login"].join(" "))
				.expect(200);

			const { email, nickname } = response.body.nonSensitiveUser;

			expect(email).toContain("test@example.com");
			expect(nickname).toContain("TestUser1");
		});

		it("사용자 정보 조회 - 실패 (1) - 로그인 상태 아님", async () => {
			const response = await request(app.getHttpServer())
				.get("/user")
				.expect(403);

			expect(response.body.error).toContain("권한이 없습니다.");
		});

		it("사용자 정보 조회 - 실패 (2) - 삭제된 사용자", async () => {
			const response = await request(app.getHttpServer())
				.get("/user")
				.set("Cookie", cookies["delete"].join(""))
				.expect(400);

			expect(response.body.error).toContain(
				USER_ERROR_MESSAGES.DELETED_USER
			);
		});
	});

	//describe("PUT /user", () => {});

	describe("POST /user/check-duplicate", () => {
		it("사용자 정보 중복 확인 테스트 - 성공 (1) - 이메일", async () => {
			const checkDuplicateDto = {
				nickname: "",
				email: "newEmail@example.com",
			};

			const response = await request(app.getHttpServer())
				.post("/user/check-duplicate")
				.set("Cookie", cookies["login"].join(" "))
				.send(checkDuplicateDto)
				.expect(200);

			expect(response.body.error).toEqual("");
			expect(response.body.isDuplicated).toEqual(false);
		});

		it("사용자 정보 중복 확인 테스트 - 성공 (2) - 닉네임", async () => {
			const checkDuplicateDto = { nickname: "newUser", email: "" };

			const response = await request(app.getHttpServer())
				.post("/user/check-duplicate")
				.set("Cookie", cookies["login"].join(" "))
				.send(checkDuplicateDto)
				.expect(200);

			expect(response.body.error).toEqual("");
			expect(response.body.isDuplicated).toEqual(false);
		});

		it("사용자 정보 중복 확인 테스트 - 실패 (1) - 이메일", async () => {
			const checkDuplicateDto = {
				nickname: "",
				email: "test@example.com",
			};

			const response = await request(app.getHttpServer())
				.post("/user/check-duplicate")
				.set("Cookie", cookies["login"].join(" "))
				.send(checkDuplicateDto)
				.expect(200);

			expect(response.body.error).toEqual("");
			expect(response.body.isDuplicated).toEqual(true);
		});

		it("사용자 정보 중복 확인 테스트 - 실패 (2) - 닉네임", async () => {
			const checkDuplicateDto = { nickname: "TestUser1", email: "" };

			const response = await request(app.getHttpServer())
				.post("/user/check-duplicate")
				.set("Cookie", cookies["login"].join(" "))
				.send(checkDuplicateDto)
				.expect(200);

			expect(response.body.error).toEqual("");
			expect(response.body.isDuplicated).toEqual(true);
		});

		it("사용자 정보 중복 확인 테스트 - 실패 (3) - invalid DTO", async () => {
			const checkDuplicateDto = { nickname: "", email: "" };

			const response = await request(app.getHttpServer())
				.post("/user/check-duplicate")
				.set("Cookie", cookies["login"].join(" "))
				.send(checkDuplicateDto)
				.expect(400);

			expect(response.body.error).toContain(
				USER_ERROR_MESSAGES.VOID_INPUT
			);
		});
	});

	describe("POST /user/check-admin", () => {
		it("admin 확인 테스트 - 성공", async () => {
			const response = await sendRequest(
				"get",
				"/user/check-admin",
				undefined,
				cookies["admin"].join(" ")
			).expect(200);

			expect(response.body.error).toEqual("");
			expect(response.body.isAdmin).toEqual(true);
		});

		it("관리자 확인 테스트 - 실패 (1) - 관리자 아님", async () => {
			const response = await sendRequest(
				"get",
				"/user/check-admin",
				undefined,
				cookies["login"].join(" ")
			).expect(200);

			expect(response.body.error).toEqual("");
			expect(response.body.isAdmin).toEqual(false);
		});

		it("관리자 확인 테스트 - 실패 (2) - 삭제된 사용자", async () => {
			const response = await sendRequest(
				"get",
				"/user/check-admin",
				undefined,
				cookies["delete"].join(" ")
			).expect(400);

			expect(response.body.error).toContain(
				USER_ERROR_MESSAGES.DELETED_USER
			);
		});
	});

	describe("PATCH /user/profile", () => {
		it("프로필 수정 테스트 - 성공 (1) - only nickname", async () => {
			const updateProfileDto = {
				nickname: "newNickname",
				imgUrl: "",
			};

			const response = await sendRequest(
				"patch",
				"/user/profile",
				updateProfileDto,
				cookies["login"].join(" ")
			).expect(200);

			expect(response.body.error).toEqual("");
		});

		it("프로필 수정 테스트 - 성공 (2) - only imgUrl", async () => {
			const updateProfileDto = {
				nickname: "",
				imgUrl: "1234",
			};

			const response = await sendRequest(
				"patch",
				"/user/profile",
				updateProfileDto,
				cookies["login"].join(" ")
			).expect(200);

			expect(response.body.error).toEqual("");
		});

		it("프로필 수정 테스트 - 성공 (3) - nickname, imgUrl", async () => {
			const updateProfileDto = {
				nickname: "newNickname",
				imgUrl: "1234",
			};

			const response = await sendRequest(
				"patch",
				"/user/profile",
				updateProfileDto,
				cookies["login"].join(" ")
			).expect(200);

			expect(response.body.error).toEqual("");
		});

		it("프로필 수정 테스트 - 실패 (1) - DTO is null", async () => {
			const invalidUpdateProfileDto = {
				nickname: "",
				imgUrl: "",
			};

			const response = await sendRequest(
				"patch",
				"/user/profile",
				invalidUpdateProfileDto,
				cookies["login"].join(" ")
			).expect(400);

			expect(response.body.error).toContain(
				USER_ERROR_MESSAGES.VOID_INPUT
			);
		});
	});

	describe("PATCH /user/password", () => {
		it("비밀번호 변경 테스트 - 성공", async () => {
			const updatePasswordDto = {
				originPassword: normalUserInfo.password,
				newPassword: "newPassword123!",
			};

			const response = await sendRequest(
				"patch",
				"/user/password",
				updatePasswordDto,
				cookies["login"].join(" ")
			).expect(200);

			expect(response.body.error).toEqual("");
		});

		it("비밀번호 변경 테스트 - 실패 - 기존 비밀번호 일치 x", async () => {
			const wrongUpdatePasswordDto = {
				originPassword: normalUserInfo.password + "!!",
				newPassword: "newPassword123!",
			};

			const response = await sendRequest(
				"patch",
				"/user/password",
				wrongUpdatePasswordDto,
				cookies["login"].join(" ")
			).expect(400);

			expect(response.body.error).toContain(
				"기존 비밀번호가 일치하지 않습니다."
			);
		});
	});

	describe("POST /user/logout", () => {
		it("로그아웃 테스트 - 성공", async () => {
			const response = await request(app.getHttpServer())
				.post("/user/logout")
				.set("Cookie", cookies["login"].join(" "))
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
});
