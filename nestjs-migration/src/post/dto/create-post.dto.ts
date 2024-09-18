import { IsNotEmpty } from "class-validator"
import { POST_ERROR_MESSAGES } from "../constant/post.constants"

export class CreatePostBodyDto {
    @IsNotEmpty({ message : POST_ERROR_MESSAGES.REQUIRE_TITLE })
    title: string

    @IsNotEmpty({ message: POST_ERROR_MESSAGES.REQUIRE_CONTENT})
    content: string

    doFilter: boolean
}

export class CreatePostDto extends CreatePostBodyDto {
    
    @IsNotEmpty()
    author_id: number
}
