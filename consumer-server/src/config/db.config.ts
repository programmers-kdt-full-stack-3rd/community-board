import { PoolOptions } from "mysql2/promise";

// 동적 import
process.env.NODE_ENV !== "production" &&
	require("dotenv").config({ path: "./../.env" });

const dbConfig: PoolOptions = {
	host: process.env.DB_HOST!,
	port: parseInt(process.env.DB_PORT!, 10),
	user: process.env.DB_USER!,
	password: process.env.DB_PSWORD!,
	database: process.env.DB_NAME!,
	connectionLimit: 1000,
	multipleStatements: true,
};

export default dbConfig;
