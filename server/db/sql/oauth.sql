CREATE TABLE IF NOT EXISTS oauth_providers (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS oauth_connections (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    oauth_provider_id INT NOT NULL,
    oauth_account_id VARCHAR(255) NOT NULL,
    oauth_refresh_token TEXT NULL,
    isDelete Boolean NOT NULL DEFAULT FALSE,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (oauth_provider_id) REFERENCES oauth_providers(id),

    UNIQUE KEY (oauth_provider_id, oauth_account_id)
);

INSERT INTO oauth_providers (name) VALUES
('google'),
('kakao'),
('naver');
