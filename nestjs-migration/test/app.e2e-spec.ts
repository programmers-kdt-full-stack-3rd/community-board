import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";

describe("AppController (e2e)", () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.setGlobalPrefix("api");
		await app.init();

		const server = app.getHttpServer();
		const router = server._events.request._router;
		console.log(
			router.stack
				.filter(layer => layer.route)
				.map(
					layer =>
						`${Object.keys(layer.route.methods)} ${layer.route.path}`
				)
		);
	});

	it("/api (GET)", () => {
		return request(app.getHttpServer())
			.get("/api")
			.expect(200)
			.expect("Hello World!");
	});

	it("/api/user/join (POST)", async () => {
		const response = await request(app.getHttpServer())
			.post("/api/user/join")
			.send({
				nickname: "testuser",
				email: "test@example.com",
				password: "password123",
			});

		expect(response.status).toBe(201);
		console.log(response.body);
	});
});
