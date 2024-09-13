import { Injectable } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { RefreshTokensRepository } from "../auth/refresh-tokens.repository";
import { ServerError } from "../common/exceptions/server-error.exception";
import { makeHashedPassword, makeSalt } from "../utils/crypto.util";
import {
	USER_ERROR_CODES,
	USER_ERROR_MESSAGES,
} from "./constant/user.constants";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginDto } from "./dto/login.dto";
import { User } from "./entities/user.entity";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
	constructor(
		private userRepository: UserRepository,
		private refreshTokenRepository: RefreshTokensRepository,
		private readonly authService: AuthService
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

		try {
			const user = await this.findAndValidateUserByEmail(email);
			const isValid = await this.verifyPassword(password, user);

			if (!isValid) {
				throw ServerError.badRequest(USER_ERROR_MESSAGES.INVALID_LOGIN);
			}

			const tokens = this.authService.generateTokens(user.id);

			this.refreshTokenRepository.save({
				userId: user.id,
				token: tokens.refreshToken,
				expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
			});

			return { nickname: user.nickname, ...tokens };
		} catch (error: any) {
			throw error;
		}
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

	async logout(userId: number) {
		try {
			const result = await this.refreshTokenRepository.delete({ userId });

			if (result.affected < 1) {
				throw ServerError.badRequest(
					USER_ERROR_MESSAGES.FAILED_TOKEN_DELETE
				);
			}
		} catch (error) {
			throw error;
		}
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
}
