import { IMessage, IRoomHeader } from "shared";
import { StateCreator, create } from "zustand";
import { PersistOptions, persist } from "zustand/middleware";
import { RoomsInfo } from "../component/Chats/ChatRooms/ChatRooms";

interface IChatRoomState {
	myRoomInfo: RoomsInfo;
	chatRoomMessageLogs: Map<number, IMessage[]>;
}

interface IChatRoomActions {
	setMyRoomInfo: (
		totalRoomCount: number,
		currentPage: number,
		roomHeaders: IRoomHeader[]
	) => void;
	setMessageLogByRooms: (roomId: number, messageLogs: IMessage[]) => void;
	updateMessageLogByRoom: (roomId: number, message: IMessage) => void;
	initializeChatState: () => void;
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
			chatRoomMessageLogs: new Map<number, IMessage[]>(),
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
					const newChatRoomMessageLogs = new Map(
						state.chatRoomMessageLogs
					);
					newChatRoomMessageLogs.set(roomId, messageLogs);
					return {
						...state,
						chatRoomMessageLogs: newChatRoomMessageLogs,
					};
				}),
			updateMessageLogByRoom: (roomId: number, message: IMessage) =>
				set(state => {
					const newChatRoomMessageLogs = new Map(
						state.chatRoomMessageLogs
					);
					const existingMessages =
						newChatRoomMessageLogs.get(roomId) || [];
					newChatRoomMessageLogs.set(roomId, [
						...existingMessages,
						message,
					]);
					return {
						...state,
						chatRoomMessageLogs: newChatRoomMessageLogs,
					};
				}),
			initializeChatState: () =>
				set(state => ({
					...state,
					myRoomInfo: {
						totalRoomCount: 0,
						rooms: {},
					},
					chatRoomMessageLogs: new Map<number, IMessage[]>(),
				})),
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
