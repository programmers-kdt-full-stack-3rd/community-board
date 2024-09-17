import { Test, TestingModule } from "@nestjs/testing";
import { OAuthPropsConfig } from "./config/oauth-props.config";
import { OauthController } from "./oauth.controller";
import { OauthService } from "./oauth.service";

describe("OauthController", () => {
	let controller: OauthController;
	let oAuthPropsConfig: OAuthPropsConfig;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [OauthController],
			providers: [
				OauthService,
				{
					provide: OAuthPropsConfig,
					useValue: {
						getOAuthProps: jest.fn(),
					},
				},
			],
		}).compile();

		controller = module.get<OauthController>(OauthController);
		oAuthPropsConfig = module.get<OAuthPropsConfig>(OAuthPropsConfig);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
