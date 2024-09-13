import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { dbConfig } from "../config/db.config";
import { DatabaseService } from "./db.service";

@Module({
	imports: [ConfigModule.forFeature(dbConfig)],
	providers: [DatabaseService],
	exports: [DatabaseService],
})
export class DbModule {}
