import { Inject, Injectable, OnModuleDestroy } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { createPool, Pool, PoolConnection } from "mysql2/promise";
import dbConfig from "../config/db.config";

@Injectable()
export class DatabaseService implements OnModuleDestroy {
	private connection: Pool;

	constructor(
		@Inject(dbConfig.KEY)
		private config: ConfigType<typeof dbConfig>
	) {
		this.initializeConnection();
	}

	private initializeConnection() {
		const dbConfig = this.config;
		this.connection = createPool({
			host: dbConfig.host,
			user: dbConfig.username,
			password: dbConfig.password,
			database: dbConfig.database,
			port: dbConfig.port,
			connectionLimit: 10,
		});
	}

	getConnection(): Pool {
		return this.connection;
	}

	async withConnection<T>(
		operation: (conn: PoolConnection) => Promise<T>
	): Promise<T> {
		const conn = await this.connection.getConnection();
		try {
			return await operation(conn);
		} catch (err) {
			throw err;
		} finally {
			conn.release();
		}
	}

	async withTransaction<T>(
		operation: (conn: PoolConnection) => Promise<T>
	): Promise<T> {
		const conn = await this.connection.getConnection();
		await conn.beginTransaction();
		try {
			const result = await operation(conn);
			await conn.commit();
			return result;
		} catch (err) {
			await conn.rollback();
			throw err;
		} finally {
			conn.release();
		}
	}

	async onModuleDestroy() {
		await this.connection.end();
	}
}
