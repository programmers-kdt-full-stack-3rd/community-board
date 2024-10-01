import { IsNotEmpty, ValidateIf } from "class-validator";
import { POST_ERROR_MESSAGES } from "../constant/post.constants";
import { User } from "src/user/entities/user.entity";


export class UpdatePostBodyDto {
	@ValidateIf(p => p.content == "" && p.title == "")
	@IsNotEmpty({ message : POST_ERROR_MESSAGES.NO_CHANGE })
    title: string;

	@ValidateIf(p => p.content == "" && p.title == "")
    @IsNotEmpty({ message: POST_ERROR_MESSAGES.NO_CHANGE})
    content: string;

	doFilter: boolean;

}
export class UpdatePostDto extends UpdatePostBodyDto {
	@IsNotEmpty()
	authorId: number;
}
