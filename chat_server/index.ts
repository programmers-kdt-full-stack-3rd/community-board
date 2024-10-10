import httpServer from "./app";
import { port } from "./config";
import { initKafkaProducer } from "./utils/kafka";
import { initRedis } from "./utils/redis";

const startServer = async () => {
	try {
		// Redis 초기화
		await initRedis();

		// Kafka Producer 초기화
		await initKafkaProducer();

		// 채팅 서버 실행
		httpServer.listen(port, () => {
			console.log(`채팅 서버 ${port}에서 실행 중`);
		});
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

startServer();
