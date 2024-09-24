import { Injectable } from "@nestjs/common";
import { UserRepository } from "../user/user.repository";
import { GetUsersDto } from "./dto/get-users.dto";

@Injectable()
export class AdminService {
	constructor(private readonly userRepository: UserRepository) {}

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
}
