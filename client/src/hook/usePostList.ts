import { useCallback, useEffect, useState } from "react";
import { IPostHeader, mapDBToPostHeaders } from "shared";
import { ApiCall } from "../api/api";
import {
	sendGetPostsRequest,
	TPostListClientSearchParams,
} from "../api/posts/crud";

type TPostListHookProps = Partial<
	TPostListClientSearchParams & {
		categoryId: number;
		indexCorrector: (actual: number) => void;
	}
>;

const noOperation = () => {};

const usePostList = ({
	index = 1,
	perPage = 10,
	sortBy,
	keyword,
	categoryId,
	indexCorrector = noOperation,
}: TPostListHookProps) => {
	const [postList, setPostList] = useState<IPostHeader[] | null>([]);
	const [totalPosts, setTotalPosts] = useState(0);

	const fetchPostList = useCallback(() => {
		ApiCall(
			() =>
				sendGetPostsRequest({
					index,
					perPage,
					sortBy,
					keyword,
					category_id: categoryId,
				}),
			() => setPostList(null)
		).then(res => {
			if (res instanceof Error) {
				return;
			}

			const total = parseInt(res.total, 10) || 0;
			const pageCount = Math.ceil(total / perPage);

			if (pageCount > 0 && index > pageCount) {
				indexCorrector(pageCount);
			} else {
				setPostList(mapDBToPostHeaders(res.postHeaders));
				setTotalPosts(total);
			}
		});
	}, [index, perPage, sortBy, keyword, categoryId, indexCorrector]);

	useEffect(() => {
		fetchPostList();
	}, [index, perPage, sortBy, keyword, categoryId, indexCorrector]);

	return {
		postList,
		totalPosts,
		fetchPostList,
	};
};

export default usePostList;
