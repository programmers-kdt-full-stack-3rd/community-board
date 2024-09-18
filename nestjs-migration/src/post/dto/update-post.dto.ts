import { IsNotEmpty, ValidateIf } from "class-validator";
import { POST_ERROR_MESSAGES } from "../constant/post.constants";


export class UpdatePostBodyDto {
	@ValidateIf(p => p.content == "" && p.title == "")
	@IsNotEmpty({ message : POST_ERROR_MESSAGES.NOCHANGE })
    title: string;

	@ValidateIf(p => p.content == "" && p.title == "")
    @IsNotEmpty({ message: POST_ERROR_MESSAGES.NOCHANGE})
    content: string;

	doFilter: boolean;

}
export class UpdatePostDto extends UpdatePostBodyDto {
	@IsNotEmpty()
	authorId: number;
}
