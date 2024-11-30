import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";
import {
	PASSWORD_POLICY,
	VALIDATION_ERROR_MESSAGES,
} from "../constant/user.constants";

export class LoginDto {
	@IsEmail({}, { message: VALIDATION_ERROR_MESSAGES.LOGIN_FAILED })
	@IsNotEmpty({ message: VALIDATION_ERROR_MESSAGES.EMAIL_REQUIRED })
	email: string;

	@IsNotEmpty({ message: VALIDATION_ERROR_MESSAGES.PASSWORD_REQUIRED })
	@IsStrongPassword(PASSWORD_POLICY, {
		message: VALIDATION_ERROR_MESSAGES.LOGIN_FAILED,
	})
	password: string;
}
