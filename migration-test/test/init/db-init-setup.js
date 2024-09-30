const mysql = require("mysql2/promise");
const path = require("path");
const fs = require("fs").promises;

async function initializeDatabase() {
	const connections = [
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
				error
			);
		} finally {
			await connection.end();
		}
	}
}

module.exports = initializeDatabase;
