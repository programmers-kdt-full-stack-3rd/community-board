import { KafkaConfig } from "kafkajs";
import { PoolOptions } from "mysql2/promise";

import dbConfig from "./db.config";
import { kafkaConfig, consumerConfig } from "./kafka.config";

// 동적 import
process.env.NODE_ENV !== "production" &&
	require("dotenv").config({ path: "./../.env" });

interface IConsumerConfig {
	readonly host?: string;
	readonly db: PoolOptions;
	readonly kafka: KafkaConfig;
	readonly consumer: Object;
}

const config: IConsumerConfig = Object.freeze({
	host: process.env.DOCKER_HOST_IP,
	db: dbConfig,
	kafka: kafkaConfig,
	consumer: consumerConfig,
});

// console.log(config.db);

export default config;
