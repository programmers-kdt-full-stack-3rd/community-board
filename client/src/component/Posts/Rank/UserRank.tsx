import { useEffect, useState } from "react";
import { FaCrown } from "react-icons/fa6";
import { Link } from "react-router-dom";

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

export const UserRank = () => {
	const [postRank, setPostRank] = useState<PostRank[]>([]);
	const [commentRank, setCommentRank] = useState<CommentRank[]>([]);
	const [activitiesRank, setActivitiesRank] = useState<ActivityRank[]>([]);

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

	return (
		<div className="hidden w-[180px] shrink-0 lg:block">
			<div className="sticky top-20 mb-8">
				<Link to="/rank">
					<div className="my-4 space-y-8 text-blue-950 first:mt-0 dark:text-white">
						<div className="hidden space-y-2 divide-y divide-gray-500/30 lg:block">
							<div className="flex items-center">
								<FaCrown className="mr-1 text-blue-900 dark:text-white"></FaCrown>
								<div className="text-lg font-bold text-blue-900 dark:text-white">
									Activity
								</div>
							</div>
							<div>
								<ul className="mt-2 text-left text-sm font-bold text-gray-700 dark:text-gray-400">
									{activitiesRank.map((user, index) => (
										<li key={index}>
											{index + 1}. {user.nickname}
										</li>
									))}
								</ul>
							</div>
						</div>

						<div className="hidden space-y-2 divide-y divide-gray-500/30 lg:block">
							<div className="flex items-center">
								<FaCrown className="mr-1 text-blue-900 dark:text-white"></FaCrown>
								<div className="text-lg font-bold text-blue-900 dark:text-white">
									Post
								</div>
							</div>
							<div>
								<ul className="mt-2 text-left text-sm font-bold text-gray-700 dark:text-gray-400">
									{postRank.map((user, index) => (
										<li key={index}>
											{index + 1}. {user.nickname}
										</li>
									))}
								</ul>
							</div>
						</div>

						<div className="hidden space-y-2 divide-y divide-gray-500/30 lg:block">
							<div className="flex items-center">
								<FaCrown className="mr-1 text-blue-900 dark:text-white"></FaCrown>
								<div className="text-lg font-bold text-blue-900 dark:text-white">
									Comment
								</div>
							</div>
							<div>
								<ul className="mt-2 text-left text-sm font-bold text-gray-700 dark:text-gray-400">
									{commentRank.map((user, index) => (
										<li key={index}>
											{index + 1}. {user.nickname}
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</Link>
			</div>
		</div>
	);
};
