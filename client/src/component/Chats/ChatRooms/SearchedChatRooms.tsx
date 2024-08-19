import {
	ChangeEvent,
	FormEvent,
	SetStateAction,
	useLayoutEffect,
	useState,
} from "react";
import { RoomsInfo } from "./ChatRooms";
import { IReadRoomRequest, IReadRoomResponse } from "shared";
import { ClientError } from "../../../api/errors";
import { ApiCall } from "../../../api/api";
import { sendGetRoomHeadersRequest } from "../../../api/chats/crud";
import { useErrorModal } from "../../../state/errorModalStore";
import {
	createButton,
	searchButton,
	searchContainer,
	searchForm,
	searchInput,
} from "./ChatRooms.css";
import Rooms from "./Rooms/Rooms";
import Pagenation from "./Pagenation/Pagenation";
import { isDevMode } from "../../../utils/detectMode";
import { testMy } from "./test-case";
import { CiCirclePlus } from "react-icons/ci";

interface Props {
	open: React.Dispatch<SetStateAction<boolean>>;
}

const SearchedChatRooms: React.FC<Props> = ({ open }) => {
	const [isRendered, setIsRendered] = useState(false);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [searchedRooms, setSearchedRooms] = useState<RoomsInfo>({
		totalRoomCount: 0,
		rooms: {},
	});
	const [keyword, setKeyword] = useState("");
	const errorModal = useErrorModal();

	const GetRooms = async (body: IReadRoomRequest) => {
		const queryString = `?page=${body.page}&perPage=${body.perPage}&isSearch=${body.isSearch}&keyword=${body.keyword}`;

		const res: IReadRoomResponse | ClientError = await ApiCall(
			() => sendGetRoomHeadersRequest(queryString),
			err => {
				errorModal.setErrorMessage(err.message);
				errorModal.open();
			}
		);

		if (res instanceof ClientError) {
			return;
		}

		if (res.totalRoomCount === 0) {
			setSearchedRooms({
				totalRoomCount: res.totalRoomCount,
				rooms: {},
			});
		} else {
			setSearchedRooms({
				totalRoomCount: res.totalRoomCount,
				rooms: {
					...searchedRooms.rooms,
					[currentPage]: res.roomHeaders,
				},
			});
		}
		setIsRendered(true);
	};

	const onMyPageClick = (page: number) => {
		if (page === currentPage) {
			return;
		}
		setCurrentPage(page);
		setIsRendered(false);
	};

	// 채팅 input Change
	const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		setKeyword(event.target.value);
	};

	// 채팅방 검색
	const onSearchSubmit = (event: FormEvent) => {
		event.preventDefault();

		if (keyword !== "") {
			setSearchedRooms({
				totalRoomCount: 0,
				rooms: {},
			});

			const body: IReadRoomRequest = {
				page: currentPage,
				perPage: 2,
				isSearch: true,
				keyword: encodeURIComponent(keyword),
			};

			if (!keyword) {
				alert("검색어를 입력하세요");
				return;
			}

			GetRooms(body);
			setKeyword("");
		}
	};

	useLayoutEffect(() => {
		console.log(currentPage);
		console.log(searchedRooms.rooms);
		if (isDevMode()) {
			setSearchedRooms({
				totalRoomCount: 2,
				rooms: {
					...searchedRooms.rooms,
					[currentPage]: testMy.roomHeaders,
				},
			});
		} else if (!isRendered) {
			if (Object.keys(searchedRooms.rooms).length === 0) {
				setIsRendered(true);
				return;
			}

			const body: IReadRoomRequest = {
				page: currentPage,
				perPage: 2,
				isSearch: false,
				keyword: "",
			};
			GetRooms(body);
		}
	}, [currentPage]);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				gap: "10px",
			}}
		>
			<div className={searchContainer}>
				<form
					className={searchForm}
					onSubmit={onSearchSubmit}
				>
					<input
						className={searchInput}
						placeholder="채팅방 검색"
						value={keyword}
						onChange={onSearchChange}
					/>
					<button className={searchButton}>검색</button>
				</form>
				<div onClick={() => open(true)}>
					<CiCirclePlus
						className={createButton}
						title="채팅방 생성"
					/>
				</div>
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "10px",
				}}
			>
				{isRendered && (
					<div
						style={{
							display: "flex",
							flexDirection: "column",
						}}
					>
						{Object.keys(searchedRooms.rooms).length === 0 ? (
							"검색된 채팅방 없음"
						) : (
							<Rooms
								isMine={true}
								rooms={searchedRooms.rooms[currentPage]}
							/>
						)}
					</div>
				)}
				{searchedRooms.totalRoomCount > 2 ? (
					<Pagenation
						total={searchedRooms.totalRoomCount}
						curPage={currentPage}
						setCurPage={setCurrentPage}
						onPageClick={onMyPageClick}
					/>
				) : null}
			</div>
		</div>
	);
};

export default SearchedChatRooms;
