import { useSearchParams } from "react-router-dom";
import { SortBy } from "shared";
import { clamp } from "../utils/clamp";

const useMainPageSearchParams = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const sanitizedSearchParams = new URLSearchParams(searchParams);

	const fallbacks = {
		index: 1,
		perPage: 10,
		keyword: "",
		sortBy: null,
	};

	const parsedIndex = parseInt(String(searchParams.get("index")), 10);
	const index = Math.max(
		1,
		isNaN(parsedIndex) ? fallbacks.index : parsedIndex
	);
	sanitizedSearchParams.set("index", String(index));

	const parsedPerPage = parseInt(String(searchParams.get("perPage")), 10);
	const perPage = clamp(
		1,
		isNaN(parsedPerPage) ? fallbacks.perPage : parsedPerPage,
		100
	);
	if (perPage !== fallbacks.perPage) {
		sanitizedSearchParams.set("perPage", String(perPage));
	}

	const keyword = searchParams.get("keyword") ?? fallbacks.keyword;

	const parsedSortBy = parseInt(String(searchParams.get("sortBy")), 10);
	const sortBy = isNaN(parsedSortBy)
		? fallbacks.sortBy
		: (parsedSortBy as SortBy);

	return {
		searchParams: sanitizedSearchParams,
		setSearchParams,
		parsed: {
			index,
			perPage,
			keyword,
			sortBy,
		},
	};
};

export default useMainPageSearchParams;
