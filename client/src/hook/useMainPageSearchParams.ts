import { SortBy } from "shared";
import { clamp } from "../utils/clamp";

const useMainPageSearchParams = (searchParams: URLSearchParams) => {
  const fallbacks = {
    index: 1,
    perPage: 15,
    keyword: "",
    sortBy: null,
  };

  const parsedIndex = parseInt(String(searchParams.get("index")), 10);
  const index = Math.max(1, isNaN(parsedIndex) ? fallbacks.index : parsedIndex);

  const parsedPerPage = parseInt(String(searchParams.get("perPage")), 10);
  const perPage = clamp(
    1,
    isNaN(parsedPerPage) ? fallbacks.perPage : parsedPerPage,
    100
  );

  const keyword = searchParams.get("keyword") ?? fallbacks.keyword;

  const parsedSortBy = parseInt(String(searchParams.get("sortBy")), 10);
  const sortBy = isNaN(parsedSortBy)
    ? fallbacks.sortBy
    : (parsedSortBy as SortBy);

  return {
    index,
    perPage,
    keyword,
    sortBy,
  };
};

export default useMainPageSearchParams;
