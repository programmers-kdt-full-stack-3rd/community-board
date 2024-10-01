import { EachMessagePayload, Kafka } from "kafkajs";

import config from "../config";
import { processChatMessage } from "../services/chat.service";

const kafka = new Kafka(config.kafka);

const chatConsumer = kafka.consumer({
	groupId: "chat-group",
	...config.consumer,
});

const startConsumers = async () => {
	try {
		// chat 토픽 컨슈머 연결
		console.log("Kafka chat consumer 연결 중...");
		await chatConsumer.connect();
		await chatConsumer.subscribe({ topic: "chat", fromBeginning: false }); // offset 커밋 이후의 메시지부터 읽어서 DB에 저장
		await chatConsumer.run({
			eachMessage: async (payload: EachMessagePayload) => {
				try {
					await processChatMessage(payload);

					// 메시지가 성공적으로 저장되면 수동으로 offset 커밋
					await chatConsumer.commitOffsets([
						{
							topic: payload.topic,
							partition: payload.partition,
							offset: (
								parseInt(payload.message.offset, 10) + 1
							).toString(), // 다음 메시지를 위해 offset + 1
						},
					]);
				} catch (error) {
					console.error("메시지 처리 중 오류 발생:", error);
				}
			},
		});
	} catch (error) {
		console.error("Kafka consumer 시작 중 오류 발생:", error);
	}
};

export { startConsumers };
