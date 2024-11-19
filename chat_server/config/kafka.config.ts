import { Kafka, logLevel } from "kafkajs";

// 동적 import
process.env.NODE_ENV !== "production" &&
	require("dotenv").config({ path: "./../.env" });

const kafka = new Kafka({
	clientId: "chat-producer-1",
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

export default kafka;
