import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserRepository } from "./user.repository";
import { ServerError } from "../common/exceptions/server-error.exception";

@Injectable()
export class UserService {
	constructor(private userRepository: UserRepository) {}

	private async hashPassword(password: string): Promise<string> {
		return password;
	}

	async createUser(createUserDto: CreateUserDto) {
		const { nickname, email, password } = createUserDto;
		try {
			const result = await this.userRepository.createUser({
				nickname,
				email,
				password,
			});
			if (result.affectedRows === 0) {
				throw ServerError.reference("회원가입 실패");
			}

			return result;
		} catch (error) {
			if (error.code === "ER_DUP_ENTRY") {
				throw ServerError.badRequest("이미 존재하는 이메일입니다.");
			}

			throw error;
		}
	}
}
