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
import { IRoomHeader } from "shared";
import { testMy, testSearch } from "./test-case";
import CreateRoomModal from "./Modal/CreateRoomModal";

const ChatRooms: FC = () => {
	const [keyword, setKeyword] = useState<string>("");
	const [searchCurPage, setSearchCurPage] = useState<number>(1);
	const [myCurPage, setMyCurPage] = useState<number>(1);
	const [isOpen, setIsOpen] = useState(false);

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
