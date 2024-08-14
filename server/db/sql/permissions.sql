CREATE TABLE permissions (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO permissions (name) VALUES
('view_post'),
('create_post'),
('delete_post'),
('create_comment'),
('delete_comment'),
('add_like'),
('remove_like'),
('login'),
('logout'),
('delete_account');