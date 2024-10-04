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

INSERT IGNORE INTO users (email, nickname, password, salt, role_id) VALUES
('admin@naver.com', "adminAccount", "UmUWDSbEoz8Iis9GFMbfouktG+lpxktssnFiZejNHpbMV18PrdQ9YLLGZ8Zc8e7sLh57JIx7uxqCEl0LFwJg+Q==", "0kVqLfh85GwLB63oyZHvDxbCHfe3k3nCJlUtoafYOkuQBVhz0qNxqA4DsYxpwb4nKN+yVBc89QaHY82s2siUxw==", 1);


-- 외래 키 제약 조건 다시 활성화
SET FOREIGN_KEY_CHECKS = 1;