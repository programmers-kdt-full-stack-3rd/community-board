import { IsDefined } from "class-validator";

export class HandleLikeDto {
	@IsDefined()
	postId: number;

	@IsDefined()
	userId: number;
}
