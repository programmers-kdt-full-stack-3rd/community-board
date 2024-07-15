import { ChangeEvent, FormEvent, useState } from "react";
import { searchInput, searchStyle } from "./SearchForm.css";

interface ISearchFormProps {
  defaultKeyword?: string;
  onSubmit: (keyword: string) => void;
}

const SearchForm = ({ defaultKeyword = "", onSubmit }: ISearchFormProps) => {
  const [keyword, setKeyword] = useState(defaultKeyword);

  const handleSearchSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(keyword.trim());
  };

  const handleKeywordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  return (
    <form className={searchStyle} onSubmit={handleSearchSubmit}>
      <input
        type="text"
        className={searchInput}
        value={keyword}
        onChange={handleKeywordChange}
      />
      <button type="submit">검색</button>
    </form>
  );
};

export default SearchForm;
