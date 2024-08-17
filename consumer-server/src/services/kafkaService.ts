import kafka from "../config/kafkaConfig";

/**
 * Kafka Consumer 객체
 * TODO: 최적화 필요
 */
const consumer = kafka.consumer({
	groupId: "chat-db-group", // 컨슈머 그룹 식별자 ID, 동일한 그룹은 같은 파티션 공유 및 메시지 병렬 처리
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

/**
 * Kafka 수신 메서드
 */

// Kafka Consumer 연결
const connectConsumer = async () => {
	await consumer.connect();
};

// Kafka topic 구독
const subscribeConsumer = async (topic: string) => {
	await consumer.subscribe({ topic, fromBeginning: false });
};

// Kafka message 수신 처리
const processMessage = async () => {
	await consumer.run({
		eachMessage: async ({ message: { key, value, timestamp, offset } }) => {
			const roomId = key;
			const { nickname, message } = JSON.parse(value!.toString());

			// TEST: 추후에 삭제할 것
			console.log(
				`consume message: roomId: ${roomId}, nickname: ${nickname},message: ${message}, timestamp: ${timestamp}`
			);

			// TODO: DB Access Layer
		},
	});
};

export { connectConsumer, subscribeConsumer, processMessage };
