-- 1. إنشاء قاعدة بيانات المتجر
CREATE DATABASE IF NOT EXISTS auto_shop;

-- 2. استخدام قاعدة البيانات
USE auto_shop;

-- 3. إنشاء جدول المنتجات
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

USE auto_shop;

-- 1. تفريغ الجدول القديم
TRUNCATE TABLE products;

-- 2. إدخال الـ 40 منتجاً بالتصنيفات الدقيقة
USE auto_shop;

-- 1. تفريغ الجدول القديم
-- تفريغ الجدول لإعادة إدراج البيانات المصححة
TRUNCATE TABLE products;

-- إدراج البيانات مع تصنيف 39 و 40 كـ "سلسلة"
INSERT INTO products (name, price, category, image) VALUES 
('طقم', 0.00, 'طقم', '/image/product_01.jpg'),
('طقم', 0.00, 'طقم', '/image/product_02.jpg'),
('طقم', 0.00, 'طقم', '/image/product_03.jpg'),
('طقم', 0.00, 'طقم', '/image/product_04.jpg'),
('جورمات', 0.00, 'جورمات', '/image/product_05.jpg'),
('طقم', 0.00, 'طقم', '/image/product_06.jpg'),
('سلسلة', 0.00, 'سلسلة', '/image/product_07.jpg'),
('سلسلة', 0.00, 'سلسلة', '/image/product_08.jpg'),
('سلسلة', 0.00, 'سلسلة', '/image/product_09.jpg'),
('سلسلة', 0.00, 'سلسلة', '/image/product_10.jpg'),
('سلسلة', 0.00, 'سلسلة', '/image/product_11.jpg'),
('سلسلة', 0.00, 'سلسلة', '/image/product_12.jpg'),
('سلسلة', 0.00, 'سلسلة', '/image/product_13.jpg'),
('سلسلة', 0.00, 'سلسلة', '/image/product_14.jpg'),
('سلسلة', 0.00, 'سلسلة', '/image/product_15.jpg'),
('سلسلة', 0.00, 'سلسلة', '/image/product_16.jpg'),
('سلسلة', 0.00, 'سلسلة', '/image/product_17.jpg'),
('سلسلة', 0.00, 'سلسلة', '/image/product_18.jpg'),
('سلسلة', 0.00, 'طقم', '/image/product_19.jpg'),
('سلسلة', 0.00, 'سلسلة', '/image/product_20.jpg'),
('طقم', 0.00, 'طقم', '/image/product_21.jpg'),
('براسلي', 0.00, 'براسلي', '/image/product_22.jpg'),
('براسلي', 0.00, 'براسلي', '/image/product_23.jpg'),
('براسلي', 0.00, 'براسلي', '/image/product_24.jpg'),
('منقوش', 0.00, 'منقوش', '/image/product_25.jpg'),
('سلسلة', 0.00, 'سلسلة', '/image/product_26.jpg'),
('براسلي', 0.00, 'براسلي', '/image/product_27.jpg'),
('طقم', 0.00, 'طقم', '/image/product_28.jpg'),
('طقم', 0.00, 'طقم', '/image/product_29.jpg'),
('براسلي', 0.00, 'براسلي', '/image/product_30.jpg'),
('براسلي', 0.00, 'براسلي', '/image/product_31.jpg'),
('طقم', 0.00, 'طقم', '/image/product_32.jpg'),
('طقم', 0.00, 'طقم', '/image/product_33.jpg'),
('طقم', 0.00, 'طقم', '/image/product_34.jpg'),
('طقم', 0.00, 'طقم', '/image/product_35.jpg'),
('طقم', 0.00, 'طقم', '/image/product_36.jpg'),
('طقم', 0.00, 'طقم', '/image/product_37.jpg'),
('طقم', 0.00, 'طقم', '/image/product_38.jpg'),
('سلسلة', 0.00, 'سلسلة', '/image/product_39.jpg'),
('سلسلة', 0.00, 'سلسلة', '/image/product_40.jpg');