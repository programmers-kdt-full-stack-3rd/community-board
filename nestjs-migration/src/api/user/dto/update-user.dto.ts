import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsStrongPassword,
	ValidateIf,
} from "class-validator";
import {
	PASSWORD_POLICY,
	VALIDATION_ERROR_MESSAGES,
} from "../constant/user.constants";

export class UpdateUserDto {
	@IsOptional()
	@ValidateIf(
		o => o.email !== undefined && o.email !== null && o.email !== ""
	)
	@IsEmail({}, { message: VALIDATION_ERROR_MESSAGES.INVALID_EMAIL })
	email?: string;

	@IsNotEmpty({ message: VALIDATION_ERROR_MESSAGES.PASSWORD_REQUIRED })
	@IsStrongPassword(PASSWORD_POLICY, {
		message: VALIDATION_ERROR_MESSAGES.INVALID_PASSWORD,
	})
	password: string;

	@IsNotEmpty({ message: VALIDATION_ERROR_MESSAGES.NICKNAME_REQUIRED })
	nickname: string;
}
