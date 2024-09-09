import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ServerError } from "../common/exceptions/server-error.exception";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./user.entity";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>
	) {}

	async createUser(createUserDto: CreateUserDto) {
		try {
			const result = await this.userRepository.save(createUserDto);
			return result;
		} catch (error) {
			if (error.code === "ER_DUP_ENTRY") {
				throw ServerError.badRequest("이미 존재하는 이메일입니다.");
			}

			throw error;
		}
	}
}
