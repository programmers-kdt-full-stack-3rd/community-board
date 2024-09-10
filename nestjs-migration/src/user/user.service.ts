import { Injectable } from "@nestjs/common";
import { makeHashedPassword, makeSalt } from "src/utils/crypto.util";
import { ServerError } from "../common/exceptions/server-error.exception";
import { USER_ERROR_CODES } from "./constant/user.constants";
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
			return await this.userRepository.save({
				email,
				password: hashedPassword,
				nickname,
				salt,
			});
		} catch (error: any) {
			if (error.code === USER_ERROR_CODES.DUPLICATE_ENTRY) {
				await this.handleDupEntry(error.sqlMessage, email);
			}
			throw ServerError.badRequest("사용자 생성 중 오류가 발생했습니다.");
		}
	}

	private async handleDupEntry(sqlMessage: string, email: string) {
		if (sqlMessage.includes("email")) {
			const isDeleted = await this.isUserDeleted(email);
			if (isDeleted) {
				throw ServerError.badRequest("탈퇴한 회원의 이메일입니다.");
			}
			throw ServerError.badRequest("이미 존재하는 이메일 주소입니다.");
		}

		if (sqlMessage.includes("nickname")) {
			throw ServerError.badRequest("이미 사용 중인 닉네임입니다.");
		}

		throw ServerError.badRequest("중복된 데이터가 존재합니다.");
	}

	private async isUserDeleted(email: string): Promise<boolean> {
		const user = await this.userRepository.findOne({ where: { email } });
		return user?.isDelete ?? false;
	}
}
