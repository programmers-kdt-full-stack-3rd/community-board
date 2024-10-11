import { UserRank } from "../../component/Posts/Rank/UserRank";
import { Link } from "react-router-dom";
import { IPostHeader, mapDBToPostHeaders } from "shared";
import { useEffect, useState } from "react";
import { ApiCall } from "../../api/api";
import { sendGetPostsRequest } from "../../api/posts/crud";
import MainPortList from "../../component/Posts/PostList/MainPostList";

const Main = () => {
	const [posts, setPosts] = useState<IPostHeader[] | null>([]);

	useEffect(() => {
		ApiCall(
			() =>
				sendGetPostsRequest({
					index: 1,
					perPage: 5,
					// TODO: 카테고리 지정
					// category_id?: number | undefined,
				}),
			() => setPosts(null)
		).then(res => {
			if (res instanceof Error) {
				return;
			}

			setPosts(mapDBToPostHeaders(res.postHeaders));
		});
	}, []);

	return (
		<div>
			<div className="mx-auto mt-2 w-full max-w-7xl px-4 lg:mt-[18px] lg:px-0">
				<div className="ml-4 flex lg:space-x-10">
					<UserRank />

					<div className="w-full min-w-0 flex-auto lg:static lg:max-h-full lg:overflow-visible">
						<div className="min-w-0 flex-auto">
							<div className="my-12 mr-4 flex flex-col gap-x-10 gap-y-10 sm:my-8 md:flex-row">
								<div className="w-full">
									<div className="dark:bg-customGray relative mb-2 flex h-14 items-center justify-between rounded-lg bg-blue-900">
										<span className="m-4 text-lg font-bold text-white">
											자유게시판
										</span>
										<Link
											className="m-4 justify-end text-base text-gray-300 hover:text-gray-500"
											to="/category/community"
										>
											바로가기
										</Link>
									</div>
									<MainPortList
										posts={posts ? posts.slice(0, 5) : []}
										// keyword={parsed.keyword}
									/>
								</div>
								<div className="w-full">
									<div className="dark:bg-customGray relative mb-2 flex h-14 items-center justify-between rounded-lg bg-blue-900">
										<span className="m-4 text-lg font-bold text-white">
											QnA
										</span>
										<Link
											className="m-4 justify-end text-base text-gray-300 hover:text-gray-500"
											to="/category/community"
										>
											바로가기
										</Link>
									</div>
									<MainPortList
										posts={posts ? posts.slice(0, 5) : []}
										// keyword={parsed.keyword}
									/>
								</div>
							</div>

							<div className="my-12 mr-4 flex flex-col gap-x-10 gap-y-10 sm:my-8 md:flex-row">
								<div className="w-full">
									<div className="dark:bg-customGray relative mb-2 flex h-14 items-center justify-between rounded-lg bg-blue-900">
										<span className="m-4 text-lg font-bold text-white">
											팀원모집
										</span>
										<Link
											className="m-4 justify-end text-base text-gray-300 hover:text-gray-500"
											to="/category/community"
										>
											바로가기
										</Link>
									</div>
									<MainPortList
										posts={posts ? posts.slice(0, 5) : []}
										// keyword={parsed.keyword}
									/>
								</div>
								<div className="w-full">
									<div className="dark:bg-customGray relative mb-2 flex h-14 items-center justify-between rounded-lg bg-blue-900">
										<span className="m-4 text-lg font-bold text-white">
											도전과제
										</span>
										<Link
											className="m-4 justify-end text-base text-gray-300 hover:text-gray-500"
											to="/category/community"
										>
											바로가기
										</Link>
									</div>
									<MainPortList
										posts={posts ? posts.slice(0, 5) : []}
										// keyword={parsed.keyword}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Main;
