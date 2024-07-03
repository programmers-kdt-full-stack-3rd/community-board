CREATE TABLE IF NOT EXISTS comments (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    content TEXT NOT NULL,
    post_id INT NOT NULL,
    author_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS comment_likes (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    comment_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (comment_id) REFERENCES comments(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);