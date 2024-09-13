import { useState } from "react";

type TValidateFn = (
	value: string,
	pass: () => void,
	fail: (message: string) => void
) => void;

interface IStringWithValidation {
	value: string;
	isValid: boolean;
	errorMessage: string;

	/**
	 * 주어진 값으로 데이터를 갱신하면서, 그 값으로 유효성 검사를 진행합니다.
	 * @param value - 새 값
	 * @param validateFn - 유효성 검사 함수 (기본값: `clearValidation`)
	 */
	setValue: (value: string, validateFn?: TValidateFn) => void;

	/**
	 * 현재 값으로 유효성 검사를 진행합니다.
	 * @param validateFn - 유효성 검사 함수
	 */
	setValidation: (validateFn: TValidateFn) => void;

	/**
	 * 유효성 검사 정보를 제거합니다.
	 */
	clearValidation: () => void;
}

export const useStringWithValidation = (): IStringWithValidation => {
	const [text, setText] = useState("");
	const [isValid, setIsValid] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const setValidationPass = () => {
		setIsValid(true);
		setErrorMessage("");
	};

	const setValidationFail = (message: string) => {
		setIsValid(false);
		setErrorMessage(message);
	};

	const clearValidation = () => {
		setIsValid(false);
		setErrorMessage("");
	};

	const setValidation = (validateFn: TValidateFn = clearValidation) => {
		validateFn(text, setValidationPass, setValidationFail);
	};

	const setValue = (
		value: string,
		validateFn: TValidateFn = clearValidation
	) => {
		setText(value);
		validateFn(value, setValidationPass, setValidationFail);
	};

	return {
		value: text,
		isValid,
		errorMessage,
		setValue,
		setValidation,
		clearValidation,
	};
};
