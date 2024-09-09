import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

// 공통 데이터베이스 설정
const dbCommonConfig = () => ({
	host: process.env.DB_HOST,
	port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
	username: process.env.DB_USER,
	password: process.env.DB_PSWORD,
	database: process.env.DB_NAME,
});

// mysql2용 설정
export const dbConfig = registerAs("db", () => ({
	...dbCommonConfig(),
	connectionLimit: 10,
}));

// TypeORM용 설정
export const typeOrmConfig = registerAs(
	"typeorm",
	(): TypeOrmModuleOptions => ({
		type: "mariadb",
		...dbCommonConfig(),
		entities: [__dirname + "/../**/*.entity{.ts,.js}"],
		synchronize: process.env.NODE_ENV === "development",
	})
);
