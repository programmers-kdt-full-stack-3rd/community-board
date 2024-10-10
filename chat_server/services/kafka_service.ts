import { Message } from "kafkajs";

import { getKafkaProducer } from "../utils/kafka";

/**
 * message 송신 메서드
 * @param topic
 * @param message
 */
const sendMessage = async (topic: string, message: Message) => {
	try {
		const producer = getKafkaProducer();

		await producer.send({
			topic,
			messages: [message],
			acks: -1, // 리더와 모든 팔로워 파티션이 메시지를 기록했을 때 성공
			timeout: 10000, // ack에 대한 timeout
		});
		console.log(
			`메시지 전송 성공\ntopic: ${topic}\nmessage: ${message.value}`
		);
	} catch (error) {
		throw new Error("kafka 메시지 전송 오류");
	}
};

export { sendMessage };
