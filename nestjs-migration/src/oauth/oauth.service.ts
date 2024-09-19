import { Injectable } from "@nestjs/common";
import { TOAuthProvider } from "shared";
import { Transactional } from "typeorm-transactional";
import { AuthService } from "../auth/auth.service";
import { RefreshTokensRepository } from "../auth/refresh-tokens.repository";
import { ServerError } from "../common/exceptions/server-error.exception";
import { User } from "../user/entities/user.entity";
import { UserRepository } from "../user/user.repository";
import {
	buildOAuthState,
	buildTokenFetchOptions,
	extractOAuthAccountId,
	generateNickname,
} from "../utils/oauth.util";
import { OAuthPropsConfig } from "./config/oauth-props.config";
import { oAuthRequestContentType } from "./constants/oauth.constants";
import { OAuthLoginDto } from "./dto/oauth-login.dto";
import {
	IOAuthTokens,
	TOAuthLoginType,
	TOAuthTokenRequestGrantType,
} from "./interfaces/oauth.interface";
import { OAuthConnectionRepository } from "./repositories/oauth-connection.repository";
import { OAuthProviderRepository } from "./repositories/oauth-provider.repository";

@Injectable()
export class OAuthService {
	constructor(
		private oAuthPropsConfig: OAuthPropsConfig,
		private authService: AuthService,
		private userRepository: UserRepository,
		private oAuthProviderRepository: OAuthProviderRepository,
		private oAuthConnectionRepository: OAuthConnectionRepository,
		private refreshTokenRepository: RefreshTokensRepository
	) {}

	private get oAuthProps() {
		return this.oAuthPropsConfig.getOAuthProps();
	}

	getOAuthUrl(loginType: TOAuthLoginType, provider: TOAuthProvider) {
		const { [loginType]: url } = this.buildLoginUrl(provider);

		return url;
	}

	async oAuthLogin(oAuthLoginDto: OAuthLoginDto) {
		const provider = oAuthLoginDto.provider;
		const authorizationCode = oAuthLoginDto.code;

		const { oAuthAccountId, oAuthRefreshToken } =
			await this.verifyAuthorizationCode(provider, authorizationCode);

		let user = await this.userRepository.readUserByOAuth(
			provider,
			oAuthAccountId
		);

		if (user?.isDelete) {
			throw ServerError.badRequest("탈퇴한 회원입니다.");
		}

		const { accessToken, refreshToken } = await this.processOAuthLogin(
			user,
			provider,
			oAuthAccountId,
			oAuthRefreshToken
		);

		return {
			nickname: user.nickname,
			accessToken,
			refreshToken,
		};
	}

	@Transactional()
	private async processOAuthLogin(
		user: User,
		provider: TOAuthProvider,
		oAuthAccountId: string,
		oAuthRefreshToken: string
	) {
		if (user && oAuthRefreshToken) {
			await this.updateOauthRefreshToken(
				provider,
				oAuthAccountId,
				oAuthRefreshToken
			);
		} else if (!user) {
			user = await this.createNewOAuthUser(
				provider,
				oAuthAccountId,
				oAuthRefreshToken
			);
		}

		if (!user.id || !user.nickname) {
			throw ServerError.reference("사용자 정보 오류");
		}

		const { accessToken, refreshToken } = this.authService.generateTokens({
			userId: user.id,
			roleId: user.roleId,
		});

		await this.refreshTokenRepository.save({
			userId: user.id,
			token: refreshToken,
			expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
		});

		return {
			accessToken,
			refreshToken,
		};
	}

	private async createNewOAuthUser(
		provider: TOAuthProvider,
		oAuthAccountId: string,
		oAuthRefreshToken: string
	) {
		try {
			const nickname = generateNickname();

			const user = await this.userRepository.save({ nickname });

			if (!user) {
				throw ServerError.etcError(
					500,
					"소셜 로그인으로 회원가입 실패"
				);
			}

			const newUserId = user.id;

			this.createOAuthConnection(
				provider,
				newUserId,
				oAuthAccountId,
				oAuthRefreshToken
			);

			return user;
		} catch (error) {
			if (error.code === "ER_DUP_ENTRY") {
				throw ServerError.reference("이미 사용 중인 닉네임입니다.");
			}

			throw error;
		}
	}

