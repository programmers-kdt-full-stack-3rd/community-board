-- 외래 키 제약 조건 비활성화
SET FOREIGN_KEY_CHECKS = 0;

-- 테스트 중 생성된 데이터만 삭제
TRUNCATE TABLE user_logs;
TRUNCATE TABLE refresh_tokens;
TRUNCATE TABLE messages;
TRUNCATE TABLE members;
TRUNCATE TABLE rooms;
TRUNCATE TABLE comment_likes;
TRUNCATE TABLE comments;
TRUNCATE TABLE post_likes;
TRUNCATE TABLE posts;
TRUNCATE TABLE oauth_connections;
TRUNCATE TABLE users;

-- 외래 키 제약 조건 다시 활성화
SET FOREIGN_KEY_CHECKS = 1;