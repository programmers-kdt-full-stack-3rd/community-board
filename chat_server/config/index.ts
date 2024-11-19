import kafka from "./kafka.config";
import redis from "./redis.config";
import socket from "./socket.config";

// 동적 import
process.env.NODE_ENV !== "production" &&
	require("dotenv").config({ path: "./../.env" });

const host = process.env.DOCKER_HOST_IP;
const port = process.env.CHAT_PORT;

export { host, port, kafka, redis, socket };
