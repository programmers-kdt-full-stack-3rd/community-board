export const COMMENT_ERROR_CODES = {
	NO_REFERENCE: "ER_NO_REFERENCED_ROW_2",
};

export const COMMENT_ERROR_MESSAGES = {
	CONTENT_REQUIRED: "본문을 입력해 주십시오.",
	INVALID_CONTENT: "본문이 문자열이 아닙니다.",
	POST_ID_REQUIRED: "게시글 ID를 입력해 주십시오.",
	INVALID_POST_ID: "게시글 ID가 양의 정수가 아닙니다.",
	COMMENT_ID_REQUIRED: "댓글 ID를 입력해 주십시오.",
	INVALID_COMMENT_ID: "댓글 ID가 양의 정수가 아닙니다.",
	USER_ID_REQUIRED: "유저 ID를 입력해 주십시오.",
	NOT_FOUND_POST_ID: "게시글 ID가 존재하지 않습니다.",
	NOT_FOUND_COMMENT_ID: "댓글 ID가 존재하지 않습니다.",
	DELETE_COMMENT_ERROR: "댓글 삭제 실패",
	CREATE_COMMENT_ERROR: "댓글 생성 실패",
	UPDATE_COMMENT_ERROR: "댓글 수정 실패",
	READ_COMMENT_ERROR: "댓글 조회 실패",
} as const;
