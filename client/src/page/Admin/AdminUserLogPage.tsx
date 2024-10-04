import Pagination from "../../component/common/Pagination/Pagination";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { FaBookOpen } from "react-icons/fa";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { HiCursorClick } from "react-icons/hi";
import { dateToStr } from "../../utils/date-to-str";
import { useFetchUserData } from "../../component/Admin/UserLog/UserLog";

export const AdminUserLogPage = () => {
	const { userId } = useParams<{ userId: string }>();
	const userIdNum = userId ? parseInt(userId, 10) : NaN;
	const initialPage = 1;
	const itemsPerPage = 10;
	const [currentPage, setCurrentPage] = useState<number>(initialPage);
	const { logs, stats, error, nickname } = useFetchUserData(
		userIdNum,
		currentPage,
		itemsPerPage
	);

	return (
		<div>
			<div
				className="flex w-full flex-col items-center justify-center text-center"
				onClick={() => {
					setCurrentPage(initialPage);
				}}
			>
				<h1 className="text-2xl font-bold">{nickname}</h1>
				<p>님의 활동 내역</p>

				<div className="flex w-[90vw] flex-col justify-center">
					<div className="grid h-[20vh] w-[90vw] grid-cols-3 items-center text-center">
						<div
							onClick={() => {
								setCurrentPage(initialPage);
							}}
						>
							<FaBookOpen className="mx-auto block h-[50px] w-[50px] hover:bg-gray-600" />
							<span className="mb-4 mt-1 text-base font-bold">
								게시글 수
							</span>
							<h2>{stats.posts}</h2>
						</div>
						<div
							onClick={() => {
								setCurrentPage(initialPage);
							}}
						>
							<IoChatbubbleEllipsesSharp className="mx-auto block h-[50px] w-[50px] hover:bg-gray-600" />
							<span className="mb-4 mt-1 text-base font-bold">
								댓글 수
							</span>
							<h2>{stats.comments}</h2>
						</div>
						<div>
							<HiCursorClick className="mx-auto block h-[50px] w-[50px] hover:bg-gray-600" />
							<span className="mb-4 mt-1 text-base font-bold">
								조회수
							</span>
							<h2>{stats.views}</h2>
						</div>
					</div>

					<div className="h-[50vh] w-[90vw]">
						<hr />
						<div className="ml-2 grid grid-cols-[3fr_1fr_1fr] font-bold">
							<div>제목</div>
							<div>카테고리</div>
							<div>작성일</div>
						</div>
						<hr />
						<div>
							{error ? (
								<p>{error}</p>
							) : logs.total > 0 ? (
								logs.logs.map(log => (
									<div key={logs.total}>
										<div className="ml-2 grid grid-cols-[3fr_1fr_1fr] items-center">
											<div>{log.title}</div>
											<div>{log.category}</div>
											<div>
												{dateToStr(
													new Date(log.createdAt),
													true
												)}
											</div>
										</div>
										<hr
											style={{
												borderColor:
													"rgba(0, 0, 0, 0.8)",
												borderWidth: "1px",
											}}
										/>
									</div>
								))
							) : (
								<p>사용자의 활동 내역이 없습니다.</p>
							)}
						</div>
						<hr />
					</div>

					<div>
						<Pagination
							currentPage={currentPage}
							totalPosts={logs.total}
							perPage={itemsPerPage}
							onChange={setCurrentPage}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
