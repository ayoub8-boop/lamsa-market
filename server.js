const express = require('express');
const path = require('path');
const products = require('./products.json');

const app = express();

// تقديم ملفات الواجهة من مجلد public فقط (وليس المجلد الجذري)
app.use(express.static(path.join(__dirname, 'public')));

// API لتزويد الواجهة الأمامية بالمنتجات
app.get('/api/products', (req, res) => {
    res.json(products);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`السيرفر يعمل على المنفذ: ${PORT}`);
});
