import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";

import {
	container,
	createButton,
	roomsWrapper,
	searchButton,
	searchContainer,
	searchForm,
	searchInput,
} from "./ChatRooms.css";
import Rooms from "./Rooms/Rooms";
import Pagenation from "./Pagenation/Pagenation";
import { IReadRoomRequest, IReadRoomResponse, IRoomHeader } from "shared";
import { testMy, testSearch } from "./test-case";
import CreateRoomModal from "./Modal/CreateRoomModal";
import { sendGetRoomHeadersRequest } from "../../../api/chats/crud";
import { ClientError } from "../../../api/errors";
import { ApiCall } from "../../../api/api";
import { useErrorModal } from "../../../state/errorModalStore";
import { isDevMode } from "../../../utils/detectMode";

interface RoomListInfo {
	totalRoomCount: number;
	rooms: IRoomHeader[][];
}

const ChatRooms: FC = () => {
	const [searchCurPage, setSearchCurPage] = useState<number>(1);
	const [myCurPage, setMyCurPage] = useState<number>(1);
	const [isOpen, setIsOpen] = useState(false);
	const [keyword, setKeyword] = useState("");
	const errorModal = useErrorModal();

	// test 용 state
	const [searchRooms, setSearchRooms] = useState<RoomListInfo>({
		totalRoomCount: 0,
		rooms: [],
	});
	const [myRooms, setMyRooms] = useState<RoomListInfo>({
		totalRoomCount: 0,
		rooms: [],
	});

	const GetRoomsByKeyword = async (body: IReadRoomRequest) => {
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

		setSearchRooms({
			totalRoomCount: res.totalRoomCount,
			rooms: res.roomHeaders.reduce((acc, item, index) => {
				if (index % 2 === 0) acc.push([item]);
				else acc[acc.length - 1].push(item);

				return acc;
			}, [] as IRoomHeader[][]),
		});
	};

	const GetMyRooms = async (body: IReadRoomRequest) => {
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

		setMyRooms({
			totalRoomCount: res.totalRoomCount,
			rooms: res.roomHeaders.reduce((acc, item, index) => {
				if (index % 2 === 0) acc.push([item]);
				else acc[acc.length - 1].push(item);

				return acc;
			}, [] as IRoomHeader[][]),
		});
	};

	useEffect(() => {
		// npm run dev : 개발 모드
		if (isDevMode()) {
			setSearchRooms({
				totalRoomCount: 2,
				rooms: testSearch.roomHeaders.reduce((acc, item, index) => {
					if (index % 2 === 0) acc.push([item]);
					else acc[acc.length - 1].push(item);

					return acc;
				}, [] as IRoomHeader[][]),
			});
			setMyRooms({
				totalRoomCount: 2,
				rooms: testMy.roomHeaders.reduce((acc, item, index) => {
					if (index % 2 === 0) acc.push([item]);
					else acc[acc.length - 1].push(item);

					return acc;
				}, [] as IRoomHeader[][]),
			});
		} else {
			const body: IReadRoomRequest = {
				page: myCurPage,
				perPage: 2,
				isSearch: false,
				keyword,
			};

			GetMyRooms(body);
		}
	}, []);

	// 채팅 input Change
	const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		setKeyword(event.target.value);
	};

	// 검색 페이지 클릭
	const onSearchPageClick = (page: number) => () => {
		setSearchCurPage(page);
	};

	const onMyPageClick = (page: number) => () => {
		setMyCurPage(page);
	};

	// 채팅방 검색
	const onSearchSubmit = (event: FormEvent) => {
		event.preventDefault();

		if (keyword !== "") {
			const body: IReadRoomRequest = {
				page: myCurPage,
				perPage: 2,
				isSearch: true,
				keyword: encodeURIComponent(keyword),
			};

			if (!keyword) {
				alert("검색어를 입력하세요");
				return;
			}

			GetRoomsByKeyword(body);
			setKeyword("");
		}
	};

	return (
		<div className={container}>
			{isOpen ? <CreateRoomModal close={setIsOpen} /> : null}
			<div className={roomsWrapper}>
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
					<div onClick={() => setIsOpen(true)}>
						<CiCirclePlus
							className={createButton}
							title="채팅방 생성"
						/>
					</div>
				</div>
				{searchRooms.rooms.length === 0 ? (
					"검색된 채팅방 없음"
				) : (
					<>
						<Rooms
							isMine={false}
							rooms={searchRooms.rooms[searchCurPage - 1]}
						/>
						{testSearch.totalRoomCount > 2 ? (
							<Pagenation
								total={searchRooms.totalRoomCount}
								curPage={searchCurPage}
								setCurPage={setSearchCurPage}
								onPageClick={onSearchPageClick}
							/>
						) : null}
					</>
				)}
			</div>
			<h3>내 채팅방</h3>
			<div className={roomsWrapper}>
				{myRooms.rooms.length === 0 ? (
					"내 채팅방 없음"
				) : (
					<>
						<Rooms
							isMine={true}
							rooms={myRooms.rooms[myCurPage - 1]}
						/>
						{testMy.totalRoomCount > 2 ? (
							<Pagenation
								total={myRooms.totalRoomCount}
								curPage={myCurPage}
								setCurPage={setMyCurPage}
								onPageClick={onMyPageClick}
							/>
						) : null}
					</>
				)}
			</div>
		</div>
	);
};

export default ChatRooms;
