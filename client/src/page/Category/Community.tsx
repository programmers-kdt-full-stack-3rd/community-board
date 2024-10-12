import React, { useEffect, useState } from "react";
import { IPostHeader, mapDBToPostHeaders, SortBy } from "shared";
import {
	sendGetPostsRequest,
	TPostListClientSearchParams,
} from "../../api/posts/crud";
import Pagination from "../../component/common/Pagination/Pagination";
import PostList from "../../component/Posts/PostList/PostList";
import SearchForm from "../../component/common/SearchForm/SearchForm";
import { useUserStore } from "../../state/store";
import {
	createPostButtonWrapper,
	mainPageStyle,
	postListActions,
} from "../Main/Main.css";
import { ApiCall } from "../../api/api";
import { UserRank } from "../../component/Posts/Rank/UserRank";
import { useNavigate } from "react-router-dom";
import useParsedSearchParams from "../../hook/useParsedSearchParams";
import useCategory from "../../hook/useCategory";

interface IProps {
	categoryId?: number;
}

const Community: React.FC<IProps> = ({ categoryId }) => {
	const navigate = useNavigate();
	const isLogin = useUserStore(state => state.isLogin);

	const { currentCategory } = useCategory(categoryId);

	const [posts, setPosts] = useState<IPostHeader[] | null>([]);
	const [totalPosts, setTotalPosts] = useState(0);

	const [
		{ index = 1, perPage = 10, sortBy, keyword },
		setSearchParamsObject,
	] = useParsedSearchParams<TPostListClientSearchParams>({
		index: "number",
		perPage: "number",
		sortBy: "number",
		keyword: "string",
	});

	useEffect(() => {
		ApiCall(
			() =>
				sendGetPostsRequest({
					index,
					perPage,
					sortBy,
					keyword,
					category_id: categoryId,
				}),
			() => setPosts(null)
		).then(res => {
			if (res instanceof Error) {
				return;
			}

			const total = parseInt(res.total, 10);

			if (isNaN(total)) {
				// TODO: 에러 핸들링
				return;
			}

			const pageCount = Math.ceil(total / perPage);

			if (pageCount > 0 && index > pageCount) {
				setSearchParamsObject({
					index: pageCount,
				});
			} else {
				setPosts(mapDBToPostHeaders(res.postHeaders));
				setTotalPosts(total ?? 0);
			}
		});
	}, [categoryId, index, perPage, keyword, sortBy]);

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
		// TODO: 글쓰기 페이지도 카테고리 구분해야 함
		navigate("/post/new");
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
							posts={posts}
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
