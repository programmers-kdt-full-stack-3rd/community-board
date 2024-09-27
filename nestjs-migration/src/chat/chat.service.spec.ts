import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { RoomRepository } from './repositories/chat.room.repoistory';
import { MemberRepository } from './repositories/chat.member.repository';
import { DataSource, Like } from 'typeorm';
import { IUserEntity } from '../common/interface/user-entity.interface';

describe('ChatService', () => {
  let chatService: ChatService;
  let roomRepository: RoomRepository;
  let memberRepository: MemberRepository;
  let dataSource: DataSource;

  let mockUser: IUserEntity;
  let mockRoomId: number;
  let mockMemberId: number;

  const mockRoomRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCountBy: jest.fn(),
    getRoomByKeyword: jest.fn(),
    getRoomByUserId: jest.fn(),
    getMessageLogs: jest.fn(),

  };

  const mockMemberRepository = {
    getRoomCntByUserId: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),

  };

  const mockDataSource = {
		createQueryRunner: jest.fn(),
	};

  mockUser= {
    userId: 1,
    roleId: 1,
  };
  mockMemberId = 1;
  mockRoomId = 1;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: RoomRepository,
          useValue: mockRoomRepository,
        },
        {
          provide: MemberRepository,
          useValue: mockMemberRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource
        }
      ],
    }).compile();

    chatService = module.get<ChatService>(ChatService);
    roomRepository = module.get<RoomRepository>(RoomRepository);
    memberRepository = module.get<MemberRepository>(MemberRepository);
    dataSource = module.get<DataSource>(DataSource);

  });  

  describe("addRoom", () => {
    const mockQueryRunner = {
			connect: jest.fn(),
			startTransaction: jest.fn(),
			commitTransaction: jest.fn(),
			rollbackTransaction: jest.fn(),
			release: jest.fn(),
			manager: {
				save: jest.fn(),
			},
		};
		mockDataSource.createQueryRunner.mockReturnValue(mockQueryRunner);

    const mockCreateRoomDto = {
      title: "mock title",
      isPrivate: true,
      password: "nah",
      userId: mockUser.userId
    }
    it("DB에 채팅방 생성 성공", async() => {
      mockRoomRepository.create.mockReturnValue({ id: mockRoomId, name: 'Mock Room' });
      mockRoomRepository.save.mockResolvedValue({ id: mockRoomId });
      mockMemberRepository.create.mockReturnValue({ id: mockMemberId});
      mockMemberRepository.save.mockResolvedValue({ id: mockMemberId });

      const result = await chatService.addRoom(mockCreateRoomDto);

      expect(roomRepository.create).toHaveBeenCalledWith({
        name: mockCreateRoomDto.title,
        isPrivate: mockCreateRoomDto.isPrivate,
        password: mockCreateRoomDto.password,
      });
      expect(roomRepository.save).toHaveBeenCalledWith({ id: mockRoomId, name: 'Mock Room' });
      expect(memberRepository.create).toHaveBeenCalledWith({
        user: { id: mockCreateRoomDto.userId },
        room: { id: mockRoomId },
        isHost: true,
      });
      expect(memberRepository.save).toHaveBeenCalledWith({ id: mockMemberId});

      expect(mockQueryRunner.connect).toHaveBeenCalled();
			expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
			expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
			expect(mockQueryRunner.release).toHaveBeenCalled();

      expect(result).toEqual(mockRoomId);
      
    });
    it('방 save 중 에러 발생 시 반환', async () => {
      mockRoomRepository.save.mockRejectedValue(new Error('방 생성 실패'));

      await expect(chatService.addRoom(mockCreateRoomDto)).rejects.toThrow('방 생성 실패');

      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('멤버 save 중 에러 발생 시 반환', async () => {
      mockRoomRepository.create.mockReturnValue({ id: mockRoomId });
      mockRoomRepository.save.mockResolvedValue({ id: mockRoomId });

      mockMemberRepository.save.mockRejectedValue(new Error('멤버 생성 실패'));

      await expect(chatService.addRoom(mockCreateRoomDto)).rejects.toThrow('멤버 생성 실패');

      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });
  });

  describe("getRoomsBykeyword", () => {
    const mockTotalRoom = 5;
    const readRoomByKeywordDto = {
      perPage: 2,
      page: 0,
      isSearch: true,
      keyword: ""
    }
    it("DB에서 키워드로 채팅방 목록을 불러오기 성공", async () => {
      mockRoomRepository.findAndCountBy.mockResolvedValue(["",mockTotalRoom]);

      mockRoomRepository.getRoomByKeyword.mockResolvedValue([{
        totalMembersCount: 0,
        roomId: mockRoomId,
        title: "mock title",
        isPrivate: true
      }]);

      const result = await chatService.getRoomsBykeyword(readRoomByKeywordDto);

      expect(result).toEqual({
        totalRoomCount: mockTotalRoom,
        roomHeaders: [{
          totalMembersCount: 0,
          roomId: mockRoomId,
          title: "mock title",
          isPrivate: true
        }]
      });
      expect(roomRepository.findAndCountBy).toHaveBeenCalledWith({name: Like(`%${readRoomByKeywordDto.keyword.trim()}%`)});
      expect(roomRepository.getRoomByKeyword).toHaveBeenCalledWith(readRoomByKeywordDto);
    });
    it("DB에서 키워드로 채팅방 목록 불러오는 중 에러 발생 시 반환", async () => {
      mockRoomRepository.findAndCountBy.mockResolvedValue(["",mockTotalRoom]);

      mockRoomRepository.getRoomByKeyword.mockRejectedValue(new Error("mock error"));

      await expect(chatService.getRoomsBykeyword(readRoomByKeywordDto)).rejects.toThrow(new Error("mock error"));

      expect(roomRepository.findAndCountBy).toHaveBeenCalledWith({name: Like(`%${readRoomByKeywordDto.keyword.trim()}%`)});
      expect(roomRepository.getRoomByKeyword).toHaveBeenCalledWith(readRoomByKeywordDto);
    });
  });

  describe("getRoomsByUserId", () => {
    const mockTotalRoom = 5;
    const readRoomByUserIdDto = {
      perPage: 2,
      page: 0,
      isSearch: false,
      userId: mockUser.userId
    }
    it("DB에서 유저 아이디로 채팅방 목록을 불러오기 성공", async () => {

      mockMemberRepository.getRoomCntByUserId.mockResolvedValue(mockTotalRoom);

      mockRoomRepository.getRoomByUserId.mockResolvedValue([{
        totalMembersCount: 0,
        roomId: mockRoomId,
        title: "mock title",
        isPrivate: true
      }]);

      const result = await chatService.getRoomsByUserId(readRoomByUserIdDto);

      expect(result).toEqual({
        totalRoomCount: mockTotalRoom,
        roomHeaders: [{
          totalMembersCount: 0,
          roomId: mockRoomId,
          title: "mock title",
          isPrivate: true
        }]
      });
      expect(memberRepository.getRoomCntByUserId).toHaveBeenCalledWith(readRoomByUserIdDto.userId);
      expect(roomRepository.getRoomByUserId).toHaveBeenCalledWith(readRoomByUserIdDto);
    });
    it("DB에서 유저 아이디로 채팅방 목록 불러오는 중 에러 발생 시 반환", async () => {

      mockMemberRepository.getRoomCntByUserId.mockResolvedValue(mockTotalRoom);

      mockRoomRepository.getRoomByUserId.mockRejectedValue(new Error("mock error"));

      await expect(chatService.getRoomsByUserId(readRoomByUserIdDto)).rejects.toThrow(new Error("mock error"));

      expect(memberRepository.getRoomCntByUserId).toHaveBeenCalledWith(readRoomByUserIdDto.userId);
      expect(roomRepository.getRoomByUserId).toHaveBeenCalledWith(readRoomByUserIdDto);
    });
  });

  //TODO
  describe("getMessageLogs", () => {
    it("메세지 로그 불러오기 성공", async () => {
      mockRoomRepository.getMessageLogs.mockResolvedValue([
        {
          id: 1,
          memberId: 1,
          roomId: mockRoomId,
          nickname: "nickname",
          message: "mock message",
          createdAt: "mock date",
          isSystem: true,
          isDeleted: false,
          isMine: true
        }
      ]);
      const result = await chatService.getMessageLogs(mockRoomId);

      expect(result).toEqual([
        {
          id: 1,
          memberId: 1,
          roomId: mockRoomId,
          nickname: "nickname",
          message: "mock message",
          createdAt: "mock date",
          isSystem: true,
          isDeleted: true,
          isMine: true
        }
      ]);
      expect(roomRepository.getMessageLogs).toHaveBeenCalledWith(mockRoomId);
    });
    it("메세지 로그 불러오는 중 에러 발생 시 반환", async () => {
      mockRoomRepository.getMessageLogs.mockRejectedValue(new Error ("mock error"));

      await expect(chatService.getMessageLogs(mockRoomId)).rejects.toThrow(new Error("mock error"));
      expect(roomRepository.getMessageLogs).toHaveBeenCalledWith(mockRoomId);
    });
  });

  describe("addUserToRoom", () => {
    const mockJoinRoomDto = {
      roomId: mockRoomId,
      userId: mockUser.userId,
      nickname: "mock nickname",
      isPrivate: true,
      password: "nah"
    }
    it("채팅방에 유저 추가하기 성공", async () => {
      mockRoomRepository.create.mockReturnValue({ id: mockMemberId});
      mockMemberRepository.save.mockResolvedValue({ id: mockMemberId });

      const result = await chatService.addUserToRoom(mockJoinRoomDto);

      expect(result).toEqual(mockRoomId);
      expect(memberRepository.create).toHaveBeenCalledWith({
        user: { id: mockJoinRoomDto.userId },
        room: { id: mockRoomId }
      });
      expect(memberRepository.save).toHaveBeenCalledWith({ id: mockMemberId});
    });
    it("채팅방에 유저를 추가하는 도중 에러 발생 시 반환", async () => {
      mockRoomRepository.create.mockReturnValue({ id: mockMemberId});
      mockMemberRepository.save.mockRejectedValue(new Error("mock error"))

      await expect(chatService.addUserToRoom(mockJoinRoomDto)
      ).rejects.toThrow(new Error("mock error"));

      expect(memberRepository.create).toHaveBeenCalledWith({
        user: { id: mockJoinRoomDto.userId },
        room: { id: mockRoomId }
      });
      expect(memberRepository.save).toHaveBeenCalledWith({ id: mockMemberId});
    });
  });

  describe("enterUserToRoom", () => {
    const mockEnterRoomDto = {
      roomId: mockRoomId,
      userId: mockUser.userId
    }
    it("채팅방에 들어가기 성공", async () => {
      mockMemberRepository.findOne.mockResolvedValue({
        id: mockMemberId
      });

      const result = await chatService.enterUserToRoom(mockEnterRoomDto);

      expect(result).toEqual(mockMemberId);
      expect(memberRepository.findOne).toHaveBeenCalledWith({
        where: {
          user: {id: mockUser.userId},
          room: {id: mockRoomId}
        }
      });
    });
    it("채팅방에 들어가는 도중 에러 발생 시 반환", async () => {
      mockMemberRepository.findOne.mockRejectedValue(new Error("mock error"));

      await expect(chatService.enterUserToRoom(mockEnterRoomDto)).rejects.toThrow(new Error("mock error"));
      expect(memberRepository.findOne).toHaveBeenCalledWith({
        where: {
          user: {id: mockUser.userId},
          room: {id: mockRoomId}
        }
      });
    });
  });

  describe("leaveRoom", () => {
    const mockLeaveroomDto = {
      userId: mockUser.userId,
      roomId: mockRoomId
    }
    it("채팅방에 나가기 성공", async () => {
      mockMemberRepository.update.mockResolvedValue({affected: true});

      const result = await chatService.leaveRoom(mockLeaveroomDto);

      expect(result).toEqual(true);
      expect(memberRepository.update).toHaveBeenCalledWith(
        {user: {id: mockLeaveroomDto.userId}, room: {id: mockLeaveroomDto.roomId}}, {isDeleted: true}
      );
    });
    it("채팅방에 나가는 도중 에러 발생 시 반환", async () => {
      mockMemberRepository.update.mockRejectedValue(new Error("mock error"));

      await expect(chatService.leaveRoom(mockLeaveroomDto)).rejects.toThrow(new Error("mock error"));
      expect(memberRepository.update).toHaveBeenCalledWith(
        {user: {id: mockLeaveroomDto.userId}, room: {id: mockLeaveroomDto.roomId}}, {isDeleted: true}
      );
    });
  });
});
