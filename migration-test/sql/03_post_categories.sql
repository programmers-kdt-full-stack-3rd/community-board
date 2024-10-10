CREATE TABLE IF NOT EXISTS post_categories (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL
);

INSERT IGNORE INTO post_categories (name) VALUES
('자유게시판'),
('공지'),
('QnA'),
('팀원모집'),
('도전과제')
