import { ChangeEvent, FC, FormEvent, MouseEvent, useState } from "react";
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

interface IRoomHeader {
	roomId: string;
	title: string;
	is_private: boolean;
	participantNum: number; // 채팅방에 속한 사람들
	curNum: number | null; // 현재 접속 중인 사람들
	lastMessage: string | null;
	// lastChatTime: Date | null;
}

interface IReadRoomResponse {
	totalRoomCount: number;
	roomHeaders: IRoomHeader[];
}

const ChatRooms: FC = () => {
	const [keyword, setKeyword] = useState<string>("");

	// test 용 state
	const [searchRooms, setSearchRooms] = useState<IReadRoomResponse>({
		totalRoomCount: 14,
		roomHeaders: [
			{
				roomId: "1",
				title: "test1",
				is_private: false,
				participantNum: 5,
				lastMessage: null,
				curNum: null,
			},
			{
				roomId: "2",
				title: "test2",
				is_private: true,
				participantNum: 5,
				lastMessage: null,
				curNum: null,
			},
		],
	});
	const [myRooms, setMyRooms] = useState<IReadRoomResponse>({
		totalRoomCount: 14,
		roomHeaders: [
			{
				roomId: "1",
				title: "test1",
				is_private: false,
				participantNum: 5,
				lastMessage: `1234`,
				curNum: 2,
			},
			{
				roomId: "2",
				title: "test2",
				is_private: true,
				participantNum: 5,
				lastMessage: `231123`,
				curNum: 3,
			},
		],
	});

	// 채팅 input Change
	const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		setKeyword(event.target.value);
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
				<Rooms
					isMine={false}
					rooms={searchRooms.roomHeaders}
				/>
			</div>
			<h3>내 채팅방</h3>
			<div className={roomsWrapper}>
				<Rooms
					isMine={true}
					rooms={myRooms.roomHeaders}
				/>
			</div>
		</div>
	);
};

export default ChatRooms;
