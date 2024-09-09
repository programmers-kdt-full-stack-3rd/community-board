CREATE TABLE IF NOT EXISTS rooms (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    password VARCHAR(50),
    is_private BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW()
);

CREATE TABLE IF NOT EXISTS members (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    is_host Boolean DEFAULT FALSE,
    is_entered Boolean DEFAULT FALSE,
    is_deleted Boolean DEFAULT FALSE,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    
    UNIQUE KEY (user_id, room_id)
);

CREATE TABLE IF NOT EXISTS messages (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    member_id INT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    is_system BOOLEAN NOT NULL DEFAULT FALSE,
    
    FOREIGN KEY (member_id) REFERENCES members(id)
);