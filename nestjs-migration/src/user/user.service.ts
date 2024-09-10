import { Injectable } from "@nestjs/common";
import { ServerError } from "../common/exceptions/server-error.exception";
import { makeHashedPassword, makeSalt } from "../utils/crypto.util";
import {
	USER_ERROR_CODES,
	USER_ERROR_MESSAGES,
} from "./constant/user.constants";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
	constructor(private userRepository: UserRepository) {}

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

	private async handleDupEntry(sqlMessage: string, email: string) {
		if (sqlMessage.includes("email")) {
			const isDeleted = await this.isUserDeleted(email);
			if (isDeleted) {
				throw ServerError.badRequest(USER_ERROR_MESSAGES.DELETED_USER);
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
}
