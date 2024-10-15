import { useEffect, useState } from "react";
import { IUserInfoResponse } from "shared";
import { ApiCall } from "../../../api/api";
import { ClientError } from "../../../api/errors";
import { Link } from "react-router-dom";
import { dateToStr } from "../../../utils/date-to-str";
import Pagination from "../../common/Pagination/Pagination";
import {
	handleDeleteAdminUser,
	handleRestoreAdminUser,
	sendGetAdminUsersRequest,
} from "../../../api/admin/user_crud";
import TextInput from "../../common/TextInput";
import Button from "../../common/Button";
import { useModal } from "../../../hook/useModal";
import ConfirmModal from "../../common/Modal/ConfirmModal";

const UserList = () => {
	const initialPage = 1;
	const itemsPerPage = 10;
	const [users, setUsers] = useState<IUserInfoResponse>({
		total: 0,
		userInfo: [],
	});
	const [currentPage, setCurrentPage] = useState<number>(initialPage);
	const nickname = "";
	const [email, setEmail] = useState<string>("");

	const confirmModal = useModal();
	const [confirmModalDetails, setConfirmModalDetails] = useState({
		content: "",
		updateFunction: async () => {},
	});

	const fetchUsers = () => {
		ApiCall(
			() =>
				sendGetAdminUsersRequest(
					currentPage,
					itemsPerPage,
					nickname,
					email
				),
			() => {
				setUsers({
					total: 0,
					userInfo: [],
				});
			}
		).then(res => {
			if (res instanceof ClientError) {
				return;
			}
			setUsers(res);
		});
	};

	useEffect(() => {
		fetchUsers();
	}, [currentPage]);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleSearch = () => {
		setCurrentPage(1);
		fetchUsers();
	};

	const handleUserUpdate = async (updateFunction: () => Promise<void>) => {
		confirmModal.close();
		setConfirmModalDetails({
			content: "",
			updateFunction: async () => {},
		});

		await updateFunction();
		fetchUsers();
	};

	return (
		<div className="mx-auto mt-2 w-full max-w-7xl px-4 lg:mt-[18px] lg:px-0">
			<ConfirmModal
				isOpen={confirmModal.isOpen}
				onAccept={() =>
					handleUserUpdate(confirmModalDetails.updateFunction)
				}
				onClose={confirmModal.close}
			>
				<ConfirmModal.Title>동작 확인</ConfirmModal.Title>
				<ConfirmModal.Body>
					{confirmModalDetails.content}
				</ConfirmModal.Body>
			</ConfirmModal>

			<div className="mb-6 flex flex-row items-center justify-between">
				<h2 className="text-xl font-bold">사용자 목록</h2>

				<TextInput
					className="w-30 text-gray-200"
					value={email}
					onChange={e => setEmail(e.target.value)}
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
					<div className="mb-2 grid w-full grid-cols-[3fr_4fr_2fr_1fr_1fr_1fr] items-center">
						<span>닉네임</span>
						<span>이메일</span>
						<span>가입일</span>
						<span>댓글 수</span>
						<span>게시글 수</span>
						<span>계정</span>
					</div>
					<hr />
				</div>
				{users.total === 0 ? (
					<p className="mx-4">사용자가 없습니다.</p>
				) : (
					users.userInfo.map(user => (
						<div key={user.id}>
							<div className="mb-2 grid w-full grid-cols-[3fr_4fr_2fr_1fr_1fr_1fr] items-center">
								<Link to={`/admin/userLog/${user.id}`}>
									{user.nickname}
								</Link>
								<div>{user.email}</div>
								<div>
									{dateToStr(new Date(user.createdAt), true)}
								</div>
								<div>{user.statistics.comments}</div>
								<div>{user.statistics.posts}</div>
								<div>
									{user.isDelete ? (
										<Button
											color="action"
											variant="solid"
											onClick={() => {
												setConfirmModalDetails({
													content:
														"해당 사용자를 복구하시겠습니까?",
													updateFunction: () =>
														handleRestoreAdminUser(
															user.id
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
														"해당 사용자를 삭제하시겠습니까?",
													updateFunction: () =>
														handleDeleteAdminUser(
															user.id
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
			</div>

			<hr></hr>

			<div className="mt-8">
				<Pagination
					currentPage={currentPage}
					totalPosts={users.total}
					perPage={itemsPerPage}
					onChange={handlePageChange}
				/>
			</div>
		</div>
	);
};

export default UserList;
