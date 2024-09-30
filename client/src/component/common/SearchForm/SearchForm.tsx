import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import TextInput from "../TextInput";
import Button from "../Button";

interface ISearchFormProps {
	defaultKeyword?: string;
	onSubmit: (keyword: string) => void;
}

const SearchForm = ({ defaultKeyword = "", onSubmit }: ISearchFormProps) => {
	const [keyword, setKeyword] = useState(defaultKeyword);

	const handleSearchSubmit = useCallback(
		(event: FormEvent) => {
			event.preventDefault();
			onSubmit(keyword.trim());
		},
		[keyword, onSubmit]
	);

	const handleKeywordChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setKeyword(event.target.value);
		},
		[]
	);

	return (
		<form onSubmit={handleSearchSubmit}>
			<TextInput
				className="w-30 text-gray-200"
				value={keyword}
				onChange={handleKeywordChange}
				placeholder="검색하기"
				actionButton={
					<Button
						className="bg-customGray"
						size="medium"
						color="neutral"
						type="submit"
					>
						검색
					</Button>
				}
			/>
		</form>
	);
};

export default SearchForm;
