import dotenv from "dotenv";
import mariaDB, { Pool, PoolOptions } from "mysql2/promise";

dotenv.config();

/**
 * DB Pool 객체
 */
let pool: Pool | null = null;

/**
 * init DB Pool
 */
const initDBPool = (config: PoolOptions): void => {
	if (pool === null) {
		pool = mariaDB.createPool({
			...config,
			connectionLimit: 1000,
			multipleStatements: true,
		});
		console.log("DB Pool 생성");
	}
};

/**
 * get DB Pool
 */
const getDBPool = () => {
	if (!pool) {
		throw new Error("DB Pool is null");
	}
	return pool;
};

export { getDBPool, initDBPool };
