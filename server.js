const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// إعداد الاتصال بقاعدة البيانات
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // غير كلمة السر إذا كانت موجودة لديك
    database: 'lamsa_market'
});

db.connect((err) => {
    if (err) {
        console.error('خطأ في الاتصال بقاعدة البيانات:', err);
    } else {
        console.log('تم الاتصال بقاعدة البيانات بنجاح.');
        initDB();
    }
});

// إنشاء الجدول وإدخال المنتجات الأولية إذا كانت القاعدة فارغة
function initDB() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            category VARCHAR(100) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            image TEXT NOT NULL,
            description TEXT
        )
    `;

    db.query(createTableQuery, (err) => {
        if (err) {
            console.error('خطأ في إنشاء الجدول:', err);
            return;
        }
        
        // التحقق مما إذا كانت هناك منتجات مسجلة بالفعل
        db.query('SELECT COUNT(*) AS count FROM products', (err, results) => {
            if (err) return console.error(err);
            if (results[0].count === 0) {
                insertInitialProducts();
            }
        });
    });
}

function insertInitialProducts() {
    const products = [
        ['ساعة ذكية مقاومة للماء', 'electronics', 4500, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', 'ساعة ذكية ممتازة تتبع النشاط الرياضي ومقاومة للماء'],
        ['سماعات لاسلكية عالية الجودة', 'electronics', 3200, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 'سماعات بلوتوث مع عزل للضوضاء وبطارية تدوم طويلاً'],
        ['قميص قطني كاجوال', 'fashion', 2500, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500', 'قميص قطني مريح ومناسب للاستخدام اليومي'],
        ['حذاء رياضي مريح', 'fashion', 5800, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 'حذاء رياضي خفيف الوزن ومناسب للمشي والركض'],
        ['طقم عناية بالبشرة طبيعي', 'beauty', 4200, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500', 'مجموعة مكونة من مواد طبيعية 100% لتغذية البشرة']
    ];

    const insertQuery = 'INSERT INTO products (title, category, price, image, description) VALUES ?';
    db.query(insertQuery, [products], (err) => {
        if (err) console.error('خطأ في إدخال المنتجات:', err);
        else console.log('تم إدخال المنتجات بنجاح.');
    });
}

// API لتزويد الواجهة الأمامية بالمنتجات
app.get('/api/products', (query, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            res.status(500).json({ error: 'خطأ في جلب البيانات' });
        } else {
            res.json(results);
        }
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`السيرفر يعمل على المنفذ: http://localhost:${PORT}`);
});