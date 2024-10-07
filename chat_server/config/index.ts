import kafka from "./kafka_config";
import redis from "./redis_config";

// 동적 import
process.env.NODE_ENV !== "production" &&
	require("dotenv").config({ path: "./../.env" });

const host = process.env.DOCKER_HOST_IP;
const port = process.env.CHAT_PORT;

export { host, port, kafka, redis };
