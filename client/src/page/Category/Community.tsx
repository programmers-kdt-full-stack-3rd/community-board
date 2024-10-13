import React, { useCallback } from "react";
import { SortBy } from "shared";
import { TPostListClientSearchParams } from "../../api/posts/crud";
import Pagination from "../../component/common/Pagination/Pagination";
import PostList from "../../component/Posts/PostList/PostList";
import SearchForm from "../../component/common/SearchForm/SearchForm";
import { useUserStore } from "../../state/store";
import {
	createPostButtonWrapper,
	mainPageStyle,
	postListActions,
} from "../Main/Main.css";
import { UserRank } from "../../component/Posts/Rank/UserRank";
import { useNavigate } from "react-router-dom";
import useParsedSearchParams from "../../hook/useParsedSearchParams";
import useCategory from "../../hook/useCategory";
import usePostList from "../../hook/usePostList";
import { useGlobalErrorModal } from "../../state/GlobalErrorModalStore";

interface IProps {
	categoryId?: number;
}

const Community: React.FC<IProps> = ({ categoryId }) => {
	const navigate = useNavigate();
	const globalErrorModal = useGlobalErrorModal();
	const isLogin = useUserStore(state => state.isLogin);

	const { currentCategory } = useCategory(categoryId);

	const [
		{ index = 1, perPage = 10, sortBy, keyword },
		setSearchParamsObject,
	] = useParsedSearchParams<TPostListClientSearchParams>({
		index: "number",
		perPage: "number",
		sortBy: "number",
		keyword: "string",
	});

	const { postList, totalPosts } = usePostList({
		index,
		perPage,
		sortBy,
		keyword,
		categoryId,
		indexCorrector: useCallback(
			(actual: number) => setSearchParamsObject({ index: actual }),
			[setSearchParamsObject]
		),
	});

	const handlePostSort = (sortBy: SortBy | null) => {
		setSearchParamsObject({
			index: 1,
			sortBy: sortBy ?? undefined,
		});
	};

	const handlePageChange = (page: number) => {
		setSearchParamsObject({ index: page });
	};

	const handleCreatePostClick = () => {
		if (typeof categoryId !== "number") {
			globalErrorModal.open({
				title: "오류",
				message:
					"카테고리 정보가 없으므로 게시글을 작성할 수 없습니다. 게시글을 작성하려는 게시판에서 글쓰기 버튼을 눌러 주세요.",
			});
			return;
		}

		navigate(`/post/new?category_id=${categoryId}`);
	};

	const handleSearchSubmit = (keyword: string) => {
		setSearchParamsObject({
			index: 1,
			keyword: keyword.trim() || undefined,
		});
	};

	return (
		<div>
			<div className="mx-auto mt-2 w-full max-w-7xl px-4 lg:mt-[18px] lg:px-0">
				<div className="ml-4 flex lg:space-x-10">
					<UserRank />

					<div className={mainPageStyle}>
						<div className="dark:bg-customGray relative mt-4 flex flex-col justify-between rounded-lg bg-blue-900 text-left">
							<span className="ml-5 mt-5 text-lg font-bold text-white">
								{currentCategory?.name ?? "모든 글 모아 보기"}
							</span>

							<span className="mb-5 ml-5 mt-1 text-sm text-gray-200">
								{currentCategory
									? currentCategory?.description
									: "모든 게시글을 한번에 모아 보세요."}
							</span>
						</div>

						<div className="flex items-center justify-between gap-2">
							<SearchForm
								defaultKeyword={keyword}
								onSubmit={handleSearchSubmit}
							/>

							<div className={postListActions}>
								{isLogin && currentCategory && (
									<div className={createPostButtonWrapper}>
										<button
											className="dark:bg-customGray bg-blue-900 text-white"
											onClick={handleCreatePostClick}
										>
											글쓰기
										</button>
									</div>
								)}
							</div>
						</div>

						<hr className="bg-customGray h-0.5 border-none" />

						<div className="dark:bg-customGray m-2 flex h-10 items-center gap-2 rounded-md bg-blue-100">
							<div className="border-b-customDarkGray border-spacing-2 items-center bg-none">
								<div className="dark:bg-customDarkGray m-2 rounded-md bg-white">
									<span className="m-2">공지</span>
								</div>
							</div>
							<span className="text-sm font-bold text-black dark:text-white">
								관리자 공지사항입니다. 확인해주세요
							</span>
						</div>

						<PostList
							posts={postList}
							keyword={keyword}
							sortBy={sortBy ?? null}
							onSort={handlePostSort}
						/>

						<Pagination
							currentPage={index}
							totalPosts={totalPosts}
							perPage={perPage}
							onChange={handlePageChange}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Community;
