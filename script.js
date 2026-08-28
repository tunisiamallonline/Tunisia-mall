const WHATSAPP_NUMBER="21600000000"; // Remplacez par votre numéro WhatsApp tunisien.

const translations={
fr:{home:"Accueil",categories:"Catégories",products:"Produits",about:"À propos",contact:"Contact",eyebrow:"BIENVENUE CHEZ TUNISIA MALL",heroTitle:'Votre shopping tunisien, <span>simple et rapide.</span>',heroText:"Découvrez nos produits, commandez en quelques clics et payez à la livraison.",shopNow:"Découvrir les produits",explore:"Explorer les catégories",cod:"Paiement à la livraison",support:"Support WhatsApp",tunisia:"Livraison en Tunisie",heroCard:"Une expérience moderne pensée pour les clients tunisiens.",discover:"DÉCOUVRIR",catTitle:"Nos catégories",electronics:"Électronique",electronicSub:"Smartphones, accessoires…",games:"Jeux & loisirs",gamesSub:"Pour petits et grands",homeCat:"Maison",homeSub:"Pratique et utile",fashion:"Mode",fashionSub:"Style au quotidien",selection:"SÉLECTION",featured:"Produits populaires",all:"Toutes les catégories",why:"POURQUOI NOUS",aboutTitle:"Une boutique pensée pour la Tunisie.",easy:"Commande facile",easyText:"Ajoutez vos articles au panier et envoyez votre commande.",safe:"Paiement simple",safeText:"Paiement à la livraison, sans procédure compliquée.",help:"Assistance",helpText:"Contact rapide pour vos questions et commandes.",contactEyebrow:"BESOIN D'AIDE ?",contactTitle:"Nous sommes à votre écoute.",contactText:"Pour commander ou demander une information, contactez-nous sur WhatsApp.",footer:"Boutique en ligne tunisienne",cart:"Votre panier",total:"Total",order:"Commander sur WhatsApp",codNote:"Paiement à la livraison. Les frais de livraison peuvent varier selon la zone."},
ar:{home:"الرئيسية",categories:"الأقسام",products:"المنتجات",about:"من نحن",contact:"اتصل بنا",eyebrow:"مرحبا بكم في TUNISIA MALL",heroTitle:'تسوّق في تونس، <span>بسهولة وسرعة.</span>',heroText:"اكتشف منتجاتنا، اطلب في بضع نقرات وادفع عند الاستلام.",shopNow:"اكتشف المنتجات",explore:"استكشف الأقسام",cod:"الدفع عند الاستلام",support:"دعم عبر واتساب",tunisia:"التوصيل في تونس",heroCard:"تجربة عصرية مصممة للزبون التونسي.",discover:"اكتشف",catTitle:"أقسامنا",electronics:"الإلكترونيات",electronicSub:"هواتف، إكسسوارات وغيرها",games:"الألعاب والترفيه",gamesSub:"للصغار والكبار",homeCat:"المنزل",homeSub:"منتجات عملية ومفيدة",fashion:"الموضة",fashionSub:"أناقة يومية",selection:"اختياراتنا",featured:"منتجات مميزة",all:"كل الأقسام",why:"لماذا نحن",aboutTitle:"متجر مصمم للزبون التونسي.",easy:"طلب سهل",easyText:"أضف المنتجات إلى السلة وأرسل طلبك.",safe:"دفع بسيط",safeText:"الدفع عند الاستلام دون إجراءات معقدة.",help:"المساعدة",helpText:"تواصل سريع لطلباتك واستفساراتك.",contactEyebrow:"هل تحتاج للمساعدة؟",contactTitle:"نحن هنا لمساعدتك.",contactText:"للطلب أو الاستفسار، تواصل معنا عبر واتساب.",footer:"متجر إلكتروني تونسي",cart:"سلة المشتريات",total:"المجموع",order:"اطلب عبر واتساب",codNote:"الدفع عند الاستلام. قد تختلف مصاريف التوصيل حسب المنطقة."}
};

let lang=localStorage.getItem("tm_lang")||"fr";
let cart=JSON.parse(localStorage.getItem("tm_cart")||"[]");
let PRODUCTS=[];

const SUPABASE_URL="https://sxajasczcwurclchyluf.supabase.co";
const SUPABASE_ANON_KEY="sb_publishable_FbKKHDuGIz_21743WXFYbg_BVhd6jvk";
const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY,{auth:{persistSession:false}});

const $=s=>document.querySelector(s);
const money=n=>`${Number(n||0).toFixed(3)} DT`;
const esc=x=>String(x??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));

function normalizeProduct(p){
  return {
    id:p.id,
    name:p.name||p.title||"Produit",
    category:p.category||"Autres",
    price:Number(p.price||0),
    image:p.image_url||p.image||"",
    description:p.description||"",
    stock:Number(p.stock??0),
    active:p.active!==false
  };
}

async function loadProducts(){
  const grid=$("#productGrid");
  if(!grid)return;
  grid.innerHTML=`<div class="empty">${lang==="ar"?"جاري تحميل المنتجات…":"Chargement des produits…"}</div>`;
  try{
    const {data,error}=await sb.from("products").select("*").eq("active",true).order("created_at",{ascending:false});
    if(error)throw error;
    PRODUCTS=(data||[]).map(normalizeProduct);
    // Remove cart items that no longer exist.
    cart=cart.filter(i=>PRODUCTS.some(p=>String(p.id)===String(i.id)));
    localStorage.setItem("tm_cart",JSON.stringify(cart));
    renderProducts();
    renderCart();
  }catch(e){
    PRODUCTS=[];
    grid.innerHTML=`<div class="empty">${lang==="ar"?"تعذر تحميل المنتجات. حاول مرة أخرى.":"Impossible de charger les produits. Réessayez."}<br><small>${esc(e.message||e)}</small></div>`;
    renderCart();
  }
}

