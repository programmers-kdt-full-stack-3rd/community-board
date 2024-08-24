import { Consumer, EachMessagePayload, Kafka } from "kafkajs";

import { insertMessage } from "./messageService";

/**
 * Kafka Consumer 객체
 */
let consumer: Consumer | null = null;

/**
 * init Kafka Consumer
 */
const initConsumer = (kafka: Kafka, groupId: string) => {
	if (consumer === null) {
		// TODO: 최적화 필요
		consumer = kafka.consumer({
			groupId, // 컨슈머 그룹 식별자 ID, 동일한 그룹은 같은 파티션 공유 및 메시지 병렬 처리
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
	}
};

/**
 * get Kafka Consumer
 */
const getConsumer = (): Consumer => {
	if (consumer === null) {
		throw new Error("Kafka Consumer is null");
	}

	return consumer;
};

/**
 * Kafka 수신 메서드
 */
const processMessage = async ({
	message: { key, value, timestamp, offset },
}: EachMessagePayload) => {
	// key랑 value가 null이면 error
	if (key === null || value === null) {
		throw Error("데이터가 없습니다.");
	}

	const memberId = parseInt(key!.toString());
	const { message, isSystem } = JSON.parse(value!.toString());

	insertMessage({
		memberId,
		message,
		createdAt: new Date(parseInt(timestamp)),
		isSystem,
	});
};

// TODO: 해당 서버 장애 시 카프카에 남아있는 모든 메시지 DB에 저장하는 함수

export { initConsumer, getConsumer, processMessage };
