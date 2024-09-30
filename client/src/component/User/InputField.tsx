import { FC, InputHTMLAttributes } from "react";
import clsx from "clsx";
import DuplicationCheckButton from "./DuplicationCheckButton";

interface IInputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
	labelText: string;
	id: string;
	isValid?: boolean;
	isError?: boolean;
	duplicateCheck?: boolean;
	checkFunc?: () => void;
}

const InputField: FC<IInputFieldProps> = ({
	labelText,
	id,
	isValid,
	isError,
	duplicateCheck = false,
	checkFunc = () => {},
	...props
}) => {
	return (
		<div className={clsx("flex w-full flex-col gap-1 text-left")}>
			<label
				className={
					isValid
						? "w-full text-base font-bold text-green-600"
						: "w-full text-[15px] font-bold"
				}
				htmlFor={id}
			>
				{labelText}
			</label>
			<div className="flex flex-row items-center justify-between">
				<input
					className={clsx(
						"dark:bg-customGray h-10 w-full rounded border border-blue-900 bg-white px-2 text-sm dark:border-gray-500",
						{
							["border border-red-500 bg-red-100 pl-2 pr-2 text-black"]:
								!isError,
							["h-[40px] w-[65%] rounded-md pl-2 pr-2 text-[14px]"]:
								duplicateCheck,
						}
					)}
					id={id}
					{...props}
				/>

				{duplicateCheck && (
					<DuplicationCheckButton onClick={checkFunc} />
				)}
			</div>
		</div>
	);
};

export default InputField;
