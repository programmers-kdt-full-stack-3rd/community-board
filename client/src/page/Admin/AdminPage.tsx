import { useEffect, useState } from "react";
import { IStats, TInterval } from "shared";
import { ApiCall } from "../../api/api";
import { fetchTotalStats } from "../../api/admin/user_crud";
import { ClientError } from "../../api/errors";
import { getKoreanDate, subtractDays } from "../../utils/date-to-str";
import useScrollCount from "../../hook/useScrollCount";
import { HiCursorClick } from "react-icons/hi";
import { FaBookOpen, FaUser } from "react-icons/fa6";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AdminGraph } from "../../component/Admin/Stats/AdminGraph";

export const AdminPage = () => {
	const endDate = getKoreanDate(new Date());
	const startDate = getKoreanDate(subtractDays(endDate, 365));

	const [totalStats, setTotalStats] = useState<IStats>({
		posts: 0,
		comments: 0,
		views: 0,
		users: 0,
	});

	const fetchStats = async (
		startDate: string,
		endDate: string,
		interval: TInterval
	) => {
		ApiCall(
			() => fetchTotalStats(startDate, endDate, interval),
			() => {
				setTotalStats({
					posts: 0,
					comments: 0,
					views: 0,
					users: 0,
				});
			}
		).then(res => {
			if (res instanceof ClientError) {
				return;
			}
			setTotalStats(res.totalStats);
		});
	};

	useEffect(() => {
		fetchStats(startDate, endDate, "yearly");
	}, [startDate, endDate]);

	const duration = 2000;

	const views = useScrollCount(totalStats.views, duration);
	const posts = useScrollCount(totalStats.posts, duration);
	const comments = useScrollCount(totalStats.comments, duration);
	const users = useScrollCount(totalStats.users, duration);

	return (
		<div className="mx-auto mt-2 w-full max-w-7xl px-4 lg:mt-[18px] lg:px-0">
			<div className="flex flex-col items-center justify-center">
				<div className="flex items-center justify-center">
					<div className="text-4xl font-bold">CodePlay</div>
				</div>

				<div className="dark:bg-customGray mx-4 mt-8 flex w-full flex-row justify-around gap-6 rounded-xl bg-blue-50">
					<div className="my-8 flex flex-col items-center gap-2">
						<HiCursorClick className="text-2xl" />
						<div
							className="text-2xl font-bold"
							ref={views.ref}
						>
							{views.count}
						</div>
						<div className="text-sm text-gray-500 dark:text-gray-200">
							조회수
						</div>
					</div>

					<Link
						to="/admin/postMgmt"
						className="text-black dark:text-white"
					>
						<div className="my-8 flex flex-col items-center gap-2">
							<FaBookOpen className="text-2xl" />
							<div
								className="text-2xl font-bold"
								ref={posts.ref}
							>
								{posts.count}
							</div>
							<div className="flex flex-row items-center gap-2 text-sm text-gray-500 dark:text-gray-200">
								<span>게시글 수</span>
								<FaSearch />
							</div>
						</div>
					</Link>
					<div className="my-8 flex flex-col items-center gap-2">
						<IoChatbubbleEllipsesSharp className="text-2xl" />
						<div
							className="text-2xl font-bold"
							ref={comments.ref}
						>
							{comments.count}
						</div>
						<div className="text-sm text-gray-500 dark:text-gray-200">
							댓글 수
						</div>
					</div>
					<Link
						to="/admin/userMgmt"
						className="text-black dark:text-white"
					>
						<div className="my-8 flex flex-col items-center gap-2">
							<FaUser className="text-2xl" />
							<div
								className="text-2xl font-bold"
								ref={users.ref}
							>
								{users.count}
							</div>
							<div className="flex flex-row items-center gap-2 text-sm text-gray-500 dark:text-gray-200">
								<span>유저 수</span>
								<FaSearch />
							</div>
						</div>
					</Link>
				</div>

				<div>
					<AdminGraph />
				</div>
			</div>
		</div>
	);
};
