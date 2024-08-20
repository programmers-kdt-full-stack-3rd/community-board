import { RedisClientType } from "redis";
import { IRedisMessageDTO, IRedisRoomDTO } from "shared";

/**
 * 저장
 */

// 채팅방
const addRoom = async (
	client: RedisClientType,
	{ roomId, name, password, isPrivate, messages, members }: IRedisRoomDTO
) => {
	// 채팅방 이름 및 비밀번호
	await client.hSet(`room:${roomId}:info`, {
		name,
		password: password || "",
		isPrivate: `${isPrivate}`,
	});

	// 메시지
	for (const message of messages) {
		await addMessage(client, roomId, message);
	}

	// 접속
	for (const [userId, socketSet] of members) {
		for (const socketId of socketSet) {
			addConnect(client, roomId, userId, socketId);
		}
	}
};

// 메시지
const addMessage = async (
	client: RedisClientType,
	roomId: number,
	message: IRedisMessageDTO
) => {
	await client.lPush(`room:${roomId}:messages`, JSON.stringify(message));
};

// 접속
const addConnect = async (
	client: RedisClientType,
	roomId: number,
	userId: number,
	socketId: string
) => {
	await client.sAdd(`room:${roomId}:members:${userId}`, socketId);
};

/**
 * 조회
 */

// 채팅방
const getRoom = async (client: RedisClientType, roomId: number) => {
	// 채팅방 이름 및 비밀번호
	const roomInfo = await client.hGetAll(`room:${roomId}:info`);
	if (Object.keys(roomInfo).length === 0) return null; // miss

	// 메시지
	const messages = await getMessages(client, roomId);

	// 참여자 및 접속자 수
	const { memberNum, connectNum } = await getMemberAndConnectNum(
		client,
		roomId
	);

	return {
		roomId,
		name: roomInfo.name,
		isPrivate: roomInfo.isPrivate === "true",
		password: roomInfo.isPrivate === "true" ? roomInfo.password : undefined,
		messages,
		memberNum,
		connectNum,
	};
};

// 특정 채팅방 메시지
const getMessages = async (
	client: RedisClientType,
	roomId: number
): Promise<IRedisMessageDTO[]> => {
	const messagesData = await client.lRange(`room:${roomId}:messages`, 0, -1);
	return messagesData.map(msg => JSON.parse(msg) as IRedisMessageDTO);
};

// 참여자 및 접속자 수
const getMemberAndConnectNum = async (
	client: RedisClientType,
	roomId: number
) => {
	// 참여자 수
	const membersKey = await client.keys(`room:${roomId}:members:*`);
	const memberNum = membersKey.length;

	// 접속자 수
	const connectNum = membersKey.filter(
		async key => (await client.sMembers(key)).length > 0
	).length;

	return { memberNum, connectNum };
};

/**
 * 삭제
 */

// 참여자
const deleteMember = async (
	client: RedisClientType,
	roomId: number,
	userId: number
) => {
	await client.del(`room:${roomId}:members:${userId}`);
};

// 접속
const deleteConnect = async (
	client: RedisClientType,
	roomId: number,
	userId: number,
	socketId: string
) => {
	await client.sRem(`room:${roomId}:members:${userId}`, socketId);
};

export {
	addConnect,
	addMessage,
	addRoom,
	deleteConnect,
	deleteMember,
	getMemberAndConnectNum,
	getMessages,
	getRoom,
};
