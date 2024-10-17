import { IPostInfo, mapDBToPostInfo } from "shared";
import { create } from "zustand";
import { ApiCall } from "../api/api";
import { sendGetPostRequest } from "../api/posts/crud";
import { sendQnaAcceptedCommentIdsRequest } from "../api/posts/qna_crud";

interface IPostInfoState {
	post: IPostInfo;
	postErrorMessage: string;
	postFetchState: "loading" | "error" | "qna-error" | "ok";

	isQnaCategory: boolean;
	acceptedCommentId: number | null;
}

interface IPostInfoActions {
	fetchPost: (postId: number) => void;
	clear: () => void;
}

type TPostInfoStore = IPostInfoState & IPostInfoActions;

export const getEmptyPostInfo = (): IPostInfo => ({
	id: 0,
	title: "",
	content: "",
	category: "",
	author_id: 0,
	author_nickname: "",
	is_author: false,
	created_at: new Date(Date.now()),
	updated_at: undefined,
	views: 0,
	likes: 0,
	user_liked: false,
});

export const usePostInfo = create<TPostInfoStore>(set => ({
	post: getEmptyPostInfo(),
	postErrorMessage: "",
	postFetchState: "loading",

	isQnaCategory: false,
	acceptedCommentId: null,

	fetchPost: async (postId: number) => {
		const res = await ApiCall(
			() => sendGetPostRequest(postId),
			err => {
				set(state => ({
					...state,

					post: getEmptyPostInfo(),
					postErrorMessage: err.message,
					postFetchState: "error",

					isQnaCategory: false,
					acceptedCommentId: null,
				}));
			}
		);

		if (res instanceof Error) {
			return;
		}

		const fetchedPost = mapDBToPostInfo(res.post);
		const isQnaCategory = fetchedPost.category === "QnA";
		let acceptedCommentId = null;

		if (isQnaCategory) {
			const qnaRes = await ApiCall(
				() =>
					sendQnaAcceptedCommentIdsRequest({
						postIds: [fetchedPost.id],
					}),
				err =>
					set(state => ({
						...state,

						post: fetchedPost,
						postErrorMessage: err.message,
						postFetchState: "qna-error",

						isQnaCategory,
						acceptedCommentId: null,
					}))
			);

			if (!(qnaRes instanceof Error)) {
				acceptedCommentId = qnaRes.commentIds[0] ?? null;
			}
		}

		set(state => ({
			...state,

			post: fetchedPost,
			postErrorMessage: "",
			postFetchState: "ok",

			isQnaCategory,
			acceptedCommentId,
		}));
	},

	clear: () =>
		set({
			post: getEmptyPostInfo(),
			postErrorMessage: "",
			postFetchState: "loading",

			isQnaCategory: false,
			acceptedCommentId: null,
		}),
}));
