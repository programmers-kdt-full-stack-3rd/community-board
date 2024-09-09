CREATE TABLE IF NOT EXISTS user_log_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL
);

INSERT INTO user_log_categories (name) VALUES
('게시글'),
('댓글')