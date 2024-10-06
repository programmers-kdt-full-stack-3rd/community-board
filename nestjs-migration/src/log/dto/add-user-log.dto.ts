import { IsDefined } from "class-validator";

export class AddUserLogDto {
	@IsDefined()
	user_id: number;

	@IsDefined()
	title: string;

	@IsDefined()
	category_id: number;
}
