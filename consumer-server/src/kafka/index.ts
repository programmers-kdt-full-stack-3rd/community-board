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
		await chatConsumer.subscribe({ topic: "chat", fromBeginning: false });
		await chatConsumer.run({
			eachMessage: async (payload: EachMessagePayload) => {
				try {
					await processChatMessage(payload);
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
