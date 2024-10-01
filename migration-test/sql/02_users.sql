CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(50) UNIQUE,
    nickname VARCHAR(50) NOT NULL UNIQUE,
    is_delete Boolean NOT NULL DEFAULT FALSE,
    password TEXT,
    salt TEXT,
    role_id INTEGER NOT NULL DEFAULT 2,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

INSERT IGNORE INTO users (email, nickname, password, salt, role_id) VALUES
('admin@naver.com', "adminAccount", "UmUWDSbEoz8Iis9GFMbfouktG+lpxktssnFiZejNHpbMV18PrdQ9YLLGZ8Zc8e7sLh57JIx7uxqCEl0LFwJg+Q==", "0kVqLfh85GwLB63oyZHvDxbCHfe3k3nCJlUtoafYOkuQBVhz0qNxqA4DsYxpwb4nKN", 2);

