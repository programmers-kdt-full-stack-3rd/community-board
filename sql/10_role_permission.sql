CREATE TABLE IF NOT EXISTS role_permission (
    role_id INTEGER,
    permission_id INTEGER,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- Role-Permission 연결
-- Admin 권한
INSERT IGNORE INTO role_permission (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'admin';

-- User 권한
INSERT IGNORE INTO role_permission (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'user'
AND p.name IN (
    'read:user',
    'update:user',
    'delete:user',
    'create:post',
    'update:post',
    'read:post',
    'delete:post',
    'create:comment',
    'update:comment',
    'read:comment',
    'delete:comment',
    'create:post-like',
    'delete:post-like',
    'create:comment-like',
    'delete:comment-like',
    'create:chat-room',
    'read:chat-room',
    'join:chat-room',
    'enter:chat-room',
    'leave:chat-room',
    'read:message-log'
);

-- Anonymous 권한
INSERT IGNORE INTO role_permission (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'anonymous'
AND p.name IN (
    'read:post',
    'read:comment'
);