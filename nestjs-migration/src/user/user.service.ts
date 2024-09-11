import { Injectable } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
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
			const user = await this.findAndValidateUser(email);
			await this.verifyPassword(password, user);
			const tokens = this.authService.generateTokens(user.id);

			return { nickname: user.nickname, ...tokens };
		} catch (error: any) {
			throw error;
		}
	}

	private async handleDupEntry(sqlMessage: string, email: string) {
		if (sqlMessage.includes("email")) {
			const isDeleted = await this.isUserDeleted(email);
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

	private async isUserDeleted(email: string): Promise<boolean> {
		const user = await this.userRepository.findOne({ where: { email } });
		return user?.isDelete ?? false;
	}

	private async findAndValidateUser(email: string): Promise<User> {
		const user = await this.userRepository.findOne({ where: { email } });
		if (!user) {
			throw ServerError.badRequest(USER_ERROR_MESSAGES.NOT_FOUND_EMAIL);
		}
		if (user.isDelete) {
			throw ServerError.badRequest(USER_ERROR_MESSAGES.DELETED_USER);
		}
		return user;
	}

	private async verifyPassword(password: string, user: User): Promise<void> {
		const hashedPassword = await makeHashedPassword(password, user.salt);
		if (user.password !== hashedPassword) {
			throw ServerError.badRequest(USER_ERROR_MESSAGES.INVALID_LOGIN);
		}
	}
}
