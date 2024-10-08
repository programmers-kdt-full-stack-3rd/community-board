import { Controller, Get } from "@nestjs/common";
import {
	HealthCheck,
	HealthCheckService,
	HttpHealthIndicator,
	TypeOrmHealthIndicator,
} from "@nestjs/terminus";

@Controller("health")
export class HealthController {
	constructor(
		private readonly healthCheckService: HealthCheckService,
		private readonly httpHealthIndicator: HttpHealthIndicator,
		private readonly typeOrmHealthIndicator: TypeOrmHealthIndicator
	) {}

	@Get()
	@HealthCheck()
	check() {
		this.healthCheckService.check([
			() =>
				this.httpHealthIndicator.pingCheck(
					"nestjs-docss",
					"https://docs.nestjs.com"
				),
			() => this.typeOrmHealthIndicator.pingCheck("database"),
		]);
	}
}
