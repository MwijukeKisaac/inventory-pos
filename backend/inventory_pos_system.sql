-- Inventory POS System Database
-- MySQL / MariaDB compatible

CREATE DATABASE IF NOT EXISTS inventory_pos_system;
USE inventory_pos_system;

-- =========================
-- USERS
-- =========================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'cashier') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- CATEGORIES
-- =========================
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- PRODUCTS
-- =========================
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    name VARCHAR(150) NOT NULL,
    sku VARCHAR(100) UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- =========================
-- SALES
-- =========================
CREATE TABLE sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total DECIMAL(10,2) NOT NULL,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- =========================
-- SALE ITEMS
-- =========================
CREATE TABLE sale_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sale_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (sale_id) REFERENCES sales(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- =========================
-- SAMPLE DATA
-- =========================
INSERT INTO users (username, password, role) VALUES
('admin', 'admin123', 'admin'),
('cashier', 'cashier123', 'cashier');

INSERT INTO categories (name) VALUES
('Beverages'),
('Snacks'),
('Electronics');

INSERT INTO products (category_id, name, sku, price, quantity) VALUES
(1, 'Coca Cola', 'SKU001', 1.50, 100),
(2, 'Potato Chips', 'SKU002', 2.00, 50),
(3, 'USB Cable', 'SKU003', 5.00, 30);
