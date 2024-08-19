import { Kafka, logLevel } from "kafkajs";

/**
 * kafka API 객체
 */
let kafka: Kafka | null = null;

/**
 * init Kafka API
 */
const initKafkaAPI = (clientId: string, brokers: string[]): void => {
	kafka = new Kafka({
		clientId,
		brokers,
		logLevel: logLevel.NOTHING, // Console의 log 수준 (현재 값: NOTHING)
		retry: {
			maxRetryTime: 10000, // 최대 재시도 시간
			initialRetryTime: 300, // 처음 재시도까지 대기 시간 (ms)
			retries: 5, // 최대 재시도 횟수
			factor: 1.5, // 재시도 대기시간에 대한 배수, 다음 재시도는 이전 재시도 대기 시간의 factor를 곱한 시간
			multiplier: 1, // factor에 대한 배수
		},
	});
};

/**
 * get Kafka API
 */
const getKafkaAPI = (): Kafka => {
	if (kafka === null) {
		throw new Error("Kafka API is null");
	}

	return kafka;
};

export { initKafkaAPI, getKafkaAPI };
