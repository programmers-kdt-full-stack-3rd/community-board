import { IReadRoomResponse } from "shared";

export const testSearch: IReadRoomResponse = {
	totalRoomCount: 3,
	roomHeaders: [
		{
			roomId: 1,
			title: "Room 1",
			totalMembersCount: 2,
			isPrivate: false,
			liveRoomInfo: {
				lastMessage: {
					roomId: 1,
					nickname: "user1",
					message: "Hello",
					createdAt: new Date(),
					isMine: true,
					isSystem: false,
				},
				curNum: 1,
				newMessages: 0,
			},
		},
		{
			roomId: 2,
			title: "Room 2",
			totalMembersCount: 3,
			isPrivate: true,
			liveRoomInfo: {
				lastMessage: {
					roomId: 2,
					nickname: "user2",
					message: "Hello2",
					createdAt: new Date(),
					isMine: true,
					isSystem: false,
				},
				curNum: 1,
				newMessages: 0,
			},
		},
		{
			roomId: 3,
			title: "Room 3",
			totalMembersCount: 4,
			isPrivate: false,
			liveRoomInfo: {
				lastMessage: {
					roomId: 3,
					nickname: "user3",
					message: "Hello3",
					createdAt: new Date(),
					isMine: true,
					isSystem: false,
				},
				curNum: 1,
				newMessages: 0,
			},
		},
	],
};

export const testMy: IReadRoomResponse = {
	totalRoomCount: 3,
	roomHeaders: [
		{
			roomId: 1,
			title: "Room 1",
			totalMembersCount: 2,
			isPrivate: false,
			liveRoomInfo: {
				lastMessage: {
					roomId: 1,
					nickname: "user1",
					message: "Hello",
					createdAt: new Date(),
					isMine: true,
					isSystem: false,
				},
				curNum: 1,
				newMessages: 0,
			},
		},
		{
			roomId: 2,
			title: "Room 2",
			totalMembersCount: 3,
			isPrivate: true,
			liveRoomInfo: {
				lastMessage: {
					roomId: 2,
					nickname: "user2",
					message: "Hello2",
					createdAt: new Date(),
					isMine: true,
					isSystem: false,
				},
				curNum: 1,
				newMessages: 0,
			},
		},
		{
			roomId: 3,
			title: "Room 3",
			totalMembersCount: 4,
			isPrivate: false,
			liveRoomInfo: {
				lastMessage: {
					roomId: 3,
					nickname: "user3",
					message: "Hello3",
					createdAt: new Date(),
					isMine: true,
					isSystem: false,
				},
				curNum: 1,
				newMessages: 0,
			},
		},
	],
};
