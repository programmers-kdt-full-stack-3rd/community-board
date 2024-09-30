import pool from "./models";
import { startConsumers } from "./kafka";

const startServer = async () => {
	try {
		// DB 연결 테스트
		const conn = await pool.getConnection();
		console.log("DB 연결 성공");
		conn.release();

		// Kafka Consumer 실행
		await startConsumers();
		console.log("Kafka Consumer 연결 성공");
	} catch (error) {
		console.error("서버 초기화 중 오류 발생:", error);
	}
};

startServer();
