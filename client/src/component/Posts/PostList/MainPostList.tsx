import { Link } from "react-router-dom";
import { IPostHeader } from "shared";
import EmptyPostListBody from "./EmptyPostListBody";
import { FaRegThumbsUp, FaRegUserCircle } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
interface IPostListProps {
	posts: IPostHeader[] | null;
	keyword?: string;
}

const MainPortList = ({ posts, keyword }: IPostListProps) => {
	const isFetchFailed = posts === null;
	const isPostsEmpty = isFetchFailed || posts.length === 0;

	return (
		<div>
			<ul className="divide-customGray divide-y">
				{isPostsEmpty ? (
					<EmptyPostListBody
						isFetchFailed={isFetchFailed}
						keyword={keyword}
					/>
				) : (
					posts.map(postHeader => (
						<li
							className="px-[10px] py-4 last:pb-0"
							key={postHeader.id}
						>
							<div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
								<div className="flex items-center gap-2">
									<FaRegUserCircle className="text-base" />
									<a className="mb-1 text-base text-gray-600 dark:text-gray-400">
										{postHeader.author_nickname}
									</a>
								</div>
								<div className="flex items-center gap-3">
									<div className="flex items-center gap-1">
										<FaRegThumbsUp className="text-base" />
										<a className="mb-1 min-w-[20px] text-center text-base text-gray-600 dark:text-gray-400">
											{postHeader.likes}
										</a>
									</div>
									<div className="flex items-center gap-1">
										<IoEyeOutline className="text-base" />
										<a className="mb-1 min-w-[20px] text-center text-base text-gray-600 dark:text-gray-400">
											{postHeader.views}
										</a>
									</div>
								</div>
							</div>
							<Link
								className="mb-1 mt-1 block break-words break-all text-left text-base font-bold text-black dark:text-gray-300"
								to={`/post/${postHeader.id}`}
							>
								{postHeader.title}
							</Link>
						</li>
					))
				)}
			</ul>
		</div>
	);
};

export default MainPortList;
