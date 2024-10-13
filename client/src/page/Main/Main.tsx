import { useMemo } from "react";
import { Link } from "react-router-dom";
import MainPortList from "../../component/Posts/PostList/MainPostList";
import { UserRank } from "../../component/Posts/Rank/UserRank";
import useCategory from "../../hook/useCategory";
import usePostList from "../../hook/usePostList";

const Main = () => {
	const { postList: communityPosts } = usePostList({
		categoryId: 1,
		perPage: 5,
	});
	const { postList: qnaPosts } = usePostList({
		categoryId: 3,
		perPage: 5,
	});
	const { postList: crewPosts } = usePostList({
		categoryId: 4,
		perPage: 5,
	});
	const { postList: achievementPosts } = usePostList({
		categoryId: 5,
		perPage: 5,
	});

	const { getCategoryById } = useCategory();
	const categoriesByName = useMemo(
		() => ({
			community: getCategoryById(1),
			qna: getCategoryById(3),
			crew: getCategoryById(4),
			achievement: getCategoryById(5),
		}),
		[]
	);

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
											{categoriesByName.community?.name}
										</span>
										<Link
											className="m-4 justify-end text-base text-gray-300 hover:text-gray-500"
											to={`/category/${categoriesByName.community?.subPath}`}
										>
											바로가기
										</Link>
									</div>
									<MainPortList posts={communityPosts} />
								</div>
								<div className="w-full">
									<div className="dark:bg-customGray relative mb-2 flex h-14 items-center justify-between rounded-lg bg-blue-900">
										<span className="m-4 text-lg font-bold text-white">
											{categoriesByName.qna?.name}
										</span>
										<Link
											className="m-4 justify-end text-base text-gray-300 hover:text-gray-500"
											to={`/category/${categoriesByName.qna?.subPath}`}
										>
											바로가기
										</Link>
									</div>
									<MainPortList posts={qnaPosts} />
								</div>
							</div>

							<div className="my-12 mr-4 flex flex-col gap-x-10 gap-y-10 sm:my-8 md:flex-row">
								<div className="w-full">
									<div className="dark:bg-customGray relative mb-2 flex h-14 items-center justify-between rounded-lg bg-blue-900">
										<span className="m-4 text-lg font-bold text-white">
											{categoriesByName.crew?.name}
										</span>
										<Link
											className="m-4 justify-end text-base text-gray-300 hover:text-gray-500"
											to={`/category/${categoriesByName.crew?.subPath}`}
										>
											바로가기
										</Link>
									</div>
									<MainPortList posts={crewPosts} />
								</div>
								<div className="w-full">
									<div className="dark:bg-customGray relative mb-2 flex h-14 items-center justify-between rounded-lg bg-blue-900">
										<span className="m-4 text-lg font-bold text-white">
											{categoriesByName.achievement?.name}
										</span>
										<Link
											className="m-4 justify-end text-base text-gray-300 hover:text-gray-500"
											to={`/category/${categoriesByName.achievement?.subPath}`}
										>
											바로가기
										</Link>
									</div>
									<MainPortList posts={achievementPosts} />
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
