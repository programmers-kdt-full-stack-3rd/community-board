export const LIKE_ERROR_CODES = {
	DUPLICATED: "ER_DUP_ENTRY",
	NO_REFRERENCED: "ER_NO_REFERENCED_ROW_2",
};

export const LIKE_ERROR_MESSAGES = {
	DUPLICATED_POSTS: "이미 좋아요 표시한 게시물입니다.",
	DUPLICATED_COMMENTS: "이미 좋아요 표시한 댓글입니다.",
	NOT_FOUND_POST: "게시물이 존재하지 않습니다.",
	NOT_FOUND_COMMENT: "댓글이 존재하지 않습니다",
	CREATE_POST_LIKE_ERROR: "게시물 좋아요 생성 실패",
	DELETE_POST_LIKE_ERROR: "게시물 좋아요 삭제 실패",
	CREATE_COMMENT_LIKE_ERROR: "댓글 좋아요 생성 실패",
	DELETE_COMMENT_LIKE_ERROR: "댓글 좋아요 삭제 실패",
};
