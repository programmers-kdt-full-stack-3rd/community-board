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
	}
>;

const usePostList = ({
	index = 1,
	perPage = 10,
	sortBy,
	keyword,
	categoryId,
}: TPostListHookProps) => {
	const [postList, setPostList] = useState<IPostHeader[] | null>([]);
	const [totalPosts, setTotalPosts] = useState(0);
	const [actualIndex, setActualIndex] = useState(1);

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
				setActualIndex(pageCount);
			} else {
				setPostList(mapDBToPostHeaders(res.postHeaders));
				setTotalPosts(total);
			}
		});
	}, [index, perPage, sortBy, keyword, categoryId]);

	useEffect(() => {
		fetchPostList();
	}, [index, perPage, sortBy, keyword, categoryId]);

	return {
		postList,
		totalPosts,
		actualIndex,
		fetchPostList,
	};
};

export default usePostList;
