import { Test, TestingModule } from "@nestjs/testing";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { IUserEntity } from "../common/interface/user-entity.interface";
import { ServerError } from "../common/exceptions/server-error.exception";

describe("ChatController", () => {
	let chatController: ChatController;
	let chatService: ChatService;

	const mockChatService = {
		addRoom: jest.fn(),
		getRoomsBykeyword: jest.fn(),
		getRoomsByUserId: jest.fn(),
		getMessageLogs: jest.fn(),
		addUserToRoom: jest.fn(),
		enterUserToRoom: jest.fn(),
		leaveRoom: jest.fn(),
	};

	let mockUser: IUserEntity;
	let mockUserId: number;
	let mockRoomId: number;
	let mockMemberId: number;
	mockUserId = 1;
	mockMemberId = 1;
	mockRoomId = 2;
	mockUser = {
		userId: 1,
		roleId: 1,
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ChatController],
			providers: [
				{
					provide: ChatService,
					useValue: mockChatService,
				},
			],
		}).compile();

		chatController = module.get<ChatController>(ChatController);
		chatService = module.get<ChatService>(ChatService);
	});

	describe("POST /room", () => {
		const mockCreateRoomBodyDto = {
			title: "mock title",
			isPrivate: true,
			password: "nah",
		};
		it("채팅방 생성 성공", async () => {
			mockChatService.addRoom.mockResolvedValue(mockRoomId);

			const result = await chatController.handleRoomCreate(
				mockUser,
				mockCreateRoomBodyDto
			);

			expect(chatService.addRoom).toHaveBeenCalledWith({
				...mockCreateRoomBodyDto,
				userId: mockUser.userId,
			});
			expect(result).toEqual({
				roomId: mockRoomId,
			});
		});

		it("채팅방 생성 실패", async () => {
			mockChatService.addRoom.mockRejectedValue(new Error("mock error"));

			await expect(
				chatController.handleRoomCreate(mockUser, mockCreateRoomBodyDto)
			).rejects.toThrow(ServerError.reference("채팅방 생성 실패"));

			expect(chatService.addRoom).toHaveBeenCalledWith({
				...mockCreateRoomBodyDto,
				userId: mockUser.userId,
			});
		});
	});

	describe("GET /rooms", () => {
		describe("키워드 채팅방 목록 불러오기", () => {
			const mockReadRoomQueryDto = {
				isSearch: true,
				keyword: "mock keyword",
				page: 0,
				perPage: 2,
			};
			it("키워드를 이용해 채팅방 목록 불러오기 성공", async () => {
				mockChatService.getRoomsBykeyword.mockResolvedValue({
					totalRoomCount: 3,
					roomHeaders: [],
				});

				const result = await chatController.handleRoomsRead(
					mockReadRoomQueryDto,
					mockUser
				);

				expect(chatService.getRoomsBykeyword).toHaveBeenCalledWith(
					mockReadRoomQueryDto
				);

				expect(result).toEqual({
					totalRoomCount: 3,
					roomHeaders: [],
				});
			});
			it("키워드를 이용해 채팅방 목록 불러오기 실패", async () => {
				mockChatService.getRoomsBykeyword.mockRejectedValue(
					new Error("mock error")
				);

				await expect(
					chatController.handleRoomsRead(
						mockReadRoomQueryDto,
						mockUser
					)
				).rejects.toThrow(
					ServerError.reference("채팅방 불러오기 실패")
				);

				expect(chatService.getRoomsBykeyword).toHaveBeenCalledWith(
					mockReadRoomQueryDto
				);
			});
		});
		describe("사용자 아이디 채팅방 목록 불러오기", () => {
			const mockReadRoomQueryDto = {
				isSearch: false,
				keyword: "mock keyword",
				page: 0,
				perPage: 2,
			};
			it("USER_ID를 이용해 채팅방 목록 불러오기 성공", async () => {
				mockChatService.getRoomsByUserId.mockResolvedValue({
					totalRoomCount: 3,
					roomHeaders: [],
				});

				const { page, perPage } = mockReadRoomQueryDto;
				const readRoomByUserIdDto = {
					userId: mockUser.userId,
					page,
					perPage,
				};

				const result = await chatController.handleRoomsRead(
					mockReadRoomQueryDto,
					mockUser
				);

				expect(chatService.getRoomsByUserId).toHaveBeenCalledWith(
					readRoomByUserIdDto
				);

				expect(result).toEqual({
					totalRoomCount: 3,
					roomHeaders: [],
				});
			});
			it("USER_ID를 이용해 채팅방 목록 불러오기 실패", async () => {
				mockChatService.getRoomsByUserId.mockRejectedValue(
					new Error("mock error")
				);

				const { page, perPage } = mockReadRoomQueryDto;
				const readRoomByUserIdDto = {
					userId: mockUser.userId,
					page,
					perPage,
				};

				await expect(
					chatController.handleRoomsRead(
						mockReadRoomQueryDto,
						mockUser
					)
				).rejects.toThrow(
					ServerError.reference("채팅방 불러오기 실패")
				);

				expect(chatService.getRoomsByUserId).toHaveBeenCalledWith(
					readRoomByUserIdDto
				);
			});
		});
	});

	describe("GET /room/:room_id", () => {
		it("메세지 로그 불러오기 성공", async () => {
			mockChatService.getMessageLogs.mockResolvedValue([]);

			const result =
				await chatController.handleMessageLogsRead(mockRoomId);

			expect(chatService.getMessageLogs).toHaveBeenCalledWith(mockRoomId);
			expect(result).toEqual([]);
		});

		it("메세지 로그 불러오기 실패", async () => {
			mockChatService.getMessageLogs.mockRejectedValue(
				new Error("mock error")
			);

			await expect(
				chatController.handleMessageLogsRead(mockRoomId)
			).rejects.toThrow("메세지 로그 불러오기 실패");
		});
	});

	describe("POST /join", () => {
		const mockJoinRoomBodyDto = {
			roomId: mockRoomId,
			nickname: "mockNickname",
			isPrivate: true,
			password: "nah",
		};
		it("채팅방 가입 성공", async () => {
			mockChatService.addUserToRoom.mockResolvedValue(mockRoomId);

			const mockJoinRoomDto = {
				...mockJoinRoomBodyDto,
				userId: mockUser.userId,
			};

			const result = await chatController.handleRoomJoin(
				mockJoinRoomBodyDto,
				mockUser
			);

			expect(result).toEqual({ roomId: mockRoomId });
			expect(chatService.addUserToRoom).toHaveBeenCalledWith(
				mockJoinRoomDto
			);
		});
		it("채팅방 가입 실패", async () => {
			mockChatService.addUserToRoom.mockRejectedValue(
				new Error("mock error")
			);

			const mockJoinRoomDto = {
				...mockJoinRoomBodyDto,
				userId: mockUser.userId,
			};

			await expect(
				chatController.handleRoomJoin(mockJoinRoomBodyDto, mockUser)
			).rejects.toThrow("채팅방 가입 실패");

			expect(chatService.addUserToRoom).toHaveBeenCalledWith(
				mockJoinRoomDto
			);
		});
	});

	describe("POST /enter", () => {
		const mockEnterRoomBodyDto = {
			roomId: mockRoomId,
		};
		it("채팅방 입장 성공", async () => {
			mockChatService.enterUserToRoom.mockResolvedValue(mockMemberId);

			const result = await chatController.handleRoomEnter(
				mockEnterRoomBodyDto,
				mockUser
			);

			const mockEnterRoomDto = {
				...mockEnterRoomBodyDto,
				userId: mockUser.userId,
			};

			expect(result).toEqual({
				memberId: mockMemberId,
			});
			expect(chatService.enterUserToRoom).toHaveBeenCalledWith(
				mockEnterRoomDto
			);
		});
		it("채팅방 입장 실패", async () => {
			mockChatService.enterUserToRoom.mockRejectedValue(
				new Error("mock error")
			);

			const mockEnterRoomDto = {
				...mockEnterRoomBodyDto,
				userId: mockUser.userId,
			};

			await expect(
				chatController.handleRoomEnter(mockEnterRoomBodyDto, mockUser)
			).rejects.toThrow("채팅방 입장 실패");

			expect(chatService.enterUserToRoom).toHaveBeenCalledWith(
				mockEnterRoomDto
			);
		});
	});

	describe("POST /leave", () => {
		const mockLeaveRoomBodyDto = {
			roomId: mockRoomId,
		};
		it("채팅방 나가기 성공", async () => {
			mockChatService.leaveRoom.mockResolvedValue(undefined);

			const result = await chatController.handleRoomLeave(
				mockLeaveRoomBodyDto,
				mockUser
			);

			const mockLeaveRoomDto = {
				...mockLeaveRoomBodyDto,
				userId: mockUser.userId,
			};

			expect(result).toEqual(undefined);
			expect(chatService.leaveRoom).toHaveBeenCalledWith(
				mockLeaveRoomDto
			);
		});
		it("채팅방 나가기 실패", async () => {
			mockChatService.leaveRoom.mockRejectedValue(
				new Error("mock error")
			);

			const mockLeaveRoomDto = {
				...mockLeaveRoomBodyDto,
				userId: mockUser.userId,
			};

			await expect(
				chatController.handleRoomLeave(mockLeaveRoomBodyDto, mockUser)
			).rejects.toThrow(ServerError.reference("채팅방 떠나기 실패"));

			expect(chatService.leaveRoom).toHaveBeenCalledWith(
				mockLeaveRoomDto
			);
		});
	});
});
