import { Injectable } from "@nestjs/common";
import { ServerError } from "../common/exceptions/server-error.exception";
import { UserRepository } from "../user/user.repository";
import { UserService } from "../user/user.service";
import { GetUsersDto } from "./dto/get-users.dto";

@Injectable()
export class AdminService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly userService: UserService
	) {}

	async getUsers(getUsersDto: GetUsersDto) {
		getUsersDto.index -= 1;
		if (getUsersDto.index < 0) {
			getUsersDto.index = 0;
		}
		if (getUsersDto.perPage < 0) {
			getUsersDto.perPage = 10;
		}

		const result = await this.userRepository.getUserInfo(getUsersDto);

		return result;
	}

	async deleteUser(userId: number) {
		await this.userService.deleteUser(userId);
	}

	async restoreUser(userId: number) {
		const result = await this.userRepository.restoreUser(userId);

		if (result.affected === 0) {
			throw ServerError.badRequest("회원 복구 실패");
		}
	}
}
