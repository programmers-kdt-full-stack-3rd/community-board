import { IMessage } from "shared";

import { getRedis } from "../utils/redis";

// 캐시 조회
const getMessages = async (roomId: number): Promise<IMessage[]> => {
	try {
		const redis = getRedis();
		const key = `room:${roomId}:messages`;

		const data = await redis.zRange(key, 0, -1); // 조회

		return data.length ? data.map(msg => JSON.parse(msg)) : [];
	} catch (error) {
		throw new Error("Redis 조회 실패");
	}
};

// 캐시 저장
const setMessages = async (
	roomId: number,
	messages: IMessage[]
): Promise<void> => {
	try {
		const redis = getRedis();
		const key = `room:${roomId}:messages`;

		for (const message of messages) {
			const value = JSON.stringify(message);
			const score = new Date(message.createdAt).getTime(); // 점수: 생성된 시간

			await redis.zAdd(key, [{ score, value }]);
		}
	} catch (error) {
		throw new Error("Redis 저장 실패");
	}
};

export { getMessages, setMessages };
