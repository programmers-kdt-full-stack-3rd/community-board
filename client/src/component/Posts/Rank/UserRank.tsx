import { useEffect, useState } from "react";
import { FaCrown } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FaRegThumbsUp } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";

import {
	fetchActivitiesRank,
	fetchCommentRank,
	fetchPostRank,
} from "../../../api/Rank/rank_crud";
import {
	TopPostsRes,
	TopCommentsRes,
	TopActivitiesRes,
} from "../../../../../nestjs-migration/dist/rank/dto/rank-results.dto";
import { ApiCall } from "../../../api/api";
import { ClientError } from "../../../api/errors";

export const UserRank = () => {
	const [postRank, setPostRank] = useState<TopPostsRes[]>([]);
	const [commentRank, setCommentRank] = useState<TopCommentsRes[]>([]);
	const [activitiesRank, setActivitiesRank] = useState<TopActivitiesRes[]>(
		[]
	);

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
											<div className="flex flex-row items-center justify-between">
												<div className="overflow-hidden overflow-ellipsis whitespace-nowrap">
													{index + 1}. {user.nickname}
												</div>
												<div className="flex flex-row items-center gap-1">
													{user.commentCount +
														user.postCount}
													<FaPencilAlt />
												</div>
											</div>
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
											<div className="flex flex-row items-center justify-between">
												<div className="overflow-hidden overflow-ellipsis whitespace-nowrap">
													{index + 1}. {user.title}
												</div>
												<div className="flex flex-row items-center gap-1">
													{user.likeCount}
													<FaRegThumbsUp />
												</div>
											</div>
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
											<div className="flex flex-row items-center justify-between">
												<div className="overflow-hidden overflow-ellipsis whitespace-nowrap">
													{index + 1}. {user.nickname}
												</div>
												<div className="flex flex-row items-center gap-1">
													{user.likeCount}
													<FaRegThumbsUp />
												</div>
											</div>
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
