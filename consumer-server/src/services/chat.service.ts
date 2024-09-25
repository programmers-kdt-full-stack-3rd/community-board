import { EachMessagePayload } from "kafkajs";

import { insertMessage } from "../models/chat.model";

const processChatMessage = async ({
	message: { key, value, timestamp },
}: EachMessagePayload) => {
	// key랑 value가 null이면 error
	if (key === null || value === null) {
		throw Error("데이터가 없습니다.");
	}

	const memberId = parseInt(key!.toString());
	const { message, isSystem } = JSON.parse(value!.toString());

	await insertMessage({
		memberId,
		message,
		createdAt: new Date(parseInt(timestamp)),
		isSystem,
	});
};

export { processChatMessage };
