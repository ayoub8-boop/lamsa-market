document.addEventListener('DOMContentLoaded', () => {
    // ===== عناصر واجهة موجودة سابقاً =====
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('modalCaption');
    const closeModalBtn = document.querySelector('.close-modal');
    const container = document.getElementById('products-container');

    // ===== عناصر السلة والطلب =====
    const cartButton = document.getElementById('cartButton');
    const cartCount = document.getElementById('cartCount');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartItemsEl = document.getElementById('cartItems');
    const cartSubtotalEl = document.getElementById('cartSubtotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    const orderModal = document.getElementById('orderModal');
    const closeOrderModalBtn = document.getElementById('closeOrderModalBtn');
    const orderItemsSummary = document.getElementById('orderItemsSummary');
    const wilayaSelect = document.getElementById('wilayaSelect');
    const deliveryTypeRadios = document.querySelectorAll('input[name="deliveryType"]');
    const orderSubtotalEl = document.getElementById('orderSubtotal');
    const orderShippingEl = document.getElementById('orderShipping');
    const orderTotalEl = document.getElementById('orderTotal');
    const customerNameInput = document.getElementById('customerName');
    const customerPhoneInput = document.getElementById('customerPhone');
    const submitOrderBtn = document.getElementById('submitOrderBtn');
    const orderStatusEl = document.getElementById('orderStatus');
    const whatsappFallbackBtn = document.getElementById('whatsappFallbackBtn');

    // ===== شريط فلترة الفئات =====
    const categoryBar = document.getElementById('categoryBar');

    const CATEGORY_ICONS = {
        'الكل': '🛍️',
        'طقم': '👑',
        'سلسلة': '⛓️',
        'براسلي': '🔘',
        'جورمات': '🔗',
        'منقوش': '✨',
        'خاتم': '💍'
    };

    let allProducts = [];
    let activeCategory = 'الكل';

    const myWhatsappNumber = "213665677961";
    const categoryOrder = ['طقم', 'سلسلة', 'براسلي', 'جورمات', 'منقوش', 'خاتم'];

    // ===== حالة السلة (محفوظة في localStorage) =====
    let cart = JSON.parse(localStorage.getItem('lamsa_cart') || '[]');
    // عناصر الطلب الحالي داخل نافذة الطلب (قد تكون السلة كاملة أو منتج واحد لطلب سريع)
    let currentOrderItems = [];

    function saveCart() {
        localStorage.setItem('lamsa_cart', JSON.stringify(cart));
    }

    function updateCartUI() {
        cartCount.textContent = cart.reduce((sum, it) => sum + it.qty, 0);
        cartItemsEl.innerHTML = '';

        if (cart.length === 0) {
            cartItemsEl.innerHTML = '<p class="cart-empty">السلة فارغة حالياً.</p>';
            cartSubtotalEl.textContent = '0';
            checkoutBtn.disabled = true;
            return;
        }

        checkoutBtn.disabled = false;
        let subtotal = 0;

        cart.forEach((item, idx) => {
            subtotal += item.price * item.qty;
            const row = document.createElement('div');
            row.classList.add('cart-item');
            row.innerHTML = `
                <img src="${item.image}" alt="${item.category}">
                <div class="cart-item-info">
                    <span class="cart-item-name">${item.category}</span>
                    <span class="cart-item-price">${item.price} دج</span>
                    <div class="cart-qty-controls">
                        <button class="qty-btn" data-action="decrease" data-idx="${idx}">−</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" data-action="increase" data-idx="${idx}">+</button>
                        <button class="remove-btn" data-idx="${idx}">🗑</button>
                    </div>
                </div>
            `;
            cartItemsEl.appendChild(row);
        });

        cartSubtotalEl.textContent = subtotal;
    }

    function addToCart(product) {
        const existing = cart.find(it => it.id === product.id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ id: product.id, category: product.category, price: product.price, image: product.image, qty: 1 });
        }
        saveCart();
        updateCartUI();
    }

    cartItemsEl?.addEventListener('click', (e) => {
        const idx = e.target.dataset.idx;
        if (idx === undefined) return;
        if (e.target.dataset.action === 'increase') {
            cart[idx].qty += 1;
        } else if (e.target.dataset.action === 'decrease') {
            cart[idx].qty -= 1;
            if (cart[idx].qty <= 0) cart.splice(idx, 1);
        } else if (e.target.classList.contains('remove-btn')) {
            cart.splice(idx, 1);
        }
        saveCart();
        updateCartUI();
    });

    cartButton?.addEventListener('click', () => cartSidebar.classList.add('open'));
    closeCartBtn?.addEventListener('click', () => cartSidebar.classList.remove('open'));

    // ===== نافذة الطلب (تُستخدم لكل من السلة والطلب السريع لمنتج واحد) =====
    function populateWilayaOptions() {
        if (!wilayaSelect || wilayaSelect.options.length > 1) return;
        WILAYAS.forEach(w => {
            const opt = document.createElement('option');
            opt.value = w.code;
            opt.textContent = `${w.code} - ${w.name}`;
            opt.dataset.zone = w.zone;
            wilayaSelect.appendChild(opt);
        });
    }

    function getSubtotal(items) {
        return items.reduce((sum, it) => sum + it.price * it.qty, 0);
    }

    function getSelectedDeliveryType() {
        const checked = Array.from(deliveryTypeRadios).find(r => r.checked);
        return checked ? checked.value : 'stopDesk';
    }

    function updatePriceBreakdown() {
        const subtotal = getSubtotal(currentOrderItems);
        const selectedOption = wilayaSelect.options[wilayaSelect.selectedIndex];
        let shipping = 0;

        if (selectedOption && selectedOption.value) {
            const zone = selectedOption.dataset.zone;
            const deliveryType = getSelectedDeliveryType();
            shipping = ZONE_PRICING[zone] ? ZONE_PRICING[zone][deliveryType] : 0;
        }

        orderSubtotalEl.textContent = subtotal;
        orderShippingEl.textContent = selectedOption && selectedOption.value ? shipping : '—';
        orderTotalEl.textContent = selectedOption && selectedOption.value ? (subtotal + shipping) : subtotal;
    }

    function renderOrderItemsSummary() {
        orderItemsSummary.innerHTML = currentOrderItems.map(it =>
            `<div class="order-summary-row">
                <img src="${it.image}" alt="${it.category}">
                <span>${it.category} ${it.qty > 1 ? `× ${it.qty}` : ''}</span>
                <span>${it.price * it.qty} دج</span>
            </div>`
        ).join('');
    }

    function openOrderModal(items) {
        currentOrderItems = items;
        populateWilayaOptions();
        renderOrderItemsSummary();
        wilayaSelect.value = '';
        customerNameInput.value = '';
        customerPhoneInput.value = '';
        orderStatusEl.textContent = '';
        orderStatusEl.className = 'order-status';
        updatePriceBreakdown();
        orderModal.style.display = 'block';
        cartSidebar.classList.remove('open');
    }

    checkoutBtn?.addEventListener('click', () => {
        if (cart.length === 0) return;
        openOrderModal(cart.map(it => ({ ...it })));
    });

    closeOrderModalBtn?.addEventListener('click', () => { orderModal.style.display = 'none'; });
    wilayaSelect?.addEventListener('change', updatePriceBreakdown);
    deliveryTypeRadios.forEach(r => r.addEventListener('change', updatePriceBreakdown));

    submitOrderBtn?.addEventListener('click', async () => {
        const name = customerNameInput.value.trim();
        const phone = customerPhoneInput.value.trim();
        const selectedOption = wilayaSelect.options[wilayaSelect.selectedIndex];

        if (!name || !phone || !selectedOption || !selectedOption.value) {
            orderStatusEl.textContent = 'الرجاء تعبئة الاسم ورقم الهاتف واختيار الولاية.';
            orderStatusEl.className = 'order-status error';
            return;
        }

        const zone = selectedOption.dataset.zone;
        const deliveryType = getSelectedDeliveryType();
        const shipping = ZONE_PRICING[zone][deliveryType];
        const subtotal = getSubtotal(currentOrderItems);
        const total = subtotal + shipping;

        const payload = {
            customerName: name,
            phone: phone,
            wilayaName: selectedOption.textContent,
            deliveryType: deliveryType,
            items: currentOrderItems.map(it => ({ category: it.category, price: it.price, qty: it.qty, image: it.image })),
            subtotal, shipping, total
        };

        submitOrderBtn.disabled = true;
        orderStatusEl.textContent = 'جارٍ إرسال الطلب...';
        orderStatusEl.className = 'order-status';

        try {
            const res = await fetch('/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (res.ok && data.success) {
                orderStatusEl.textContent = '✅ تم استلام طلبك بنجاح! سنتواصل معك قريباً.';
                orderStatusEl.className = 'order-status success';
                cart = [];
                saveCart();
                updateCartUI();
                setTimeout(() => { orderModal.style.display = 'none'; }, 2500);
            } else {
                throw new Error(data.error || 'فشل الإرسال');
            }
        } catch (err) {
            orderStatusEl.textContent = 'تعذّر إرسال الطلب تلقائياً. جرّب عبر الواتساب بالأسفل.';
            orderStatusEl.className = 'order-status error';
        } finally {
            submitOrderBtn.disabled = false;
        }
    });

    whatsappFallbackBtn?.addEventListener('click', (e) => {
        const selectedOption = wilayaSelect.options[wilayaSelect.selectedIndex];
        const name = customerNameInput.value.trim();
        const phone = customerPhoneInput.value.trim();
        const zone = selectedOption ? selectedOption.dataset.zone : null;
        const deliveryType = getSelectedDeliveryType();
        const shipping = zone ? ZONE_PRICING[zone][deliveryType] : 0;
        const subtotal = getSubtotal(currentOrderItems);
        const total = subtotal + shipping;

        const itemsText = currentOrderItems.map((it, i) =>
            `${i + 1}. ${it.category}${it.qty > 1 ? ` × ${it.qty}` : ''} - ${it.price * it.qty} دج`
        ).join('\n');

        let msg = `مرحباً Lamsa Market ✨، أريد طلب:\n\n${itemsText}\n\nالمجموع: ${subtotal} دج`;
        if (name) msg += `\nالاسم: ${name}`;
        if (phone) msg += `\nالهاتف: ${phone}`;
        if (selectedOption && selectedOption.value) {
            msg += `\nالولاية: ${selectedOption.textContent}\nالتوصيل: ${shipping} دج\nالمجموع الكلي: ${total} دج`;
        }

        const link = `https://wa.me/${myWhatsappNumber}?text=${encodeURIComponent(msg)}`;
        window.open(link, '_blank');
    });

    // ===== عرض المنتجات =====
    function renderGroupedProducts(products) {
        if (!container) return;
        container.innerHTML = '';

        const filtered = activeCategory === 'الكل'
            ? products
            : products.filter(p => (p.category || p.name) === activeCategory);

        if (!filtered || filtered.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #777; padding: 2rem;">لا توجد منتجات في هذه الفئة حالياً.</p>';
            return;
        }

        const grouped = {};
        filtered.forEach(p => {
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

                card.innerHTML = `
                    <div class="image-wrapper">
                        <img src="${product.image}" alt="${category}" loading="lazy"
                             onerror="this.style.border='2px solid red'; console.error('صورة مفقودة:', this.src);">
                        <div class="zoom-overlay">
                            <span class="zoom-btn">🔍 معاينة وتكبير</span>
                        </div>
                    </div>
                    <div class="product-info">
                        <h3>${category}</h3>
                        <span class="product-price">${product.price > 0 ? product.price + ' دج' : 'السعر عند الطلب'}</span>
                        <div class="product-actions">
                            <button class="add-cart-btn">🛒 أضف للسلة</button>
                            <button class="quick-order-btn">⚡ اطلب الآن</button>
                        </div>
                    </div>
                `;

                const imageWrapper = card.querySelector('.image-wrapper');
                imageWrapper.addEventListener('click', () => {
                    if (modal && modalImg && captionText) {
                        modal.style.display = 'block';
                        modalImg.src = product.image;
                        captionText.textContent = `${category} — ${product.price > 0 ? product.price + ' دج' : ''}`;
                    }
                });

                card.querySelector('.add-cart-btn').addEventListener('click', () => addToCart(product));
                card.querySelector('.quick-order-btn').addEventListener('click', () => {
                    openOrderModal([{ id: product.id, category: product.category, price: product.price, image: product.image, qty: 1 }]);
                });

                grid.appendChild(card);
            });

            section.appendChild(grid);
            container.appendChild(section);
        });
    }

    // ===== شريط فلترة الفئات =====
    function buildCategoryMenu(products) {
        if (!categoryBar) return;

        const counts = {};
        products.forEach(p => {
            const cat = p.category || p.name || 'طقم';
            counts[cat] = (counts[cat] || 0) + 1;
        });

        const items = [{ name: 'الكل', count: products.length }]
            .concat(categoryOrder.filter(c => counts[c]).map(c => ({ name: c, count: counts[c] })));

        categoryBar.innerHTML = items.map(it => `
            <button class="category-chip ${it.name === activeCategory ? 'active' : ''}" data-category="${it.name}">
                <span class="chip-icon">${CATEGORY_ICONS[it.name] || '💎'}</span>
                <span class="chip-name">${it.name}</span>
                <span class="chip-count">${it.count}</span>
            </button>
        `).join('');
    }

    categoryBar?.addEventListener('click', (e) => {
        const chip = e.target.closest('.category-chip');
        if (!chip) return;
        activeCategory = chip.dataset.category;
        renderGroupedProducts(allProducts);
        buildCategoryMenu(allProducts);
    });

    fetch('/api/products')
        .then(response => response.json())
        .then(products => {
            allProducts = products;
            renderGroupedProducts(allProducts);
            buildCategoryMenu(allProducts);
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
        if (e.target === modal) modal.style.display = 'none';
        if (e.target === orderModal) orderModal.style.display = 'none';
    });

    updateCartUI();
});
