import { Link } from "react-router-dom";
import { IPostHeader } from "shared";
import EmptyPostListBody from "./EmptyPostListBody";
import { noPost } from "./PostList.css";
import {
	FaRegCommentDots,
	FaRegThumbsUp,
	FaRegUserCircle,
} from "react-icons/fa";
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
						className={noPost}
						isFetchFailed={isFetchFailed}
						keyword={keyword}
					/>
				) : (
					posts.map(postHeader => (
						<li
							className="py-4 last:pb-0"
							key={postHeader.id}
						>
							<div className="flex items-center justify-between text-gray-500">
								<div className="flex items-center gap-2">
									<FaRegUserCircle className="text-base" />
									<a className="mb-1 text-base text-white">
										{postHeader.author_nickname}
									</a>
								</div>
								<div className="flex items-center gap-3 text-white">
									<div className="flex items-center gap-1">
										<FaRegThumbsUp className="text-base" />
										<a className="mb-1 min-w-[20px] text-center text-base text-white">
											{postHeader.likes}
										</a>
									</div>
									<div className="flex items-center gap-1">
										<FaRegCommentDots className="text-base" />
										<a className="mb-1 min-w-[20px] text-center text-base text-white">
											{postHeader.views}
										</a>
									</div>
								</div>
							</div>
							<Link
								className="mb-1 mt-1 block text-left text-lg font-bold text-gray-300"
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
