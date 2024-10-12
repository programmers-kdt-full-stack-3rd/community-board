import { useEffect, useState } from "react";
import Confetti from "../../component/common/Confetti/Confetti";
import { FaCrown } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import {
	TopPostsRes,
	TopCommentsRes,
	TopActivitiesRes,
} from "../../../../nestjs-migration/dist/rank/dto/rank-results.dto";
import {
	fetchActivitiesRank,
	fetchCommentRank,
	fetchPostRank,
} from "../../api/Rank/rank_crud";
import { Link } from "react-router-dom";
import { ApiCall } from "../../api/api";
import { ClientError } from "../../api/errors";

export const Rank = () => {
	const [active, setActive] = useState(0);
	const [visible, setVisible] = useState(false);

	const [postRank, setPostRank] = useState<TopPostsRes[]>([]);
	const [commentRank, setCommentRank] = useState<TopCommentsRes[]>([]);
	const [activitiesRank, setActivitiesRank] = useState<TopActivitiesRes[]>(
		[]
	);
	const buttons = ["Activity Ranking", "Post Ranking", "Comment Ranking"];

	useEffect(() => {
		const fetchData = async () => {
			try {
				ApiCall(fetchPostRank, () => setPostRank([])).then(
					postResponse => {
						if (!(postResponse instanceof ClientError)) {
							setPostRank(
								Array.isArray(postResponse) ? postResponse : []
							);
						}
					}
				);

				ApiCall(fetchCommentRank, () => setCommentRank([])).then(
					commentResponse => {
						if (!(commentResponse instanceof ClientError)) {
							setCommentRank(
								Array.isArray(commentResponse)
									? commentResponse
									: []
							);
						}
					}
				);

				ApiCall(fetchActivitiesRank, () => setActivitiesRank([])).then(
					activitiesResponse => {
						if (!(activitiesResponse instanceof ClientError)) {
							setActivitiesRank(
								Array.isArray(activitiesResponse)
									? activitiesResponse
									: []
							);
						}
					}
				);
			} catch (error) {
				console.error("Error fetching ranks:", error);

				setPostRank([]);
				setCommentRank([]);
				setActivitiesRank([]);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 50) {
				setVisible(true);
			} else {
				setVisible(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const getScore = (
		rank: TopActivitiesRes | TopPostsRes | TopCommentsRes
	) => {
		if ("postCount" in rank && "commentCount" in rank) {
			return rank.postCount + rank.commentCount;
		} else if ("likeCount" in rank) {
			return rank.likeCount;
		}
		return 0;
	};

	const renderTopThree = () => {
		let data: TopActivitiesRes[] | TopPostsRes[] | TopCommentsRes[];
		if (active === 0) {
			data = activitiesRank;
		} else if (active === 1) {
			data = postRank;
		} else {
			data = commentRank;
		}

		if (!data || data.length < 3) {
			return <div>No data available</div>;
		}

		const second = data[1];
		const first = data[0];
		const third = data[2];

		return (
			<div className="mx-20 mt-8 flex w-full flex-row justify-center gap-24">
				<div className="relative mt-24 flex flex-col items-center">
					<FaCrown className="mb-1 size-12 text-gray-400" />
					<span className="text-lg text-black dark:text-white">
						2nd
					</span>
					<FaUserCircle className="size-20" />
					<span className="max-w-[5rem] truncate text-lg font-bold text-black dark:text-white">
						{active === 1
							? (second as TopPostsRes).title
							: (second as TopActivitiesRes | TopCommentsRes)
									.nickname}
					</span>
					<span className="text-sm text-gray-700 dark:text-gray-300">
						{getScore(second)} score
					</span>
				</div>

				<div className="flex flex-col items-center">
					<FaCrown className="mb-1 size-12 text-yellow-500" />
					<span className="text-xl font-bold text-black dark:text-white">
						1st
					</span>
					<FaUserCircle className="size-24" />
					<span className="max-w-[5rem] truncate text-lg font-bold text-black dark:text-white">
						{active === 1
							? (first as TopPostsRes).title
							: (first as TopActivitiesRes | TopCommentsRes)
									.nickname}
					</span>
					<span className="text-sm text-gray-700 dark:text-gray-300">
						{getScore(first)} score
					</span>
				</div>

				<div className="relative mt-28 flex flex-col items-center">
					<FaCrown className="mb-1 size-12 text-amber-900" />
					<span className="text-lg text-black dark:text-white">
						3rd
					</span>
					<FaUserCircle className="size-16" />
					<span className="max-w-[5rem] truncate text-lg font-bold text-black dark:text-white">
						{active === 1
							? (third as TopPostsRes).title
							: (third as TopActivitiesRes | TopCommentsRes)
									.nickname}
					</span>
					<span className="text-sm text-gray-700 dark:text-gray-300">
						{getScore(third)} score
					</span>
				</div>
			</div>
		);
	};

	const renderRankList = () => {
		let data: TopActivitiesRes[] | TopPostsRes[] | TopCommentsRes[];

		if (active === 0) {
			data = activitiesRank;
		} else if (active === 1) {
			data = postRank;
		} else {
			data = commentRank;
		}

		return data.map((item, index) => {
			const score = getScore(item);
			return (
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
											: index === 2
												? "text-amber-900"
												: ""
								}`}
							/>
						)}
						<span className="text-2xl font-bold">{index + 1}</span>
						<FaUserCircle className="size-12" />
						<span className="text-lg font-bold">
							{active === 1 ? (
								<>
									{(item as TopPostsRes).title}
									<Link
										className="ml-2 text-sm text-gray-600 dark:text-gray-300"
										to={`/post/${(item as TopPostsRes).postId}`}
									>
										(상세보기)
									</Link>
								</>
							) : active === 2 ? (
								<>
									{(item as TopCommentsRes).nickname}
									<Link
										className="ml-2 text-sm text-gray-600 dark:text-gray-300"
										to={`/post/${(item as TopCommentsRes).postId}`}
									>
										(상세보기)
									</Link>
								</>
							) : (
								(item as TopActivitiesRes).nickname
							)}
						</span>
					</div>
					<div>
						<span className="ml-auto text-2xl font-bold">
							{score}
						</span>
						<span className="text-lg"> score</span>
					</div>
				</div>
			);
		});
	};

	return (
		<div className="mx-auto mt-2 w-full max-w-7xl px-4 lg:mt-[18px] lg:px-0">
			<Confetti fire={true} />
			<div
				className={`flex flex-col items-center ${visible ? "animate-slide-up" : ""}`}
			>
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
					{renderTopThree()}
				</div>
			</div>

			<div className={`${visible ? "animate-slide-up" : ""}`}>
				<div className="mx-5 mt-8 flex">
					<div className="mx-4 flex w-full flex-col items-center justify-between gap-10">
						{renderRankList()}
					</div>
				</div>
			</div>
		</div>
	);
};
