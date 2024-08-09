import { likeTargetToName } from "../../../db/mapper/likes_mapper";
import { TLikeTarget } from "../../../db/model/likes";

export const ERROR_MESSAGES = {
	TARGET_ID_REQUIRED: (targetType: TLikeTarget) =>
		`${likeTargetToName[targetType]} ID를 입력해 주십시오.`,
	INVALID_TARGET_ID: (targetType: TLikeTarget) =>
		`${likeTargetToName[targetType]} ID가 양의 정수가 아닙니다.`,
} as const;
