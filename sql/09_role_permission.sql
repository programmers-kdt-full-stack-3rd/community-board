CREATE TABLE IF NOT EXISTS role_permission (
    role_id INTEGER,
    permission_id INTEGER,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id)
);

-- Role-Permission 연결
-- Admin 권한
INSERT IGNORE INTO role_permission (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'admin'
AND p.name IN ('view_post', 'create_post','delete_post', 'create_comment', 'delete_comment', 'add_like', 'remove_like', 'logout', 'delete_account');

-- User 권한
INSERT IGNORE INTO role_permission (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'user'
AND p.name IN ('view_post', 'create_post','delete_post', 'create_comment','delete_comment', 'add_like', 'remove_like', 'logout', 'delete_account');

-- Anonymous 권한
INSERT IGNORE INTO role_permission (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'anonymous'
AND p.name IN ('view_post', 'login');