function renderProducts(){
  const grid=$("#productGrid"); if(!grid)return;
  const q=$("#search")?.value.trim().toLowerCase()||"";
  const cat=$("#categoryFilter")?.value||"all";
  const list=PRODUCTS.filter(p=>(cat==="all"||p.category===cat)&&p.name.toLowerCase().includes(q));
  if(!list.length){grid.innerHTML=`<div class="empty">${lang==="ar"?"لا توجد منتجات حاليًا.":"Aucun produit disponible."}</div>`;return}
  grid.innerHTML=list.map(p=>`<article class="product">
    <div class="product-img">${p.image?`<img loading="lazy" src="${esc(p.image)}" alt="${esc(p.name)}" onerror="this.style.display='none'">`:`<span>🛍️</span>`}</div>
    <div class="product-body"><div class="product-cat">${esc(p.category)}</div><h3>${esc(p.name)}</h3>
    ${p.description?`<p class="mini">${esc(p.description)}</p>`:""}
    <div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add" onclick="addToCart('${String(p.id).replace(/'/g,"\'")}')">+ ${lang==="ar"?"إضافة":"Ajouter"}</button></div></div>
  </article>`).join("");
}
function addToCart(id){const p=PRODUCTS.find(x=>String(x.id)===String(id));if(!p)return;const item=cart.find(x=>String(x.id)===String(id));item?item.qty++:cart.push({id,qty:1});saveCart();openCart();}
function saveCart(){localStorage.setItem("tm_cart",JSON.stringify(cart));renderCart();}
function renderCart(){
  const box=$("#cartItems"); if(!box)return;
  $("#cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0);
  const valid=cart.map(i=>({...i,p:PRODUCTS.find(x=>String(x.id)===String(i.id))})).filter(x=>x.p);
  cart=valid.map(x=>({id:x.id,qty:x.qty}));
  if(!cart.length){box.innerHTML=`<div class="empty">${lang==="ar"?"السلة فارغة":"Votre panier est vide."}</div>`;$("#cartTotal").textContent="0.000 DT";return}
  let total=0;
  box.innerHTML=valid.map(({id,qty,p})=>{total+=p.price*qty;return `<div class="cart-line"><div><b>${esc(p.name)}</b><small>${money(p.price)} × ${qty}</small></div><div class="qty"><button onclick="changeQty('${String(id).replace(/'/g,"\'")}',-1)">−</button><span>${qty}</span><button onclick="changeQty('${String(id).replace(/'/g,"\'")}',1)">+</button></div></div>`}).join("");
  $("#cartTotal").textContent=money(total);
}
function changeQty(id,d){const i=cart.find(x=>String(x.id)===String(id));if(!i)return;i.qty+=d;if(i.qty<=0)cart=cart.filter(x=>String(x.id)!==String(id));saveCart();}
function openCart(){$("#cartDrawer")?.classList.add("open");$("#cartDrawer")?.setAttribute("aria-hidden","false")}
function closeCart(){$("#cartDrawer")?.classList.remove("open");$("#cartDrawer")?.setAttribute("aria-hidden","true")}
function applyLang(){
  document.documentElement.lang=lang;document.documentElement.dir=lang==="ar"?"rtl":"ltr";
  document.querySelectorAll("[data-i18n]").forEach(el=>{const v=translations[lang][el.dataset.i18n];if(v!==undefined)el.innerHTML=v});
  $("#langBtn").textContent=lang==="ar"?"FR":"ع";
  renderProducts();renderCart();
}
function orderWhatsApp(){
  if(!cart.length)return alert(lang==="ar"?"أضف منتجاً إلى السلة أولاً.":"Ajoutez d'abord un produit.");
  let msg=lang==="ar"?"مرحبا، أريد طلب:\n":"Bonjour, je souhaite commander:\n";
  let total=0;
  cart.forEach(i=>{const p=PRODUCTS.find(x=>String(x.id)===String(i.id));if(!p)return;total+=p.price*i.qty;msg+=`- ${p.name} × ${i.qty} = ${money(p.price)}\n`});
  msg+=`\n${lang==="ar"?"المجموع":"Total"}: ${money(total)}\n${lang==="ar"?"الدفع: عند الاستلام":"Paiement: à la livraison"}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,"_blank");
}

function initStore(){
  $("#search")?.addEventListener("input",renderProducts);
  $("#categoryFilter")?.addEventListener("change",renderProducts);
  $("#cartBtn")?.addEventListener("click",openCart);
  $("#closeCart")?.addEventListener("click",closeCart);
  $("#orderBtn")?.addEventListener("click",orderWhatsApp);
  $("#cartDrawer")?.addEventListener("click",e=>{if(e.target.id==="cartDrawer")closeCart()});
  $("#langBtn")?.addEventListener("click",()=>{lang=lang==="fr"?"ar":"fr";localStorage.setItem("tm_lang",lang);applyLang()});
  $("#themeBtn")?.addEventListener("click",()=>{document.body.classList.toggle("dark");localStorage.setItem("tm_dark",document.body.classList.contains("dark")?"1":"0")});
  document.querySelectorAll(".category-card").forEach(b=>b.addEventListener("click",()=>{$("#categoryFilter").value=b.dataset.category;renderProducts();$("#products").scrollIntoView({behavior:"smooth"})}));
  if($("#whatsappLink"))$("#whatsappLink").href=`https://wa.me/${WHATSAPP_NUMBER}`;
  if(localStorage.getItem("tm_dark")==="1")document.body.classList.add("dark");
  if($("#year"))$("#year").textContent=new Date().getFullYear();
  applyLang();
  loadProducts();
}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initStore);else initStore();
