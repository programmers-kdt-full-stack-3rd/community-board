CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL
);

INSERT IGNORE INTO roles (name) VALUES
('admin'),
('user'),
('anonymous');