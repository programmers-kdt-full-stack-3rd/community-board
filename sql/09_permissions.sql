/*
    TODO: 마이그레이션 완료후 퍼미션 테이블 재구성
*/

CREATE TABLE IF NOT EXISTS permissions (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL
);

INSERT IGNORE INTO permissions (name) VALUES
('update:user'),
('read:user'),
('delete:user'),
('create:post'),
('update:post'),
('read:post'),
('delete:post'),
('create:comment'),
('update:comment'),
('read:comment'),
('delete:comment'),
('create:post-like'),
('delete:post-like'),
('create:comment-like'),
('delete:comment-like'),
('manage:user'),
('manage:post'),
('view:log'),
('view:stat');