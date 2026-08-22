const WHATSAPP_NUMBER="21600000000"; // Remplacez par votre numéro WhatsApp tunisien.

const translations={
fr:{home:"Accueil",categories:"Catégories",products:"Produits",about:"À propos",contact:"Contact",eyebrow:"BIENVENUE CHEZ TUNISIA MALL",heroTitle:'Votre shopping tunisien, <span>simple et rapide.</span>',heroText:"Découvrez nos produits, commandez en quelques clics et payez à la livraison.",shopNow:"Découvrir les produits",explore:"Explorer les catégories",cod:"Paiement à la livraison",support:"Support WhatsApp",tunisia:"Livraison en Tunisie",heroCard:"Une expérience moderne pensée pour les clients tunisiens.",discover:"DÉCOUVRIR",catTitle:"Nos catégories",electronics:"Électronique",electronicSub:"Smartphones, accessoires…",games:"Jeux & loisirs",gamesSub:"Pour petits et grands",homeCat:"Maison",homeSub:"Pratique et utile",fashion:"Mode",fashionSub:"Style au quotidien",selection:"SÉLECTION",featured:"Produits populaires",all:"Toutes les catégories",why:"POURQUOI NOUS",aboutTitle:"Une boutique pensée pour la Tunisie.",easy:"Commande facile",easyText:"Ajoutez vos articles au panier et envoyez votre commande.",safe:"Paiement simple",safeText:"Paiement à la livraison, sans procédure compliquée.",help:"Assistance",helpText:"Contact rapide pour vos questions et commandes.",contactEyebrow:"BESOIN D'AIDE ?",contactTitle:"Nous sommes à votre écoute.",contactText:"Pour commander ou demander une information, contactez-nous sur WhatsApp.",footer:"Boutique en ligne tunisienne",cart:"Votre panier",total:"Total",order:"Commander sur WhatsApp",codNote:"Paiement à la livraison. Les frais de livraison peuvent varier selon la zone."},
ar:{home:"الرئيسية",categories:"الأقسام",products:"المنتجات",about:"من نحن",contact:"اتصل بنا",eyebrow:"مرحبا بكم في TUNISIA MALL",heroTitle:'تسوّق في تونس، <span>بسهولة وسرعة.</span>',heroText:"اكتشف منتجاتنا، اطلب في بضع نقرات وادفع عند الاستلام.",shopNow:"اكتشف المنتجات",explore:"استكشف الأقسام",cod:"الدفع عند الاستلام",support:"دعم عبر واتساب",tunisia:"التوصيل في تونس",heroCard:"تجربة عصرية مصممة للزبون التونسي.",discover:"اكتشف",catTitle:"أقسامنا",electronics:"الإلكترونيات",electronicSub:"هواتف، إكسسوارات وغيرها",games:"الألعاب والترفيه",gamesSub:"للصغار والكبار",homeCat:"المنزل",homeSub:"منتجات عملية ومفيدة",fashion:"الموضة",fashionSub:"أناقة يومية",selection:"اختياراتنا",featured:"منتجات مميزة",all:"كل الأقسام",why:"لماذا نحن",aboutTitle:"متجر مصمم للزبون التونسي.",easy:"طلب سهل",easyText:"أضف المنتجات إلى السلة وأرسل طلبك.",safe:"دفع بسيط",safeText:"الدفع عند الاستلام دون إجراءات معقدة.",help:"المساعدة",helpText:"تواصل سريع لطلباتك واستفساراتك.",contactEyebrow:"هل تحتاج للمساعدة؟",contactTitle:"نحن هنا لمساعدتك.",contactText:"للطلب أو الاستفسار، تواصل معنا عبر واتساب.",footer:"متجر إلكتروني تونسي",cart:"سلة المشتريات",total:"المجموع",order:"اطلب عبر واتساب",codNote:"الدفع عند الاستلام. قد تختلف مصاريف التوصيل حسب المنطقة."}
};

let lang=localStorage.getItem("tm_lang")||"fr";
let cart=JSON.parse(localStorage.getItem("tm_cart")||"[]");

const $=s=>document.querySelector(s);
const money=n=>`${n.toFixed(0)} DT`;

