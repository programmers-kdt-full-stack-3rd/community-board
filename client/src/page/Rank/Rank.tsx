import { useEffect, useState } from "react";
import Confetti from "../../component/common/Confetti/Confetti";
import { FaCrown, FaUserCircle } from "react-icons/fa";
import {
	fetchActivitiesRank,
	fetchCommentRank,
	fetchPostRank,
} from "../../api/Rank/rank_crud";
import { Link } from "react-router-dom";
import { ApiCall } from "../../api/api";
import { ClientError } from "../../api/errors";
import { ITopPosts, ITopComments, ITopActivities } from "shared";

const buttons = ["Activity Ranking", "Post Ranking", "Comment Ranking"];

export const Rank = () => {
	const [active, setActive] = useState(0);
	const [postRank, setPostRank] = useState<ITopPosts[]>([]);
	const [commentRank, setCommentRank] = useState<ITopComments[]>([]);
	const [activitiesRank, setActivitiesRank] = useState<ITopActivities[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchData = async () => {
		try {
			setLoading(true);

			const [postResponse, commentResponse, activitiesResponse] =
				await Promise.all([
					ApiCall(fetchPostRank, () => setPostRank([])),
					ApiCall(fetchCommentRank, () => setCommentRank([])),
					ApiCall(fetchActivitiesRank, () => setActivitiesRank([])),
				]);

			if (!(postResponse instanceof ClientError)) {
				setPostRank(Array.isArray(postResponse) ? postResponse : []);
			}
			if (!(commentResponse instanceof ClientError)) {
				setCommentRank(
					Array.isArray(commentResponse) ? commentResponse : []
				);
			}
			if (!(activitiesResponse instanceof ClientError)) {
				setActivitiesRank(
					Array.isArray(activitiesResponse) ? activitiesResponse : []
				);
			}
		} catch (error) {
			console.error("Error fetching ranks:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const getScore = (rank: ITopActivities | ITopPosts | ITopComments) => {
		if ("postCount" in rank && "commentCount" in rank) {
			return rank.postCount + rank.commentCount;
		} else if ("likeCount" in rank) {
			return rank.likeCount;
		}
		return 0;
	};

	const renderTopThree = (data: any[]) => {
		if (!data || data.length === 0) {
			return;
		}

		const [first, second, third] = data;
		const ranks = [
			{
				rank: second,
				position: "2nd",
				color: "text-gray-400",
				offset: "mt-24",
			},
			{
				rank: first,
				position: "1st",
				color: "text-yellow-500",
				offset: "mt-0",
			},
			{
				rank: third,
				position: "3rd",
				color: "text-amber-900",
				offset: "mt-28",
			},
		];

		return (
			<div className="mx-20 mt-8 flex w-full flex-row justify-center gap-24">
				{ranks.map(
					({ rank, position, color, offset }, index) =>
						rank && (
							<div
								className={`relative flex flex-col items-center ${offset}`}
								key={index}
							>
								<FaCrown className={`mb-1 size-12 ${color}`} />
								<span className="text-lg text-black dark:text-white">
									{position}
								</span>
								<FaUserCircle className="size-20" />
								<span className="max-w-[5rem] truncate text-lg font-bold text-black dark:text-white">
									{active === 1 ? rank.title : rank.nickname}
								</span>
								<span className="text-sm text-gray-700 dark:text-gray-300">
									{getScore(rank)} score
								</span>
							</div>
						)
				)}
			</div>
		);
	};

	const renderRankList = (data: any[]) => {
		if (!data || data.length === 0) {
			return;
		}

		return data.map((item, index) => (
			<div
				key={index}
				className="dark:bg-customGray flex w-full flex-row items-center justify-between rounded-xl p-6 shadow-lg"
			>
				<div className="flex items-center gap-3">
					{index < 3 && (
						<FaCrown
							className={`mb-1 size-8 ${
								index === 0
									? "text-yellow-500"
									: index === 1
										? "text-gray-400"
										: "text-amber-900"
							}`}
						/>
					)}
					<span className="text-2xl font-bold">{index + 1}</span>
					<FaUserCircle className="size-12" />
					<span className="text-lg font-bold">
						{active === 1 ? (
							<>
								{item.title}
								<Link
									className="ml-2 text-sm text-gray-600 dark:text-gray-300"
									to={`/post/${item.postId}`}
								>
									(상세보기)
								</Link>
							</>
						) : active === 2 ? (
							<>
								{item.nickname}
								<Link
									className="ml-2 text-sm text-gray-600 dark:text-gray-300"
									to={`/post/${item.postId}`}
								>
									(상세보기)
								</Link>
							</>
						) : (
							item.nickname
						)}
					</span>
				</div>
				<div>
					<span className="ml-auto text-2xl font-bold">
						{getScore(item)}
					</span>
					<span className="text-lg"> score</span>
				</div>
			</div>
		));
	};

	if (loading) {
		return <div>잠시만 기다려 주세요...</div>;
	}

	let activeData: ITopActivities[] | ITopPosts[] | ITopComments[];
	if (active === 0) {
		activeData = activitiesRank;
	} else if (active === 1) {
		activeData = postRank;
	} else {
		activeData = commentRank;
	}

	return (
		<div className="mx-auto mt-2 w-full max-w-7xl px-4 lg:mt-[18px] lg:px-0">
			<Confetti fire={true} />
			<div className="flex flex-col items-center">
				<div className="dark:bg-customGray relative flex h-12 w-[700px] items-center justify-between rounded-3xl bg-blue-800 shadow-lg">
					<div className="relative mx-2 flex h-10 w-full flex-row items-center justify-between gap-3 rounded-2xl">
						<div
							className={`absolute h-full w-1/3 rounded-2xl bg-blue-200 bg-opacity-15 transition-transform duration-300`}
							style={{
								transform: `translateX(${active * 100}%)`,
							}}
						/>

						{buttons.map((button, index) => (
							<div
								key={index}
								className={`flex-1 cursor-pointer text-center ${active === index ? "font-bold text-white" : "text-gray-300"}`}
								onClick={() => setActive(index)}
							>
								{button}
							</div>
						))}
					</div>
				</div>

				<div className="mx-20 flex w-full flex-row justify-center gap-24">
					{renderTopThree(activeData)}
				</div>
			</div>

			<div>
				<div className="mx-5 mt-8 flex">
					<div className="mx-4 flex w-full flex-col items-center justify-between gap-10">
						{renderRankList(activeData)}
					</div>
				</div>
			</div>
		</div>
	);
};
