import { IKafkaMessageDTO } from "shared";
import { Kafka, Producer } from "kafkajs";

/**
 * Kafka Producer 객체
 */
let producer: Producer | null = null;

/**
 * init Kafka Producer
 */
const initProducer = (kafka: Kafka) => {
	// TODO: 최적화 필요
	producer = kafka.producer();
};

/**
 * get Kafka Producer
 */
const getProducer = (): Producer => {
	if (producer === null) {
		throw new Error("Kafka Producer is null");
	}

	return producer;
};

/**
 * Kafka 송신 메서드
 */

// Kafka로 message 송신
const sendMessage = async (messageDTO: IKafkaMessageDTO) => {
	const { userId, roomId, message, createdAt, isSystem } = messageDTO;

	const timestamp = new Date(createdAt).getTime().toString();

	if (producer === null) {
		throw new Error("Kafka Producer is null");
	}

	await producer.send({
		topic: "chat", // 토픽 이름
		messages: [
			{
				key: JSON.stringify({ roomId, userId }), // message key
				value: JSON.stringify({ message, isSystem }), // message value (Buffer | string | null)
				timestamp, // string 형식의 시간 데이터
			},
		],
		acks: -1, // 리더와 모든 팔로워 파티션이 메시지를 기록했을 때 성공
		timeout: 10000, // ack에 대한 timeout
	});
};

export { initProducer, getProducer, sendMessage };
