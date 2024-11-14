import { RedisClientType } from "redis";
import { IMessage } from "shared";

// 캐시 조회
export const getMessages = async (
	roomId: number,
	redisClient: RedisClientType
): Promise<IMessage[]> => {
	try {
		const key = `room:${roomId}:messages`;

		const data = await redisClient.zRange(key, 0, -1); // 조회

		return data.length ? data.map(msg => JSON.parse(msg)) : [];
	} catch (error) {
		throw new Error("Redis 조회 실패");
	}
};

// 캐시 저장
export const setMessages = async (
	roomId: number,
	messages: IMessage[],
	redisClient: RedisClientType
): Promise<void> => {
	try {
		const key = `room:${roomId}:messages`;

		for (const message of messages) {
			const value = JSON.stringify(message);
			const score = new Date(message.createdAt!).getTime(); // 점수: 생성된 시간

			await redisClient.zAdd(key, [{ score, value }]);
		}
	} catch (error) {
		throw new Error("Redis 저장 실패");
	}
};
