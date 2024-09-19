import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { initializeTransactionalContext } from "typeorm-transactional";
import { AppModule } from "./app.module";
import { ServerError } from "./common/exceptions/server-error.exception";
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter";

async function bootstrap() {
	initializeTransactionalContext();

	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(
		new ValidationPipe({
			disableErrorMessages: true,
			exceptionFactory: errors => {
				const errorMessage = Object.values(errors[0].constraints)[0];
				throw ServerError.badRequest(errorMessage);
			},
		})
	);

	app.useGlobalFilters(new GlobalExceptionFilter());
	app.use(cookieParser());
	app.setGlobalPrefix("api");

	const configService = app.get(ConfigService);
	const port = configService.get("app.port");
	await app.listen(port);
}
bootstrap();