	private async updateOauthRefreshToken(
		provider: string,
		oAuthAccountId: string,
		oAuthRefreshToken: string
	) {
		try {
			const oAuthConnection =
				await this.oAuthConnectionRepository.getOAuthConnectionByProviderAndAccountId(
					provider,
					oAuthAccountId
				);

			if (!oAuthConnection) {
				throw ServerError.badRequest("연동된 소셜 계정이 없습니다.");
			}

			const result = await this.oAuthConnectionRepository.update(
				oAuthConnection.id,
				{
					oAuthRefreshToken,
				}
			);

			if (result.affected === 0) {
				throw ServerError.badRequest("OAuth Refresh token 저장 실패");
			}

			return result;
		} catch (error) {
			if (error.code === "ER_DUP_ENTRY") {
				throw ServerError.badRequest("이미 연동된 소셜 계정입니다.");
			}

			throw error;
		}
	}

	private async createOAuthConnection(
		provider: TOAuthProvider,
		userId: number,
		oAuthAccountId: string,
		oAuthRefreshToken: string
	) {
		try {
			const oAuthProvider = await this.oAuthProviderRepository.findOne({
				select: ["id"],
				where: { name: provider },
			});

			if (!oAuthProvider) {
				throw ServerError.etcError(
					500,
					"소셜 로그인 연동에 실패했습니다."
				);
			}

			await this.oAuthConnectionRepository.insert({
				userId,
				oAuthProviderId: oAuthProvider.id,
				oAuthAccountId,
				oAuthRefreshToken,
			});
		} catch (error) {
			if (error.code === "ER_DUP_ENTRY") {
				throw ServerError.badRequest("이미 연동된 소셜 계정입니다.");
			}

			throw error;
		}
	}

	private buildLoginUrl(provider: TOAuthProvider): {
		[key in TOAuthLoginType]: string;
	} {
		const {
			requestEndpoint,
			clientId,
			redirectUri,
			scope,
			getAdditionalRequestOptionsFor,
			reconfirmParams,
		} = this.oAuthProps[provider];

		const loginUrl = new URL(requestEndpoint.login);

		loginUrl.searchParams.set("response_type", "code");
		loginUrl.searchParams.set("client_id", clientId);
		loginUrl.searchParams.set("redirect_uri", redirectUri);
		loginUrl.searchParams.set("state", buildOAuthState("login"));

		if (scope) {
			loginUrl.searchParams.set("scope", scope);
		}

		if (getAdditionalRequestOptionsFor?.login) {
			const { searchParams = {} } =
				getAdditionalRequestOptionsFor.login();

			for (const key in searchParams) {
				loginUrl.searchParams.set(key, searchParams[key]);
			}
		}

		const reconfirmUrl = new URL(loginUrl);
		reconfirmUrl.searchParams.set("state", buildOAuthState("reconfirm"));
		for (const key in reconfirmParams) {
			reconfirmUrl.searchParams.set(key, reconfirmParams[key]);
		}

		const linkUrl = new URL(loginUrl);
		linkUrl.searchParams.set("state", buildOAuthState("link"));

		return {
			login: loginUrl.toString(),
			reconfirm: reconfirmUrl.toString(),
			link: linkUrl.toString(),
		};
	}

	private async fetchOAuthTokens(
		provider: TOAuthProvider,
		grantType: TOAuthTokenRequestGrantType,
		grantValue: string
	) {
		const oAuthTokenResponse = await fetch(
			this.oAuthProps[provider].requestEndpoint.token,
			buildTokenFetchOptions(
				provider,
				grantType,
				grantValue,
				this.oAuthProps
			)
		);

		if (oAuthTokenResponse.status >= 500) {
			throw ServerError.etcError(
				500,
				"OAuth 서비스 제공사 오류로 OAuth 토큰 조회에 실패했습니다."
			);
		} else if (oAuthTokenResponse.status >= 400) {
			throw ServerError.badRequest(
				"인가 수단이 유효하지 않아서 OAuth 토큰 조회에 실패했습니다."
			);
		}

		return (await oAuthTokenResponse.json()) as IOAuthTokens;
	}

	private async fetchOAuthUserByAccessToken(
		provider: TOAuthProvider,
		accessToken: string
	) {
		const url = this.oAuthProps[provider].requestEndpoint.user;
		const headers = {
			Authorization: `Bearer ${accessToken}`,
			"Content-type": oAuthRequestContentType,
		};

		const oAuthUserResponse = await fetch(url, { headers });
		return await oAuthUserResponse.json();
	}

	private async verifyAuthorizationCode(
		provider: TOAuthProvider,
		authorizationCode: string
	) {
		const oAuthTokens = await this.fetchOAuthTokens(
			provider,
			"authorization_code",
			authorizationCode
		);

		const oAuthUser = await this.fetchOAuthUserByAccessToken(
			provider,
			oAuthTokens.access_token
		);

		return {
			oAuthAccountId: extractOAuthAccountId(provider, oAuthUser),
			oAuthRefreshToken: oAuthTokens.refresh_token,
		};
	}
}
