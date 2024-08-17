import kafka from "../config/kafka_config";
import { ISendMessageRequest } from "../types/message";

/**
 * Kafka Producer 객체
 */
const producer = kafka.producer();

/**
 * Kafka 송신 메서드
 */

// Kafka Producer 연결
const connectProducer = async () => {
	await producer.connect();
};

// Kafka로 message 송신
const sendMessage = async (params: ISendMessageRequest) => {
	const { roomId, nickname, message, created_at } = params;

	await producer.send({
		topic: "chat", // 토픽 이름
		messages: [
			{
				key: roomId, // message key
				value: JSON.stringify({ nickname, message }), // message value (Buffer | string | null)
				timestamp: created_at.getTime().toString(), // ISO 형식의 시간 데이터
			},
		],
		acks: -1, // 리더와 모든 팔로워 파티션이 메시지를 기록했을 때 성공
		timeout: 10000, // ack에 대한 timeout
	});
};

export { connectProducer, sendMessage };
