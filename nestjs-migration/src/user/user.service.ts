import { Injectable } from "@nestjs/common";
import { ServerError } from "../common/exceptions/server-error.exception";
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
		try {
			const result = await this.userRepository.save(createUserDto);
			return result;
		} catch (error) {
			if (error.code === USER_ERROR_CODES.DUPLICATE_ENTRY) {
				throw ServerError.badRequest(
					USER_ERROR_MESSAGES.DUPLICATE_ENTRY
				);
			}

			throw error;
		}
	}
}
