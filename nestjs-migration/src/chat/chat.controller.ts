import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { User } from '../common/decorator/user.decorator';
import { IUserEntity } from '../common/interface/user-entity.interface';
import { CreateRoomBodyDto } from './dto/create-room.dto';
import { ReadRoomQueryDto } from './dto/read-room-query.dto';
import { Request } from 'express';
import { LoginGuard } from '../common/guard/login.guard';
import { JoinRoomBodyDto, JoinRoomDto } from './dto/join-room.dto';
import { EnterRoomBodyDto, EnterRoomDto } from './dto/enter-room.dto';
import { LeaveRoomBodyDto } from './dto/leave-room.dto';
import { ServerError } from '../common/exceptions/server-error.exception';
import { IMessage } from './dto/message.dto';
import { EnterRoomResultDto, GetRoomsResultDto, ICreateRoomResult, IJoinRoomResult } from './dto/chat-result.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post("/room")
  @UseGuards(LoginGuard)
  @HttpCode(HttpStatus.CREATED)
  async handleRoomCreate (
    @User() user: IUserEntity,
    @Body() createRoomBodyDto: CreateRoomBodyDto
  ) : Promise<ICreateRoomResult> {
    try{
      const userId = user.userId;
      const createRoomDto = {
        ...createRoomBodyDto,
        userId,
      };

      const roomId = await this.chatService.addRoom(createRoomDto);

      return {roomId,};
    } catch(err) {
      throw ServerError.reference("채팅방 생성 실패");
    };
  };

  @Get("/rooms")
  @HttpCode(HttpStatus.OK)
  async handleRoomsRead (
    @Query() readRoomQueryDto: ReadRoomQueryDto,
    @User() user: IUserEntity
  ) : Promise<GetRoomsResultDto> {
    try{
      let { page, perPage, keyword, isSearch} = readRoomQueryDto;
      page = page ? page-1: page;
      keyword = keyword ? decodeURIComponent(keyword) : "";

      let results;

      if (isSearch) {
        const readRoomByKeywordDto = {
          page,
          perPage,
          keyword, 
          isSearch,
        }
        results = await this.chatService.getRoomsBykeyword(readRoomByKeywordDto);
      } else {
        const readRoomByUserIdDto = {
          userId: user.userId,
          page,
          perPage,
        }
        results = await this.chatService.getRoomsByUserId(readRoomByUserIdDto);
      }

      return results;
    } catch(err) {
        throw ServerError.reference("채팅방 불러오기 실패");
    };
  };

  @Get("/room/:room_id")
  @UseGuards(LoginGuard)
  @HttpCode(HttpStatus.OK)
  async handleMessageLogsRead (
    @Param("room_id") roomId: number, 
  ) : Promise<IMessage[]> {
    try{
      const result = await this.chatService.getMessageLogs(roomId);

      return result;      

    } catch(err) {
      throw ServerError.reference("메세지 로그 불러오기 실패");
    };
  };

  @Post("/join")
  @UseGuards(LoginGuard)
  @HttpCode(HttpStatus.OK)
  async handleRoomJoin (
    @Body() joinRoomBodyDto: JoinRoomBodyDto,
    @User() user: IUserEntity
  ) : Promise <IJoinRoomResult> {
    try{
      const userId = user.userId;
      const joinRoomDto = {
        ...joinRoomBodyDto,
        userId,
      }

      const result = await this.chatService.addUserToRoom(joinRoomDto);

      return {roomId: result}
    } catch(err) {
        throw ServerError.reference("채팅방 가입 실패");
    };
  }

  @Post("/enter")
  @UseGuards(LoginGuard)
  @HttpCode(HttpStatus.OK)
  async handleRoomEnter (
    @Body() enterRoomBodyDto: EnterRoomBodyDto,
    @User() user: IUserEntity
  ) : Promise<EnterRoomResultDto> {
    try{
      const userId = user.userId;

      const enterRoomDto = {
        ...enterRoomBodyDto,
        userId,
      }
      const memberId = await this.chatService.enterUserToRoom(enterRoomDto);

      return {memberId,};

    } catch(err) {
      throw ServerError.reference("채팅방 입장 실패");
    };
  };

  @Post("/leave")
  @UseGuards(LoginGuard)
  @HttpCode(HttpStatus.OK)
  async handleRoomLeave (
    @Body() leaveRoomBodyDto: LeaveRoomBodyDto,
    @User() user: IUserEntity,
  ) : Promise<void> {
    try{
      const userId = user.userId;

      const leaveRoomDto = {
        ...leaveRoomBodyDto,
        userId,
      };

      await this.chatService.leaveRoom(leaveRoomDto);

      return;

    } catch(err) {
      throw ServerError.reference("채팅방 나가기 실패");
    };
  };
};
