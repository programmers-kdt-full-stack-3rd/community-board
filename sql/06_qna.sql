CREATE TABLE IF NOT EXISTS qna (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL UNIQUE,
    comment_id INT NOT NULL UNIQUE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
);