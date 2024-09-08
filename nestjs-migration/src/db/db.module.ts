import { Module } from "@nestjs/common";
import { DatabaseService } from "./db.service";
import dbConfig from "../config/db.config";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [ConfigModule.forFeature(dbConfig)],
	providers: [DatabaseService],
	exports: [DatabaseService],
})
export class DbModule {}
