import { registerAs } from "@nestjs/config";

export default registerAs("db", () => ({
	host: process.env.DB_HOST,
	port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
	username: process.env.DB_USER,
	password: process.env.DB_PSWORD,
	database: process.env.DB_NAME,
}));
