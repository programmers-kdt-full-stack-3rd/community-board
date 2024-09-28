import { Test, TestingModule } from "@nestjs/testing";
import { IUserLogResponse } from "shared";
import { GetLogQueryDto } from "./dto/get-log-query.dto";
import { LogRepository } from "./log.repository";
import { LogService } from "./log.service";

describe("LogService", () => {
	let logService: LogService;
	let logRepository: LogRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				LogService,
				{
					provide: LogRepository,
					useValue: {
						getLogs: jest.fn(),
					},
				},
			],
		}).compile();

		logService = module.get<LogService>(LogService);
		logRepository = module.get<LogRepository>(LogRepository);
	});

	it("should be defined", () => {
		expect(logService).toBeDefined();
	});

	describe("getLogs", () => {
		const getLogQueryDto = new GetLogQueryDto();
		const mockLogs: IUserLogResponse = {
			total: 1,
			logs: [
				{
					title: "test",
					category: "게시글",
					createdAt: new Date("2024-01-01"),
				},
			],
		};

		it("성공적으로 로그를 가져온다.", async () => {
			const userId = 1;
			getLogQueryDto.index = 5;

			jest.spyOn(logRepository, "getLogs").mockResolvedValue(mockLogs);
			const result = await logService.getLogs(getLogQueryDto, userId);

			expect(logRepository.getLogs).toHaveBeenCalledWith(
				{
					index: 4,
					perPage: 10,
				},
				userId
			);
			expect(result).toEqual(mockLogs);
		});

		it("성공적으로 로그를 가져온다. (index < 1)", async () => {
			const userId = 1;
			getLogQueryDto.index = 0;

			jest.spyOn(logRepository, "getLogs").mockResolvedValue(mockLogs);
			const result = await logService.getLogs(getLogQueryDto, userId);

			expect(logRepository.getLogs).toHaveBeenCalledWith(
				{
					index: 0,
					perPage: 10,
				},
				userId
			);
			expect(result).toEqual(mockLogs);
		});

		it("성공적으로 로그를 가져온다. (perPage < 0)", async () => {
			const userId = 1;
			getLogQueryDto.perPage = -1;

			jest.spyOn(logRepository, "getLogs").mockResolvedValue(mockLogs);
			const result = await logService.getLogs(getLogQueryDto, userId);

			expect(logRepository.getLogs).toHaveBeenCalledWith(
				{
					index: 0,
					perPage: 10,
				},
				userId
			);

			expect(result).toEqual(mockLogs);
		});
	});
});
