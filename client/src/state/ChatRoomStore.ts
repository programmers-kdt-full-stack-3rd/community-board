import { IMessage, IRoomHeader } from "shared";
import { StateCreator, create } from "zustand";
import { PersistOptions, persist } from "zustand/middleware";
import { RoomsInfo } from "../component/Chats/ChatRooms/ChatRooms";

interface IChatRoomState {
	myRoomInfo: RoomsInfo;
	chatRoomMessageLogs: {
		[key: number]: IMessage[];
	};
}

interface IChatRoomActions {
	setMyRoomInfo: (
		totalRoomCount: number,
		currentPage: number,
		roomHeaders: IRoomHeader[]
	) => void;
	setMessageLogByRooms: (roomId: number, messageLogs: IMessage[]) => void;
	updateMessageLogByRoom: (roomId: number, message: IMessage) => void;
}

export interface TChatRoomStore extends IChatRoomState, IChatRoomActions {}

export type ChatRoomStatePersist = (
	config: StateCreator<TChatRoomStore>,
	options: PersistOptions<IChatRoomState>
) => StateCreator<TChatRoomStore>;

export const useChatRoom = create<TChatRoomStore>(
	(persist as ChatRoomStatePersist)(
		set => ({
			myRoomInfo: {
				totalRoomCount: 0,
				rooms: {},
			},
			chatRoomMessageLogs: {},
			setMyRoomInfo: (
				totalRoomCount: number,
				currentPage: number,
				roomHeaders: IRoomHeader[]
			) =>
				set(state => ({
					...state,
					myRoomInfo: {
						totalRoomCount: totalRoomCount,
						rooms: {
							...state.myRoomInfo.rooms,
							[currentPage]: roomHeaders,
						},
					},
				})),
			setMessageLogByRooms: (roomId: number, messageLogs: IMessage[]) =>
				set(state => {
					return {
						...state,
						chatRoomMessageLogs: {
							[roomId]: messageLogs.sort(
								(a, b) =>
									new Date(a.createdAt).getTime() -
									new Date(b.createdAt).getTime()
							),
						},
					};
				}),
			updateMessageLogByRoom: (roomId: number, message: IMessage) =>
				set(state => {
					return {
						...state,
						chatRoomMessageLogs: {
							...state.chatRoomMessageLogs,
							[roomId]: [
								...state.chatRoomMessageLogs[roomId],
								message,
							].sort(
								(a, b) =>
									new Date(a.createdAt).getTime() -
									new Date(b.createdAt).getTime()
							),
						},
					};
				}),
		}),
		{
			name: "ChatRoomStore",
			partialize: state => ({
				myRoomInfo: state.myRoomInfo,
				chatRoomMessageLogs: state.chatRoomMessageLogs,
			}),
		}
	)
);
