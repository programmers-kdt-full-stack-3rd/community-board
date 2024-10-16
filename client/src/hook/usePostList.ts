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

	const isQnaCategory = categoryId === 3;
	const [acceptedCommentIds, setAcceptedCommentIds] = useState<
		(number | null)[]
	>([]);

	const postRequestDeps = [
		index,
		perPage,
		sortBy,
		keyword,
		categoryId,
		indexCorrector,
	];

	const fetchPostList = useCallback(async () => {
		const postRes = await ApiCall(
			() =>
				sendGetPostsRequest({
					index,
					perPage,
					sortBy,
					keyword,
					category_id: categoryId,
				}),
			() => {
				setPostList(null);
				setAcceptedCommentIds([]);
			}
		);

		if (postRes instanceof Error) {
			return;
		}

		const total = parseInt(postRes.total, 10) || 0;
		const pageCount = Math.ceil(total / perPage);

		if (pageCount > 0 && index > pageCount) {
			indexCorrector(pageCount);
			return;
		}

		const fetchedPostList = mapDBToPostHeaders(postRes.postHeaders);
		setPostList(fetchedPostList);
		setTotalPosts(total);

		if (!isQnaCategory || !fetchedPostList.length) {
			return;
		}

		const qnaRes = await ApiCall(
			// TODO: 주어진 게시글 ID 목록으로 채택 댓글 목록 요청
			() =>
				Promise.resolve({
					commentIds: fetchedPostList.map(({ id }) =>
						id % 2 ? 1 : null
					),
				}),
			() => setAcceptedCommentIds(fetchedPostList.map(() => null))
		);

		if (qnaRes instanceof Error) {
			return;
		}

		setAcceptedCommentIds(qnaRes?.commentIds ?? []);
	}, postRequestDeps);

	useEffect(() => {
		fetchPostList();
	}, postRequestDeps);

	return {
		postList,
		totalPosts,
		acceptedCommentIds,
		fetchPostList,
	};
};

export default usePostList;
