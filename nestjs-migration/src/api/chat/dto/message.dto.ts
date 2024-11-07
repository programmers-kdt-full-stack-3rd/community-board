import { IsOptional } from "class-validator";

export class IMessage {
	@IsOptional()
	id?: number; // 채팅 번호

	memberId: number; // 입장자 번호

	roomId: number; // 방 번호

	@IsOptional()
	nickname?: string; // 보낸 사람 이름

	message: string; // 채팅 내용

	createdAt: Date; // 생성 시간

	isSystem: string; // true : 시스템 메세지

	@IsOptional()
	isDeleted?: string; // true : 사용자 탈퇴

	@IsOptional()
	isMine?: boolean; // true : 내 메세지
}
