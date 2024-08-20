import { IKafkaMessageDTO } from "shared";

import { sendMessage } from "./services/kafka_service";

// TEST START: 추후 지울 것! (Kafka로 message 보내기)
export const test = () => {
	const testMessage: IKafkaMessageDTO = {
		roomId: 1,
		userId: 1,
		message: "test입니다.",
		createdAt: new Date(),
		isSystem: true,
	};
	console.log(
		`
    producer message:
    roomId: ${testMessage.roomId}
    userId: ${testMessage.userId}
    message: ${testMessage.message}
    createdAt: ${testMessage.createdAt}
    isSystem: ${testMessage.isSystem}
                `
	);
	sendMessage(testMessage);
};
// TEST END
