import { useLayoutEffect, useState } from "react";
import { IPostHeader, mapDBToPostHeaders, SortBy } from "shared";
import { sendGetPostsRequest } from "../../api/posts/crud";
import PostModal from "../../component/Posts/Modal/PostModal";
import Pagination from "../../component/common/Pagination/Pagination";
import PostList from "../../component/Posts/PostList/PostList";
import SearchForm from "../../component/common/SearchForm/SearchForm";
import useMainPageSearchParams from "../../hook/useMainPageSearchParams";
import { useUserStore } from "../../state/store";
import {
	createPostButtonWrapper,
	mainPageStyle,
	postListActions,
} from "../Main/Main.css";
import { ApiCall } from "../../api/api";
import { ClientError } from "../../api/errors";
import { UserRank } from "../../component/Posts/Rank/UserRank";

const Community = () => {
	const isLogin = useUserStore(state => state.isLogin);

	const [isModalOpen, setIsModalOpen] = useState(false);

	const [posts, setPosts] = useState<IPostHeader[] | null>([]);
	const [totalPosts, setTotalPosts] = useState(0);

	const { searchParams, setSearchParams, parsed } = useMainPageSearchParams();

	useLayoutEffect(() => {
		const queryString = `?${searchParams.toString()}`;

		ApiCall(
			() => sendGetPostsRequest(queryString),
			() => {
				setPosts(null);
			}
		).then(res => {
			if (res instanceof ClientError) {
				return;
			}

			const total = parseInt(res.total, 10);

			if (isNaN(total)) {
				// TODO: 에러 핸들링
				return;
			}

			const pageCount = Math.ceil(total / parsed.perPage);

			if (pageCount > 0 && parsed.index > pageCount) {
				const nextSearchParams = new URLSearchParams(searchParams);
				nextSearchParams.set("index", String(pageCount));
				setSearchParams(nextSearchParams);
			} else {
				setPosts(mapDBToPostHeaders(res.postHeaders));
				setTotalPosts(res.total ?? 0);
			}
		});
	}, [parsed.index, parsed.perPage, parsed.keyword, parsed.sortBy]);

	const handlePostSort = (sortBy: SortBy | null) => {
		const nextSearchParams = new URLSearchParams(searchParams);

		nextSearchParams.set("index", "1");

		if (sortBy === null) {
			nextSearchParams.delete("sortBy");
		} else {
			nextSearchParams.set("sortBy", String(sortBy));
		}

		setSearchParams(nextSearchParams);
	};

	const handlePageChange = async (page: number) => {
		const nextSearchParams = new URLSearchParams(searchParams);
		nextSearchParams.set("index", String(page));

		setSearchParams(nextSearchParams);
	};

	const handleCreatePostClick = () => {
		setIsModalOpen(true);
	};

	const handleSearchSubmit = (keyword: string) => {
		const nextSearchParams = new URLSearchParams(searchParams);

		nextSearchParams.set("index", "1");

		if (keyword) {
			nextSearchParams.set("keyword", keyword);
		} else {
			nextSearchParams.delete("keyword");
		}

		setSearchParams(nextSearchParams);
	};

	return (
		<div>
			<div className="mx-auto mt-2 w-full max-w-7xl px-4 lg:mt-[18px] lg:px-0">
				<div className="ml-4 flex lg:space-x-10">
					<UserRank />
					<div className={mainPageStyle}>
						{isModalOpen && <PostModal close={setIsModalOpen} />}

						<div className="bg-customGray relative mt-4 flex flex-col justify-between rounded-lg text-left">
							<span className="ml-5 mt-5 text-lg font-bold text-white">
								자유게시판
							</span>
							<span className="mb-5 ml-5 mt-1 text-sm text-gray-200">
								자유롭게 글을 작성해보세요
							</span>
						</div>

						<div className="flex items-center justify-between gap-2">
							<SearchForm
								defaultKeyword={parsed.keyword}
								onSubmit={handleSearchSubmit}
							/>

							<div className={postListActions}>
								{isLogin && (
									<div className={createPostButtonWrapper}>
										<button
											className="bg-customGray"
											onClick={handleCreatePostClick}
										>
											글쓰기
										</button>
									</div>
								)}
							</div>
						</div>
						<hr className="bg-customGray h-0.5 border-none" />
						<div className="bg-customGray m-2 flex h-10 items-center gap-2 rounded-md">
							<div className="border-b-customDarkGray border-spacing-2 items-center bg-none">
								<div className="bg-customDarkGray m-2 rounded-md">
									<span className="m-2">공지</span>
								</div>
							</div>
							<span className="text-sm font-bold text-white">
								관리자 공지사항입니다. 확인해주세요
							</span>
						</div>

						<PostList
							posts={posts}
							keyword={parsed.keyword}
							sortBy={parsed.sortBy}
							onSort={handlePostSort}
						/>

						<Pagination
							currentPage={parsed.index}
							totalPosts={totalPosts}
							perPage={parsed.perPage}
							onChange={handlePageChange}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Community;
