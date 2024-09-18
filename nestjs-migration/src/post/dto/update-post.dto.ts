import { IsNotEmpty, ValidateIf } from "class-validator";
import { POST_ERROR_MESSAGES } from "../constant/post.constants";


export class UpdatePostBodyDto {
	@IsNotEmpty({ message : POST_ERROR_MESSAGES.NOCHANGE })
	@ValidateIf(p => p.content === undefined)
    title: string;

    @IsNotEmpty({ message: POST_ERROR_MESSAGES.NOCHANGE})
	@ValidateIf(p => p.title === undefined)
    content: string;

	doFilter: boolean;

}
export class UpdatePostDto extends UpdatePostBodyDto {
	@IsNotEmpty()
	authorId: number;
}
