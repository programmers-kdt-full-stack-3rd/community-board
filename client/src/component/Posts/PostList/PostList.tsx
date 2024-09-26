import clsx from "clsx";
import { MouseEvent } from "react";
import { FiArrowDown } from "react-icons/fi";
import { Link } from "react-router-dom";
import { IPostHeader, SortBy } from "shared";
import { dateToStr } from "../../../utils/date-to-str";
import EmptyPostListBody from "./EmptyPostListBody";

interface IPostListProps {
	posts: IPostHeader[] | null;
	keyword?: string;
	sortBy: SortBy | null;
	onSort: (sortBy: SortBy | null) => void;
}

const PostList = ({ posts, keyword, sortBy, onSort }: IPostListProps) => {
	const handleSortableClickWith =
		(nextSortBy: SortBy | null) => (event: MouseEvent) => {
			event.preventDefault();

			onSort(nextSortBy);
		};

	const isFetchFailed = posts === null;
	const isPostsEmpty = isFetchFailed || posts.length === 0;

	return (
		<div className="flex w-full flex-col items-stretch border-b-2 border-t-2 border-gray-500 leading-[1.3]">
			<div
				className={clsx(
					"text-[0.9rem] font-bold opacity-80",
					"postListHeaderRow:border-b-2 postListHeaderRow:min-h-[32px] box-border flex min-h-[48px] items-center gap-2 border-b border-t border-gray-400/25 py-1 pl-2 first:border-t-0 last:border-b-0"
				)}
			>
				<div className="postListHeaderRow:text-center flex-1 text-left">
					제목
				</div>
				<div className="w-[96px] flex-none text-[0.9rem]">작성자</div>
				<div className="w-[96px] flex-none text-[0.9rem]">
					<a
						className={clsx(
							"postListLinks:hover:bg-transparent flex items-center justify-center gap-[2px]",
							"font-inherit text-inherit hover:bg-gray-500/5"
						)}
						href="#"
						onClick={handleSortableClickWith(null)}
					>
						작성일시
						<span
							className={clsx(
								"ml-1 flex items-center text-gray-400",
								{
									"opacity-30": sortBy !== null,
								}
							)}
						>
							<FiArrowDown />
						</span>
					</a>
				</div>
				<div className="w-[64px] flex-none">
					<a
						className={clsx(
							"postListLinks:hover:bg-transparent flex items-center justify-center gap-[2px]",
							"font-inherit text-inherit hover:bg-gray-500/5"
						)}
						href="#"
						onClick={handleSortableClickWith(SortBy.LIKES)}
					>
						좋아요
						<span
							className={clsx(
								"ml-1 flex items-center text-gray-400",
								{
									"opacity-30": sortBy !== SortBy.LIKES,
								}
							)}
						>
							<FiArrowDown />
						</span>
					</a>
				</div>
				<div className="w-[64px] flex-none">
					<a
						className={clsx(
							"postListLinks:hover:bg-transparent flex items-center justify-center gap-[2px]",
							"font-inherit text-inherit hover:bg-gray-500/5"
						)}
						href="#"
						onClick={handleSortableClickWith(SortBy.VIEWS)}
					>
						조회
						<span
							className={clsx(
								"ml-1 flex items-center text-gray-400",
								{
									"opacity-30": sortBy !== SortBy.VIEWS,
								}
							)}
						>
							<FiArrowDown />
						</span>
					</a>
				</div>
			</div>

			<div>
				<div className="flex flex-col">
					{isPostsEmpty ? (
						<EmptyPostListBody
							className="my-30 text-center text-2xl text-gray-500"
							isFetchFailed={isFetchFailed}
							keyword={keyword}
						/>
					) : (
						posts.map(postHeader => (
							<Link
								key={postHeader.id}
								className={clsx(
									"flex items-center justify-center gap-2",
									"box-border flex min-h-[48px] items-center gap-2 border-b border-t border-gray-400/25 py-1 pl-2 text-white first:border-t-0 last:border-b-0"
								)}
								to={`/post/${postHeader.id}`}
							>
								<div className="postListHeaderRow:text-center flex-1 text-left">
									{postHeader.title}
								</div>
								<div className="w-[96px] flex-none text-[0.9rem]">
									{postHeader.author_nickname}
								</div>
								<div className="w-[96px] flex-none text-[0.9rem]">
									{dateToStr(postHeader.created_at, true)}
								</div>
								<div className="w-[64px] flex-none">
									{postHeader.likes}
								</div>
								<div className="w-[64px] flex-none">
									{postHeader.views}
								</div>
							</Link>
						))
					)}
				</div>
			</div>
		</div>
	);
};

export default PostList;
