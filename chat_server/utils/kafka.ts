import { Producer } from "kafkajs";

import { kafka } from "../config";

/**
 * Producer 싱글톤 관리
 */
let producer: Producer | null = null;

/**
 * Init Producer
 */
const initKafkaProducer = async () => {
	try {
		if (!producer) {
			producer = kafka.producer();
			await producer.connect();
			console.log("Kafka Producer 연결 성공");
		}
	} catch (error) {
		throw new Error("Kafka Producer 연결 실패");
	}
};

/**
 * Get Producer
 * @returns producer
 */
const getKafkaProducer = () => {
	if (!producer) throw new Error("Kafka Producer 초기화 필요");
	return producer;
};

export { initKafkaProducer, getKafkaProducer };
