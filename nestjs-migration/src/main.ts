import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { ConfigService } from "@nestjs/config";
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalFilters(new GlobalExceptionFilter());
	app.use(cookieParser());
	app.setGlobalPrefix("api");
	const configService = app.get(ConfigService);
	const port = configService.get("app.port");
	await app.listen(port);
}
bootstrap();
