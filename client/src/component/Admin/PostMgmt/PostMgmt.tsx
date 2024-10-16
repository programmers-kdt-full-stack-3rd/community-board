import { useEffect, useState } from "react";
import Pagination from "../../common/Pagination/Pagination";
import { ApiCall } from "../../../api/api";
import { ClientError } from "../../../api/errors";
import { IAdminPostResponse } from "shared";
import { Link } from "react-router-dom";
import { dateToStr } from "../../../utils/date-to-str";
import {
	handleAdminPostPrivate,
	handleAdminPostPublic,
	handleDeleteAdminPost,
	handleRestoreAdminPost,
	sendGetAdminPostsRequest,
} from "../../../api/admin/post_crud";
import TextInput from "../../common/TextInput";
import Button from "../../common/Button";
import { useModal } from "../../../hook/useModal";
import ConfirmModal from "../../common/Modal/ConfirmModal";

const PostList = () => {
	const initialPage = 1;
	const itemsPerPage = 10;
	const [posts, setPosts] = useState<IAdminPostResponse>({
		total: 0,
		postHeaders: [],
	});
	const [currentPage, setCurrentPage] = useState<number>(initialPage);
	const [keyword, setKeyword] = useState<string>("");

	const confirmModal = useModal();
	const [confirmModalDetails, setConfirmModalDetails] = useState({
		content: "",
		updateFunction: async () => {},
	});

	const fetchPosts = () => {
		ApiCall(
			() => sendGetAdminPostsRequest(currentPage, itemsPerPage, keyword),
			() => {
				setPosts({
					total: 0,
					postHeaders: [],
				});
			}
		).then(res => {
			if (res instanceof ClientError) {
				return;
			}
			setPosts(res);
		});
	};

	useEffect(() => {
		fetchPosts();
	}, [currentPage]);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleSearch = () => {
		setCurrentPage(1);
		fetchPosts();
	};

	const handlePostUpdate = async (updateFunction: () => Promise<void>) => {
		confirmModal.close();
		setConfirmModalDetails({
			content: "",
			updateFunction: async () => {},
		});

		await updateFunction();
		fetchPosts();
	};

	return (
		<div className="mx-auto mt-2 w-full max-w-7xl px-4 lg:mt-[18px] lg:px-0">
			<ConfirmModal
				isOpen={confirmModal.isOpen}
				onAccept={() =>
					handlePostUpdate(confirmModalDetails.updateFunction)
				}
				onClose={confirmModal.close}
			>
				<ConfirmModal.Title>동작 확인</ConfirmModal.Title>
				<ConfirmModal.Body>
					{confirmModalDetails.content}
				</ConfirmModal.Body>
			</ConfirmModal>

			<div className="mb-6 flex flex-row items-center justify-between">
				<h2 className="text-xl font-bold">게시물 목록</h2>

				<TextInput
					className="w-30 text-gray-200"
					value={keyword}
					onChange={e => setKeyword(e.target.value)}
					placeholder="이메일을 입력해주세요"
					actionButton={
						<Button
							className="dark:bg-customGray bg-blue-900"
							size="medium"
							color="neutral"
							type="submit"
							onClick={handleSearch}
						>
							검색
						</Button>
					}
				/>
			</div>

			<div>
				<div>
					<div className="mb-2 grid w-full grid-cols-[3fr_4fr_2fr_1fr_1fr] items-center">
						<div>제목</div>
						<div>작성자</div>
						<div>작성일</div>
						<div>상태</div>
						<div>게시글</div>
					</div>
					<hr />
				</div>
				{posts.total === 0 ? (
					<p>빈 게시판입니다.</p>
				) : (
					posts.postHeaders.map(post => (
						<div key={post.id}>
							<div className="my-2 grid w-full grid-cols-[3fr_4fr_2fr_1fr_1fr] items-center">
								<Link
									to={`/post/${post.id}`}
									className="break-words break-all"
								>
									{post.title}
								</Link>
								<div className="break-words break-all">
									{post.author}
								</div>
								<div>
									{dateToStr(new Date(post.createdAt), true)}
								</div>
								<div>
									{post.isPrivate ? (
										<Button
											color="neutral"
											variant="solid"
											onClick={() => {
												setConfirmModalDetails({
													content:
														"해당 게시물을 공개하시겠습니까?",
													updateFunction: () =>
														handleAdminPostPublic(
															post.id
														),
												});
												confirmModal.open();
											}}
										>
											공개
										</Button>
									) : (
										<Button
											color="action"
											variant="solid"
											onClick={() => {
												setConfirmModalDetails({
													content:
														"해당 게시물을 비공개하시겠습니까?",
													updateFunction: () =>
														handleAdminPostPrivate(
															post.id
														),
												});
												confirmModal.open();
											}}
										>
											비공개
										</Button>
									)}
								</div>
								<div>
									{post.isDelete ? (
										<Button
											color="neutral"
											variant="solid"
											onClick={() => {
												setConfirmModalDetails({
													content:
														"해당 게시물을 복구하시겠습니까?",
													updateFunction: () =>
														handleRestoreAdminPost(
															post.id
														),
												});
												confirmModal.open();
											}}
										>
											복구
										</Button>
									) : (
										<Button
											color="danger"
											variant="solid"
											onClick={() => {
												setConfirmModalDetails({
													content:
														"해당 게시물을 삭제하시겠습니까?",
													updateFunction: () =>
														handleDeleteAdminPost(
															post.id
														),
												});
												confirmModal.open();
											}}
										>
											삭제
										</Button>
									)}
								</div>
							</div>
							<hr className="dark:bg-customGray bg-gray-50" />
						</div>
					))
				)}
				<hr />

				<div className="mt-8">
					<Pagination
						currentPage={currentPage}
						totalPosts={posts.total}
						perPage={itemsPerPage}
						onChange={handlePageChange}
					/>
				</div>
			</div>
		</div>
	);
};

export default PostList;
