let currentLang = 'fr';
let cart = [];
let allProducts = [];

const defaultProducts = [
    {
        id: "1",
        name_fr: "Parfum Luxe Homme",
        name_ar: "عطر رجالي فاخر",
        price: 120.00,
        image_url: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500"
    },
    {
        id: "2",
        name_fr: "Montre Équilibre",
        name_ar: "ساعة يد أنيقة",
        price: 250.00,
        image_url: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500"
    }
];

function getSupabaseClient() {
    const url = localStorage.getItem('supabase_url');
    const key = localStorage.getItem('supabase_key');
    if (url && key && window.supabase) {
        return window.supabase.createClient(url, key);
    }
    return null;
}

async function loadProducts() {
    const loadingElem = document.getElementById('loading');
    const client = getSupabaseClient();
    
    if (client) {
        try {
            const { data, error } = await client.from('products').select('*');
            if (!error && data && data.length > 0) {
                allProducts = data;
            } else {
                allProducts = defaultProducts;
            }
        } catch (e) {
            allProducts = defaultProducts;
        }
    } else {
        allProducts = defaultProducts;
    }

    if(loadingElem) loadingElem.style.display = 'none';
    renderProducts(allProducts);
}

function renderProducts(products) {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = products.map(p => {
        const title = currentLang === 'ar' ? (p.name_ar || p.name_fr) : (p.name_fr || p.name_ar);
        const btnText = currentLang === 'ar' ? 'إضافة إلى السلة 🛒' : 'Ajouter au Panier 🛒';
        return `
            <div class="product-card">
                <img src="${p.image_url}" alt="${title}">
                <div class="product-details">
                    <h3>${title}</h3>
                    <div class="product-price">${parseFloat(p.price).toFixed(2)} TND</div>
                    <button class="add-to-cart-btn" onclick="addToCart('${p.id}')">${btnText}</button>
                </div>
            </div>
        `;
    }).join('');
}

function filterProducts() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const filtered = allProducts.filter(p => 
        (p.name_fr && p.name_fr.toLowerCase().includes(query)) ||
        (p.name_ar && p.name_ar.toLowerCase().includes(query))
    );
    renderProducts(filtered);
}

function addToCart(productId) {
    const product = allProducts.find(p => p.id == productId);
    if (!product) return;

    const existing = cart.find(item => item.id == productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    const totalQty = cart.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

    if (cartCount) cartCount.innerText = totalQty;
    if (cartTotal) cartTotal.innerText = totalPrice.toFixed(2);

    if (cartItems) {
        if(cart.length === 0) {
            cartItems.innerHTML = `<p style="text-align:center; padding:20px;">${currentLang === 'ar' ? 'السلة فارغة' : 'Votre panier est vide'}</p>`;
        } else {
            cartItems.innerHTML = cart.map(item => {
                const title = currentLang === 'ar' ? (item.name_ar || item.name_fr) : item.name_fr;
                return `
                    <div class="cart-item">
                        <div>
                            <strong>${title}</strong><br>
                            <small>${parseFloat(item.price).toFixed(2)} TND x ${item.quantity}</small>
                        </div>
                        <button onclick="removeFromCart('${item.id}')" style="background:#ef4444; color:white; padding:4px 8px; border-radius:4px;">X</button>
                    </div>
                `;
            }).join('');
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id != productId);
    updateCartUI();
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'fr' ? 'ar' : 'fr';
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.getElementById('lang-btn').innerText = currentLang === 'ar' ? 'Français' : 'العربية';
    
    document.getElementById('site-title').innerText = 'Tunisia Mall';
    document.getElementById('welcome-msg').innerText = currentLang === 'ar' ? 'مرحباً بكم في Tunisia Mall' : 'Bienvenue chez Tunisia Mall';
    document.getElementById('sub-msg').innerText = currentLang === 'ar' ? 'متجر إلكتروني تونسي عصري' : 'Boutique en ligne tunisienne moderne';
    document.getElementById('products-title').innerText = currentLang === 'ar' ? 'منتجاتنا' : 'Nos Produits';
    document.getElementById('cart-title').innerText = currentLang === 'ar' ? 'سلة التسوق' : 'Mon Panier';
    document.getElementById('search-input').placeholder = currentLang === 'ar' ? 'البحث عن المنتجات...' : 'Rechercher des produits...';
    
    renderProducts(allProducts);
    updateCartUI();
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    document.getElementById('theme-btn').innerText = newTheme === 'light' ? '🌙' : '☀️';
}

function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert(currentLang === 'ar' ? 'السلة فارغة!' : 'Votre panier est vide!');
        return;
    }

    let phone = "21696416123";
    let message = currentLang === 'ar' ? "مرحباً Tunisia Mall، أريد تأكيد الطلبية التالية:\n\n" : "Bonjour Tunisia Mall, je souhaite commander:\n\n";

    cart.forEach(item => {
        const title = currentLang === 'ar' ? item.name_ar : item.name_fr;
        message += `- ${title} (x${item.quantity}) : ${(item.price * item.quantity).toFixed(2)} TND\n`;
    });

    const total = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    message += `\nTotal: ${total.toFixed(2)} TND`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
}

document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
});
