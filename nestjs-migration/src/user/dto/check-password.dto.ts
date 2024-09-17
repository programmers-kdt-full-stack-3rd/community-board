import { IsNotEmpty, IsStrongPassword } from "class-validator";
import {
	PASSWORD_POLICY,
	VALIDATION_ERROR_MESSAGES,
} from "../constant/user.constants";

export class CheckPasswordDto {
	@IsNotEmpty({ message: VALIDATION_ERROR_MESSAGES.PASSWORD_REQUIRED })
	@IsStrongPassword(PASSWORD_POLICY, {
		message: VALIDATION_ERROR_MESSAGES.INVALID_PASSWORD,
	})
	password: string;
}
