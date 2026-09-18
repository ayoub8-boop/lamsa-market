document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('modalCaption');
    const closeModalBtn = document.querySelector('.close-modal');
    const container = document.getElementById('products-container');
    const modalWhatsappBtn = document.getElementById('modalWhatsappBtn');

    // رقم هاتف الواتساب
    const myWhatsappNumber = "213665677961";

    const categoryOrder = ['طقم', 'سلسلة', 'براسلي', 'جورمات', 'منقوش'];

    // التعديل في ملف public/script.js

function createWhatsappLink(categoryName, imageUrl) {
    // الحصول على الرابط الكامل للصورة على موقعك المباشر
    const fullImageUrl = window.location.origin + imageUrl;
    
    const textMessage = `مرحباً Lamsa Market ✨، أريد طلب هذه القطعة:%0A- النوع: ${encodeURIComponent(categoryName)}%0A- رابط الصورة: ${encodeURIComponent(fullImageUrl)}`;
    return `https://wa.me/${myWhatsappNumber}?text=${textMessage}`;
}

    function renderGroupedProducts(products) {
        if (!container) return;
        container.innerHTML = '';

        if (!products || products.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #777; padding: 2rem;">لا توجد منتجات متوفرة حالياً.</p>';
            return;
        }

        const grouped = {};
        products.forEach(p => {
            // التعامل مع اختلاف أسماء الأعمدة (image_url أو image)
            p.image = p.image || p.image_url;
            const cat = p.category || p.name || 'طقم';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(p);
        });

        categoryOrder.forEach(category => {
            const items = grouped[category];
            if (!items || items.length === 0) return;

            const section = document.createElement('section');
            section.classList.add('category-section');

            const header = document.createElement('div');
            header.classList.add('category-header');
            header.innerHTML = `
                <h2>${category}</h2>
                <span class="category-count">${items.length} قطع</span>
            `;
            section.appendChild(header);

            const grid = document.createElement('div');
            grid.classList.add('category-grid');

            items.forEach(product => {
                const card = document.createElement('div');
                card.classList.add('product-card');

                const waLink = createWhatsappLink(category);

                card.innerHTML = `
                    <div class="image-wrapper">
                        <img src="${product.image}" alt="${category}" loading="lazy">
                        <div class="zoom-overlay">
                            <span class="zoom-btn">🔍 معاينة وتكبير</span>
                        </div>
                    </div>
                    <div class="product-info">
                        <h3>${category}</h3>
                        <a href="${waLink}" target="_blank" class="whatsapp-card-btn">
                            💬 طلب عبر الواتساب
                        </a>
                    </div>
                `;

                // عند فتح النافذة المنبثقة للطلب وتكبير الصورة
                const imageWrapper = card.querySelector('.image-wrapper');
                imageWrapper.addEventListener('click', () => {
                    if (modal && modalImg && captionText) {
                        modal.style.display = 'block';
                        modalImg.src = product.image;
                        captionText.textContent = `طلب قطعة: ${category}`;
                        if (modalWhatsappBtn) modalWhatsappBtn.href = waLink;
                    }
                });

                grid.appendChild(card);
            });

            section.appendChild(grid);
            container.appendChild(section);
        });
    }

    // استدعاء البيانات وتمريرها فوراً لدالة العرض
    fetch('/api/products')
        .then(response => response.json())
        .then(products => {
            console.log('Products received:', products);
            renderGroupedProducts(products); // <-- هذا هو السطر الذي كان مفقوداً!
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            if (container) {
                container.innerHTML = '<p style="text-align: center; color: red; padding: 2rem;">حدث خطأ في تحميل المنتجات.</p>';
            }
        });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) { modal.style.display = 'none'; }
    });
});
