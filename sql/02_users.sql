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