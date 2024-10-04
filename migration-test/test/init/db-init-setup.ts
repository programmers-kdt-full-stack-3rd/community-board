import fs from "fs/promises";
import mysql from "mysql2/promise";
import path from "path";

interface DatabaseConfig {
	host: string;
	port: number;
	user: string;
	password: string;
	database: string;
}

async function initializeDatabase(): Promise<void> {
	const connections: DatabaseConfig[] = [
		{
			host: "localhost",
			port: 3307,
			user: "codeplay_user",
			password: "codeplay123",
			database: "community_board_express",
		},
		{
			host: "localhost",
			port: 3308,
			user: "codeplay_user",
			password: "codeplay123",
			database: "community_board_nest",
		},
	];

	for (const config of connections) {
		const connection = await mysql.createConnection(config);
		try {
			const script = await fs.readFile(
				path.join(__dirname, "init-db.sql"),
				"utf8"
			);
			const queries = script
				.split(";")
				.filter(query => query.trim() !== "");

			for (const query of queries) {
				await connection.query(query);
			}
			console.log(`Database ${config.database} initialized successfully`);
		} catch (error) {
			console.error(
				`Error initializing database ${config.database}:`,
				error instanceof Error ? error.message : String(error)
			);
		} finally {
			await connection.end();
		}
	}
}

export default initializeDatabase;
