import { IsInt, Min } from "class-validator";

export class AcceptQnACommentReq {
	@IsInt({ message: "postId가 숫자가 아닙니다." })
	@Min(1, { message: "postId가 1보다 커야합니다." })
	postId: number;

	@IsInt({ message: "commendId가 숫자가 아닙니다." })
	@Min(1, { message: "commendId가 1보다 커야합니다." })
	commentId: number;

	userId: number;
}
