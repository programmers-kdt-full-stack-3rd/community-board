import { KafkaConfig, logLevel } from "kafkajs";

// 동적 import
process.env.NODE_ENV !== "production" &&
	require("dotenv").config({ path: "./../.env" });

const kafkaConfig: KafkaConfig = Object.freeze({
	clientId: "chat-group1-consumer1",
	brokers: [
		`${process.env.DOCKER_HOST_IP}:${process.env.KAFKA_PORT_1}`,
		`${process.env.DOCKER_HOST_IP}:${process.env.KAFKA_PORT_2}`,
		`${process.env.DOCKER_HOST_IP}:${process.env.KAFKA_PORT_3}`,
	],
	logLevel: logLevel.NOTHING, // Console의 log 수준 (현재 값: NOTHING)
	retry: {
		maxRetryTime: 10000, // 최대 재시도 시간
		initialRetryTime: 300, // 처음 재시도까지 대기 시간 (ms)
		retries: 5, // 최대 재시도 횟수
		factor: 1.5, // 재시도 대기시간에 대한 배수, 다음 재시도는 이전 재시도 대기 시간의 factor를 곱한 시간
		multiplier: 1, // factor에 대한 배수
	},
});

const consumerConfig = Object.freeze({
	sessionTimeout: 30000, // 30초, 컨슈머 그룹이 해당 클라이언트가 연결을 끊었다고 간주하 전 대기 시간
	heartbeatInterval: 3000, // 3초, 브로커와의 연결을 확인하는 대기 시간
	retry: {
		maxRetryTime: 10000, // 최대 재시도 시간
		initialRetryTime: 100, // 처음 재시도까지 대기 시간 (ms)
		retries: 5, // 최대 재시도 횟수
		factor: 1.5, // 재시도 대기시간에 대한 배수, 다음 재시도는 이전 재시도 대기 시간의 factor를 곱한 시간
		multiplier: 1.2, // factor에 대한 배수
	},
	maxInFlightRequests: 1, // 컨슈머 최대 처리 요청 수
});

export { kafkaConfig, consumerConfig };
