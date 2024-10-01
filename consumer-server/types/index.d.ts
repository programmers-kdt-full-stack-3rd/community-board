import { KafkaConfig } from "kafkajs";
import { PoolOptions } from "mysql2/promise";

declare interface IConsumerConfig {
	readonly host?: string;
	readonly db: PoolOptions;
	readonly kafka: KafkaConfig;
}
