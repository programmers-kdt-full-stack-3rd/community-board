CREATE TABLE IF NOT EXISTS recruting_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    room_id INT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    UNIQUE KEY (post_id, room_id)
);