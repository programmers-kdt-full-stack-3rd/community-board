import { Injectable } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";
import { AuthService } from "../auth/auth.service";
import { RefreshTokensRepository } from "../auth/refresh-tokens.repository";
import { ServerError } from "../common/exceptions/server-error.exception";
import { OAuthService } from "../oauth/oauth.service";
import { OAuthTokenService } from "../oauth/oauthtoken.service";
import { OAuthConnectionRepository } from "../oauth/repositories/oauth-connection.repository";
import { makeHashedPassword, makeSalt } from "../utils/crypto.util";
import {
	USER_ERROR_CODES,
	USER_ERROR_MESSAGES,
} from "./constant/user.constants";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginDto } from "./dto/login.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
	constructor(
		private userRepository: UserRepository,
		private refreshTokenRepository: RefreshTokensRepository,
		private oAuthConnectionRepository: OAuthConnectionRepository,
		private readonly authService: AuthService,
		private readonly oAuthServices: OAuthService,
		private readonly oAuthTokenService: OAuthTokenService
	) {}

	async createUser(createUserDto: CreateUserDto) {
		const { email, password, nickname } = createUserDto;
		const salt = await makeSalt();
		const hashedPassword = await makeHashedPassword(password, salt);
		try {
			const result = await this.userRepository.save({
				email,
				password: hashedPassword,
				nickname,
				salt,
			});

			return result;
		} catch (error: any) {
			if (error.code === USER_ERROR_CODES.DUPLICATE_ENTRY) {
				await this.handleDupEntry(error.sqlMessage, email);
			}
			throw ServerError.badRequest(
				USER_ERROR_MESSAGES.USER_CREATION_ERROR
			);
		}
	}

	async login(loginDto: LoginDto) {
		const { email, password } = loginDto;

		const user = await this.findAndValidateUserByEmail(email);
		const isValid = await this.verifyPassword(password, user);

		if (!isValid) {
			throw ServerError.badRequest(USER_ERROR_MESSAGES.INVALID_LOGIN);
		}

		const tokens = this.authService.generateTokens({
			userId: user.id,
			roleId: user.roleId,
		});

		this.refreshTokenRepository.save({
			userId: user.id,
			token: tokens.refreshToken,
			expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
		});

		return { nickname: user.nickname, ...tokens };
	}

	async readUser(userId: number) {
		const user = await this.findAndValidateUserById(userId);
		const oAuthConnections =
			await this.oAuthConnectionRepository.getOAuthConnectionByUserId(
				userId
			);

		return { user, oAuthConnections };
	}

	async checkPassword(userId: number, password: string) {
		const user = await this.findAndValidateUserById(userId);
		const isValid = await this.verifyPassword(password, user);

		if (!isValid) {
			throw ServerError.badRequest(USER_ERROR_MESSAGES.INVALID_PASSWORD);
		}

		const tempToken = this.authService.makeTempToken(userId);

		return { tempToken };
	}

	async logout(userId: number, refreshToken: string) {
		await this.deleteRefreshToken(userId, refreshToken);
	}

	async updateUser(userId: number, updateUserDto: UpdateUserDto) {
		const currentUser = await this.findAndValidateUserById(userId);

		if (currentUser.email && updateUserDto.email) {
			throw ServerError.badRequest(
				USER_ERROR_MESSAGES.CANNOT_CHANGE_EMAIL
			);
		} else if (!currentUser.email && !updateUserDto.email) {
			throw ServerError.badRequest(
				USER_ERROR_MESSAGES.SOCIAL_USER_NEED_EMAIL
			);
		}

		const { email, password, nickname } = updateUserDto;

		const salt = await makeSalt();
		const hashedPassword = await makeHashedPassword(password, salt);

		const updateData = {
			email,
			password: hashedPassword,
			nickname,
			salt,
		};

		if (currentUser.email) {
			const newHashedPassword = await makeHashedPassword(
				updateUserDto.password,
				currentUser.salt
			);

			if (currentUser.password === newHashedPassword) {
				throw ServerError.badRequest(USER_ERROR_MESSAGES.SAME_PASSWORD);
			}

			const result = await this.userRepository.updateUser(
				userId,
				updateData
			);
			if (result.affected === 0) {
				throw ServerError.badRequest(
					USER_ERROR_MESSAGES.UPDATE_USER_ERROR
				);
			}
		} else {
			await this.resisterUserEmail(userId, updateData);
		}

		return true;
	}

	@Transactional()
	async deleteUser(userId: number) {
		const oAuthConnections =
			await this.oAuthConnectionRepository.getOAuthConnectionByUserId(
				userId
			);

		if (oAuthConnections.length > 0) {
			for (const connection of oAuthConnections) {
				const { oAuthAccessToken } =
					await this.oAuthTokenService.refreshOAuthAccessToken(
						connection.oAuthProvider.name,
						connection.oAuthRefreshToken
					);
				await this.oAuthServices.revokeOAuth(
					connection.oAuthProvider.name,
					oAuthAccessToken
				);
			}

			const result =
				await this.oAuthConnectionRepository.clearOAuthConnectionByUserId(
					userId
				);
			if (result.affected === 0) {
				throw ServerError.badRequest(
					USER_ERROR_MESSAGES.DELETE_OAUTH_CONNECTION_ERROR
				);
			}
		}

		await this.deleteRefreshToken(userId);
		await this.databaseDeleteUser(userId);
	}

	private async handleDupEntry(sqlMessage: string, email: string) {
		if (sqlMessage.includes("email")) {
			const isDeleted = await this.isUserDeletedByEmail(email);
			if (isDeleted) {
				throw ServerError.badRequest(USER_ERROR_MESSAGES.DELETED_EMAIL);
			}
			throw ServerError.badRequest(USER_ERROR_MESSAGES.DUPLICATE_EMAIL);
		}

		if (sqlMessage.includes("nickname")) {
			throw ServerError.badRequest(
				USER_ERROR_MESSAGES.DUPLICATE_NICKNAME
			);
		}

		throw ServerError.badRequest(USER_ERROR_MESSAGES.DUPLICATE_DATA);
	}

	async isUserDeletedById(id: number): Promise<boolean> {
		const user = await this.userRepository.findOne({ where: { id } });

		return user?.isDelete ?? false;
	}

	private async isUserDeletedByEmail(email: string): Promise<boolean> {
		const user = await this.userRepository.findOne({ where: { email } });
		return user?.isDelete ?? false;
	}

	private async findAndValidateUserByEmail(email: string): Promise<User> {
		const user = await this.userRepository.findOne({ where: { email } });
		if (!user) {
			throw ServerError.badRequest(USER_ERROR_MESSAGES.NOT_FOUND_EMAIL);
		}
		if (user.isDelete) {
			throw ServerError.badRequest(USER_ERROR_MESSAGES.DELETED_USER);
		}
		return user;
	}

	private async findAndValidateUserById(id: number): Promise<User> {
		const user = await this.userRepository.findOne({
			where: { id, isDelete: false },
		});
		if (!user) {
			throw ServerError.badRequest(USER_ERROR_MESSAGES.NOT_FOUND_USER);
		}
		return user;
	}

	private async verifyPassword(
		password: string,
		user: User
	): Promise<boolean> {
		const hashedPassword = await makeHashedPassword(password, user.salt);
		return hashedPassword === user.password;
	}

	private async resisterUserEmail(
		userId: number,
		updateData: Partial<
			Pick<User, "email" | "nickname" | "password" | "salt">
		>
	) {
		try {
			const result = await this.userRepository.registerUserEmail(
				userId,
				updateData
			);
			if (result.affected === 0) {
				throw ServerError.badRequest(
					USER_ERROR_MESSAGES.UPDATE_RESISTER_USER_EMAIL
				);
			}
		} catch (error) {
			if (error.code === USER_ERROR_CODES.DUPLICATE_ENTRY) {
				await this.handleDupEntry(error.sqlMessage, updateData.email);
			}

			throw error;
		}
	}

	private async deleteRefreshToken(userId: number, refreshToken?: string) {
		const deleteConditions: { userId: number; token?: string } = { userId };
		if (refreshToken) {
			deleteConditions.token = refreshToken;
		}

		const result =
			await this.refreshTokenRepository.delete(deleteConditions);

		if (result.affected === 0) {
			throw ServerError.badRequest(
				USER_ERROR_MESSAGES.FAILED_TOKEN_DELETE
			);
		}
	}

	private async databaseDeleteUser(userId: number) {
		const result = await this.userRepository.deleteUser(userId);

		if (result.affected === 0) {
			throw ServerError.badRequest(USER_ERROR_MESSAGES.DELETE_USER_ERROR);
		}
	}
}
