import { Test, TestingModule } from "@nestjs/testing";
import { OAuthPropsConfig } from "./config/oauth-props.config";
import { OauthService } from "./oauth.service";

describe("OauthService", () => {
	let service: OauthService;
	let oAuthPropsConfig: OAuthPropsConfig;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
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

		service = module.get<OauthService>(OauthService);
		oAuthPropsConfig = module.get<OAuthPropsConfig>(OAuthPropsConfig);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
