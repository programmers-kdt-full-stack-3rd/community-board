import { useCallback, useMemo } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

type TSearchParamType = string | number | boolean;
type TSearchParamTypeMap<T> = Record<keyof T, "string" | "number" | "boolean">;

/**
 * URL 파라미터를 객체로 관리합니다.
 * @template T - 키-값 쌍 객체 타입
 * @param types - URL 파라미터의 각 키별 타입
 * @returns `[searchParamsObject, setSearchParamsObject]`
 */
const useParsedSearchParams = <T extends Record<string, TSearchParamType> = {}>(
	types: TSearchParamTypeMap<T>
): [Partial<T>, (diff: Partial<T>) => void] => {
	const { search } = useLocation();
	const [searchParams, setSearchParams] = useSearchParams();

	const searchParamsObject: Partial<T> = useMemo(() => {
		const result: any = {};

		searchParams.forEach((value, key) => {
			if (key in result) {
				return;
			}

			if (types[key] === "boolean") {
				result[key] = value === "true";
				return;
			}

			if (types[key] === "number") {
				const parsed = parseInt(value, 10);

				if (!isNaN(parsed)) {
					result[key] = parsed;
				}

				return;
			}

			result[key] = value;
		});

		return result as Partial<T>;
	}, [search]);

	const setSearchParamsObject = useCallback(
		(diff: Partial<T>) =>
			setSearchParams(prev => {
				const next = new URLSearchParams(prev);

				for (const key in diff) {
					if (diff[key] === undefined || diff[key] === null) {
						next.delete(key);
					} else {
						next.set(key, String(diff[key]));
					}
				}

				return next;
			}),
		[setSearchParams]
	);

	return [searchParamsObject as Partial<T>, setSearchParamsObject];
};

export default useParsedSearchParams;
