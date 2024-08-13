import {
	ChangeEvent,
	FC,
	FormEvent,
	MouseEvent,
	useEffect,
	useState,
} from "react";
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

interface IRoomHeader {
	roomId: string;
	title: string;
	is_private: boolean;
	participantNum: number; // 채팅방에 속한 사람들
	curNum: number | null; // 현재 접속 중인 사람들
	lastMessage: string | null;
}

interface IReadRoomResponse {
	totalRoomCount: number;
	roomHeaders: IRoomHeader[];
}

const testSearch: IReadRoomResponse = {
	totalRoomCount: 11,
	roomHeaders: [
		{
			roomId: "13",
			title: "search room test 1",
			is_private: false,
			participantNum: 5,
			lastMessage: null,
			curNum: null,
		},
		{
			roomId: "14",
			title: "search room test 2",
			is_private: true,
			participantNum: 5,
			lastMessage: null,
			curNum: null,
		},
		{
			roomId: "15",
			title: "search room test 3",
			is_private: true,
			participantNum: 5,
			lastMessage: null,
			curNum: null,
		},
		{
			roomId: "16",
			title: "search room test 4",
			is_private: true,
			participantNum: 5,
			lastMessage: null,
			curNum: null,
		},
		{
			roomId: "17",
			title: "search room test 5",
			is_private: true,
			participantNum: 5,
			lastMessage: null,
			curNum: null,
		},
		{
			roomId: "18",
			title: "search room test 6",
			is_private: true,
			participantNum: 5,
			lastMessage: null,
			curNum: null,
		},
		{
			roomId: "19",
			title: "search room test 7",
			is_private: true,
			participantNum: 5,
			lastMessage: null,
			curNum: null,
		},
		{
			roomId: "20",
			title: "search room test 8",
			is_private: true,
			participantNum: 5,
			lastMessage: null,
			curNum: null,
		},
		{
			roomId: "21",
			title: "search room test 9",
			is_private: true,
			participantNum: 5,
			lastMessage: null,
			curNum: null,
		},
		{
			roomId: "22",
			title: "search room test 10",
			is_private: true,
			participantNum: 5,
			lastMessage: null,
			curNum: null,
		},
		{
			roomId: "23",
			title: "search room test 11",
			is_private: true,
			participantNum: 5,
			lastMessage: null,
			curNum: null,
		},
	],
};

const testMy: IReadRoomResponse = {
	totalRoomCount: 11,
	roomHeaders: [
		{
			roomId: "1",
			title: "my room test1",
			is_private: false,
			participantNum: 1,
			lastMessage: `1234`,
			curNum: 2,
		},
		{
			roomId: "2",
			title: "my room search room test 1",
			is_private: true,
			participantNum: 2,
			lastMessage: `231123`,
			curNum: 3,
		},
		{
			roomId: "3",
			title: "my room test3",
			is_private: false,
			participantNum: 3,
			lastMessage: `1234`,
			curNum: 2,
		},
		{
			roomId: "4",
			title: "my room test4",
			is_private: false,
			participantNum: 4,
			lastMessage: `1234`,
			curNum: 2,
		},
		{
			roomId: "5",
			title: "my room test5",
			is_private: false,
			participantNum: 5,
			lastMessage: `1234`,
			curNum: 2,
		},
		{
			roomId: "6",
			title: "my room test6",
			is_private: false,
			participantNum: 6,
			lastMessage: `1234`,
			curNum: 2,
		},
		{
			roomId: "7",
			title: "my room test7",
			is_private: false,
			participantNum: 7,
			lastMessage: `1234`,
			curNum: 2,
		},
		{
			roomId: "8",
			title: "my room test8",
			is_private: false,
			participantNum: 8,
			lastMessage: `1234`,
			curNum: 2,
		},
		{
			roomId: "9",
			title: "my room test9",
			is_private: false,
			participantNum: 9,
			lastMessage: `1234`,
			curNum: 2,
		},
		{
			roomId: "10",
			title: "my room test10",
			is_private: false,
			participantNum: 10,
			lastMessage: `1234`,
			curNum: 2,
		},
		{
			roomId: "11",
			title: "my room test11",
			is_private: false,
			participantNum: 11,
			lastMessage: `1234`,
			curNum: 2,
		},
	],
};

const ChatRooms: FC = () => {
	const [keyword, setKeyword] = useState<string>("");
	const [searchCurPage, setSearchCurPage] = useState<number>(1);
	const [myCurPage, setMyCurPage] = useState<number>(1);

	// test 용 state
	const [searchRooms, setSearchRooms] = useState<IRoomHeader[][] | null>(
		null
	);
	const [myRooms, setMyRooms] = useState<IRoomHeader[][] | null>(null);

	useEffect(() => {
		setSearchRooms(
			testSearch.roomHeaders.reduce((acc, item, index) => {
				if (index % 2 === 0) acc.push([item]);
				else acc[acc.length - 1].push(item);

				return acc;
			}, [] as IRoomHeader[][])
		);
		setMyRooms(
			testMy.roomHeaders.reduce((acc, item, index) => {
				if (index % 2 === 0) acc.push([item]);
				else acc[acc.length - 1].push(item);

				return acc;
			}, [] as IRoomHeader[][])
		);
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
			// TODO: 검색 시 데이터 가져오기 (alert는 테스트용)
			alert(`keyword: ${keyword} 채팅방 검색`);
			setKeyword("");
		}
	};

	// 채팅창 생성
	const onClickCreateRoom = (event: MouseEvent<HTMLElement>) => {
		// TODO: 모달 생성
		alert("채팅창 모달");
	};

	return (
		<div className={container}>
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
					<div onClick={onClickCreateRoom}>
						<CiCirclePlus
							className={createButton}
							title="채팅방 생성"
						/>
					</div>
				</div>
				{searchRooms === null ? (
					"검색된 채팅방 없음"
				) : (
					<>
						<Rooms
							isMine={false}
							rooms={searchRooms[searchCurPage - 1]}
						/>
						{testSearch.totalRoomCount > 2 ? (
							<Pagenation
								total={testSearch.totalRoomCount}
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
				{myRooms === null ? (
					"내 채팅방 없음"
				) : (
					<>
						<Rooms
							isMine={true}
							rooms={myRooms[myCurPage - 1]}
						/>
						{testMy.totalRoomCount > 2 ? (
							<Pagenation
								total={testMy.totalRoomCount}
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
