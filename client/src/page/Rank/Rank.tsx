import { useEffect, useState } from "react";
import Confetti from "../../component/common/Confetti/Confetti";
import { FaCrown } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";

type PostRank = {
	nickname: string;
	title: string;
	likeCount: number;
};

type CommentRank = {
	nickname: string;
	likeCount: number;
};

type ActivityRank = {
	nickname: string;
	postCount: number;
	commentCount: number;
};

export const Rank = () => {
	const [active, setActive] = useState(0);
	const [visible, setVisible] = useState(false);

	const [postRank, setPostRank] = useState<PostRank[]>([]);
	const [commentRank, setCommentRank] = useState<CommentRank[]>([]);
	const [activitiesRank, setActivitiesRank] = useState<ActivityRank[]>([]);

	const buttons = ["Activity Ranking", "Post Ranking", "Comment Ranking"];

	const posts = [
		{ nickname: "히히", title: "1", likeCount: 30 },
		{ nickname: "User2", title: "2", likeCount: 20 },
		{ nickname: "admin", title: "3", likeCount: 16 },
		{ nickname: "User4", title: "4", likeCount: 12 },
		{ nickname: "쿠쿠", title: "5", likeCount: 10 },
	];

	const comments = [
		{ nickname: "ㅎ호", likeCount: 100 },
		{ nickname: "룰루랄라", likeCount: 90 },
		{ nickname: "User3", likeCount: 80 },
		{ nickname: "핳", likeCount: 70 },
		{ nickname: "User5", likeCount: 60 },
	];

	const activities = [
		{ nickname: "이놔몬", postCount: 100, commentCount: 26 },
		{ nickname: "내가1등인가", postCount: 90, commentCount: 20 },
		{ nickname: "몰라쯧", postCount: 80, commentCount: 16 },
		{ nickname: "User4", postCount: 70, commentCount: 12 },
		{ nickname: "User5", postCount: 60, commentCount: 10 },
	];

	useEffect(() => {
		// const fetchData = async () => {
		// 	try {
		// 		setActivitiesRank(activities);
		// 		setPostRank(posts);
		// 		setCommentRank(comments);
		// 	} catch (error) {
		// 		console.error("Error fetching ranks:", error);
		// 	}
		// };

		// fetchData();
		setActivitiesRank(activities);
		setPostRank(posts);
		setCommentRank(comments);
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

	const getScore = (rank: ActivityRank | PostRank | CommentRank) => {
		if ("postCount" in rank && "commentCount" in rank) {
			return rank.postCount + rank.commentCount;
		} else if ("likeCount" in rank) {
			return rank.likeCount;
		}
		return 0;
	};

	const renderTopThree = () => {
		let data;
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
						{second.nickname}
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
						{first.nickname}
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
						{third.nickname}
					</span>
					<span className="text-sm text-gray-700 dark:text-gray-300">
						{getScore(third)} score
					</span>
				</div>
			</div>
		);
	};

	const renderRankList = () => {
		let data;
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
					className="dark:bg-customGray flex w-full flex-row items-center justify-between rounded-xl bg-gray-50 p-6"
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
							{item.nickname}
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
				<div className="dark:bg-customGray relative flex h-12 w-[700px] items-center justify-between rounded-3xl bg-blue-800">
					<div className="relative mx-2 flex h-9 w-full flex-row items-center justify-between gap-3 rounded-2xl">
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
