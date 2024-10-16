CREATE TABLE IF NOT EXISTS coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    stock INT NOT NULL
);

CREATE TABLE IF NOT EXISTS coupons_log (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    coupon_id INT,
    user_id INT,
    recieved_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- ONDELETE옵션 어떻게 할래
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE NO ACTION,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE NO ACTION
);


INSERT IGNORE INTO coupons (name, stock) VALUES
('강좌 쿠폰', 30)

