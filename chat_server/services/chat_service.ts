import { IKafkaMessageDTO } from "shared";

import { sendMessage } from "./kafka_service";

const processMessage = async (dto: IKafkaMessageDTO) => {
	try {
		const { memberId, message, createdAt, isSystem } = dto;
		const timestamp = createdAt.getTime().toString();

		await sendMessage("chat", {
			key: `${memberId}`, // member Id
			value: JSON.stringify({ message, isSystem }), // message value (Buffer | string | null)
			timestamp, // string 형식의 시간 데이터
		});
	} catch (error) {
		console.log(error);
		throw new Error("message 처리 중 오류");
	}
};

export { processMessage };
