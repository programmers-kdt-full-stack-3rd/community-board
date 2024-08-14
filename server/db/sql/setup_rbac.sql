CREATE TABLE roles (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE permissions (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE role_permission (
    role_id INTEGER,
    permission_id INTEGER,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id)
);

-- Roles 추가
INSERT INTO roles (name) VALUES
('admin'),
('user'),
('anonymous');

-- Permissions 추가
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

-- Role-Permission 연결
-- Admin 권한
INSERT INTO role_permission (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'admin'
AND p.name IN ('view_post', 'create_post','delete_post', 'create_comment', 'delete_comment', 'add_like', 'remove_like', 'logout', 'delete_account');

-- User 권한
INSERT INTO role_permission (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'user'
AND p.name IN ('view_post', 'create_post','delete_post', 'create_comment','delete_comment', 'add_like', 'remove_like', 'logout', 'delete_account');

-- Anonymous 권한
INSERT INTO role_permission (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'anonymous'
AND p.name IN ('view_post', 'login');

ALTER TABLE users
ADD COLUMN role_id INTEGER NOT NULL DEFAULT 2,
ADD FOREIGN KEY (role_id) REFERENCES roles(id);