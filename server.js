try { require('dotenv').config(); } catch (e) { /* dotenv اختياري، متغيرات البيئة على Render تُضبط مباشرة */ }

const express = require('express');
const path = require('path');
const products = require('./products.json');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API لتزويد الواجهة الأمامية بالمنتجات
app.get('/api/products', (req, res) => {
    res.json(products);
});

// استقبال الطلبات وإرسالها فوراً إلى تيليغرام
app.post('/api/order', async (req, res) => {
    try {
        const { customerName, phone, wilayaName, deliveryType, items, subtotal, shipping, total } = req.body;

        if (!customerName || !phone || !wilayaName || !items || !items.length) {
            return res.status(400).json({ error: 'بيانات ناقصة' });
        }

        const deliveryLabel = deliveryType === 'home' ? 'إلى المنزل' : 'إلى المكتب (Stop Desk)';

        const itemsList = items.map((it, idx) =>
            `${idx + 1}. ${it.category} — ${it.price} دج${it.image ? `\n   الصورة: ${req.protocol}://${req.get('host')}${it.image}` : ''}`
        ).join('\n');

        const message =
`📦 طلب جديد من Lamsa Market!

👤 الزبون: ${customerName}
📞 الهاتف: ${phone}
📍 الولاية: ${wilayaName}
🚚 التوصيل: ${deliveryLabel}

💎 القطع المطلوبة:
${itemsList}

💰 مجموع القطع: ${subtotal} دج
🚛 سعر التوصيل: ${shipping} دج
✅ المجموع الكلي: ${total} دج`;

        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!botToken || !chatId) {
            console.error('TELEGRAM_BOT_TOKEN أو TELEGRAM_CHAT_ID غير مضبوطين في متغيرات البيئة');
            return res.status(500).json({ error: 'الخدمة غير مهيأة لاستقبال الطلبات حالياً' });
        }

        const tgResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: message })
        });

        const tgResult = await tgResponse.json();

        if (!tgResult.ok) {
            console.error('خطأ تيليغرام:', tgResult);
            return res.status(500).json({ error: 'فشل إرسال الطلب إلى تيليغرام' });
        }

        res.json({ success: true });
    } catch (err) {
        console.error('خطأ في معالجة الطلب:', err);
        res.status(500).json({ error: 'حدث خطأ غير متوقع' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`السيرفر يعمل على المنفذ: ${PORT}`);
});
