import {
	connectConsumer,
	subscribeConsumer,
	processMessage,
} from "./services/kafkaService";

const startServer = async () => {
	try {
		// Kafka Consumer 연결
		await connectConsumer();
		console.log("Kafka Consumer 연결 성공");

		// chat 구독
		await subscribeConsumer("chat");
		console.log("Kafka Chat 구독 성공");

		await processMessage();
		console.log("Kafka Consumer 메시지 수신 중");
	} catch (error) {
		console.error("Error starting the Kafka Consumer", error);
	}
};

startServer();
