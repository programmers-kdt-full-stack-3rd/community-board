import mariaDB from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: "./../.env" });

const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306;
const config = {
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
