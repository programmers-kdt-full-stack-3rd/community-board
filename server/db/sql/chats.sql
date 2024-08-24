CREATE TABLE IF NOT EXISTS rooms (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    is_private BOOLEAN DEFAULT FALSE,
    password VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP ON UPDATE NOW()
);

/* user_id, room_id에 대한 index 고려하기 */
CREATE TABLE IF NOT EXISTS messages (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    is_system BOOLEAN NOT NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS members (
    id INT NOT NULL,
    room_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    is_host Boolean DEFAULT FALSE,
    is_deleted Boolean DEFAULT FALSE,
    last_message_id INT,
    PRIMARY KEY (id, room_id),
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    FOREIGN KEY (id) REFERENCES users(id),
    FOREIGN KEY (last_message_id) REFERENCES messages(id)
);