function renderProducts(){
  const q=$("#search").value.trim().toLowerCase(), cat=$("#categoryFilter").value;
  const list=PRODUCTS.filter(p=>(cat==="all"||p.category===cat)&&p.name.toLowerCase().includes(q));
  $("#productGrid").innerHTML=list.map(p=>`<article class="product">
    <div class="product-img"><img loading="lazy" src="${p.image}" alt="${p.name}"></div>
    <div class="product-body"><div class="product-cat">${p.category}</div><h3>${p.name}</h3>
    <div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add" onclick="addToCart(${p.id})">+ ${lang==="ar"?"إضافة":"Ajouter"}</button></div></div>
  </article>`).join("")||'<div class="empty">Aucun produit trouvé.</div>';
}
function addToCart(id){const p=PRODUCTS.find(x=>x.id===id);const item=cart.find(x=>x.id===id);item?item.qty++:cart.push({id,qty:1});saveCart();openCart();}
function saveCart(){localStorage.setItem("tm_cart",JSON.stringify(cart));renderCart();}
function renderCart(){
  const box=$("#cartItems");
  $("#cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0);
  if(!cart.length){box.innerHTML=`<div class="empty">${lang==="ar"?"السلة فارغة":"Votre panier est vide."}</div>`;$("#cartTotal").textContent="0 DT";return}
  let total=0;
  box.innerHTML=cart.map(i=>{const p=PRODUCTS.find(x=>x.id===i.id);total+=p.price*i.qty;return `<div class="cart-line"><div><b>${p.name}</b><small>${money(p.price)} × ${i.qty}</small></div><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><span>${i.qty}</span><button onclick="changeQty(${p.id},1)">+</button></div></div>`}).join("");
  $("#cartTotal").textContent=money(total);
}
function changeQty(id,d){const i=cart.find(x=>x.id===id);if(!i)return;i.qty+=d;if(i.qty<=0)cart=cart.filter(x=>x.id!==id);saveCart();}
function openCart(){$("#cartDrawer").classList.add("open");$("#cartDrawer").setAttribute("aria-hidden","false")}
function closeCart(){$("#cartDrawer").classList.remove("open");$("#cartDrawer").setAttribute("aria-hidden","true")}
function applyLang(){
  document.documentElement.lang=lang;document.documentElement.dir=lang==="ar"?"rtl":"ltr";
  document.querySelectorAll("[data-i18n]").forEach(el=>{const v=translations[lang][el.dataset.i18n];if(v!==undefined)el.innerHTML=v});
  $("#langBtn").textContent=lang==="ar"?"FR":"ع";
  renderProducts();renderCart();
}
function orderWhatsApp(){
  if(!cart.length)return alert(lang==="ar"?"أضف منتجاً إلى السلة أولاً.":"Ajoutez d'abord un produit.");
  let msg=lang==="ar"?"مرحبا، أريد طلب:\n":"Bonjour, je souhaite commander:\n";
  let total=0;cart.forEach(i=>{const p=PRODUCTS.find(x=>x.id===i.id);total+=p.price*i.qty;msg+=`- ${p.name} × ${i.qty} = ${money(p.price)}\n`});
  msg+=`\n${lang==="ar"?"المجموع":"Total"}: ${money(total)}\n${lang==="ar"?"الدفع: عند الاستلام":"Paiement: à la livraison"}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,"_blank");
}
$("#search").addEventListener("input",renderProducts);$("#categoryFilter").addEventListener("change",renderProducts);
$("#cartBtn").onclick=openCart;$("#closeCart").onclick=closeCart;$("#orderBtn").onclick=orderWhatsApp;
$("#cartDrawer").addEventListener("click",e=>{if(e.target.id==="cartDrawer")closeCart()});
$("#langBtn").onclick=()=>{lang=lang==="fr"?"ar":"fr";localStorage.setItem("tm_lang",lang);applyLang()};
$("#themeBtn").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("tm_dark",document.body.classList.contains("dark")?"1":"0")};
document.querySelectorAll(".category-card").forEach(b=>b.onclick=()=>{$("#categoryFilter").value=b.dataset.category;renderProducts();$("#products").scrollIntoView({behavior:"smooth"})});
$("#whatsappLink").href=`https://wa.me/${WHATSAPP_NUMBER}`;
if(localStorage.getItem("tm_dark")==="1")document.body.classList.add("dark");
$("#year").textContent=new Date().getFullYear();
applyLang();