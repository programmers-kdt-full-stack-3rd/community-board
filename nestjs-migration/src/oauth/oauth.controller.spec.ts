import { HttpStatus } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TOAuthProvider } from "shared";
import { OAuthPropsConfig } from "./config/oauth-props.config";
import { OAuthController } from "./oauth.controller";
import { OAuthService } from "./oauth.service";

describe("OauthController", () => {
	let controller: OAuthController;
	let oAuthPropsConfig: OAuthPropsConfig;
	let oAuthService: jest.Mocked<OAuthService>;

	const mockProvider: TOAuthProvider = "google";

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [OAuthController],
			providers: [
				OAuthService,
				{
					provide: OAuthPropsConfig,
					useValue: {
						getOAuthProps: jest.fn(),
					},
				},
			],
		}).compile();

		controller = module.get<OAuthController>(OAuthController);
		oAuthPropsConfig = module.get<OAuthPropsConfig>(OAuthPropsConfig);
		oAuthService = module.get<OAuthService>(
			OAuthService
		) as jest.Mocked<OAuthService>;
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	describe("GET oauth/login-url/:provider", () => {
		it("로그인 URL 생성 후 200 상태 코드와 url을 반환한다.", async () => {
			const httpCode = Reflect.getMetadata(
				"__httpCode__",
				controller.getLoginUrl
			);

			const url = "http://localhost:3000/oauth/redirect/google";

			jest.spyOn(oAuthService, "getOAuthUrl").mockReturnValue(url);

			const result = controller.getLoginUrl({ provider: mockProvider });

			expect(oAuthService.getOAuthUrl).toHaveBeenCalledWith(
				"login",
				mockProvider
			);
			expect(httpCode).toBe(HttpStatus.OK);
			expect(result).toEqual({ url });
		});
	});
});
