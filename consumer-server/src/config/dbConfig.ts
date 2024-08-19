import dotenv from "dotenv";
import mariaDB, { PoolOptions } from "mysql2/promise";

dotenv.config();

const isDev = !process.env.DOCKER_HOST_IP;

const port = process.env.DB_PORT | 3306;
const config: PoolOptions = {
	connectionLimit: 1000,
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	database: process.env.DB_NAME,
	password: process.env.DB_PSWORD,
	port: port,
	multipleStatements: true,
};
const pool = mariaDB.createPool(config);

export default pool;
