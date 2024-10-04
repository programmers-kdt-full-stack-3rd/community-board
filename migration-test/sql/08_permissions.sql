/*
    TODO: 마이그레이션 완료후 퍼미션 테이블 재구성
*/

CREATE TABLE IF NOT EXISTS permissions (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL
);

INSERT IGNORE INTO permissions (name) VALUES
('view_post'),
('create_post'),
('delete_post'),
('create_comment'),
('delete_comment'),
('add_like'),
('remove_like'),
('login'),
('logout'),
('delete_account');