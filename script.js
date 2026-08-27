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
const SUPABASE_URL="https://sxajasczcwurclchyluf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY="sb_publishable_FbKKHDuGIz_21743WXFYbg_BVhd6jvk";
const tmSupabase=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);

function orderWhatsApp(){
  if(!cart.length)return alert(lang==="ar"?"أضف منتجاً إلى السلة أولاً.":"Ajoutez d'abord un produit.");

  const old=document.getElementById("tmOrderModal");
  if(old) old.remove();

  const modal=document.createElement("div");
  modal.id="tmOrderModal";
  modal.innerHTML=`
    <div style="position:fixed;inset:0;background:rgba(0,0,0,.72);z-index:9999;display:grid;place-items:center;padding:18px">
      <div style="width:min(520px,100%);background:#fff;color:#111;border-radius:18px;padding:20px;box-shadow:0 20px 60px rgba(0,0,0,.35);font-family:Arial,sans-serif;direction:${lang==="ar"?"rtl":"ltr"}">
        <h2 style="margin-top:0">${lang==="ar"?"تأكيد الطلب":"Confirmer la commande"}</h2>
        <p style="color:#555">${lang==="ar"?"أدخل معلومات التوصيل. سيتم حفظ الطلب في لوحة التحكم ثم فتح WhatsApp.":"Entrez vos informations. La commande sera enregistrée dans l'administration puis WhatsApp sera ouvert."}</p>
        <input id="tmName" placeholder="${lang==="ar"?"الاسم الكامل":"Nom complet"}" style="width:100%;padding:12px;margin:6px 0;border:1px solid #ddd;border-radius:10px;box-sizing:border-box">
        <input id="tmPhone" type="tel" placeholder="${lang==="ar"?"رقم الهاتف":"Téléphone"}" style="width:100%;padding:12px;margin:6px 0;border:1px solid #ddd;border-radius:10px;box-sizing:border-box">
        <input id="tmAddress" placeholder="${lang==="ar"?"العنوان":"Adresse"}" style="width:100%;padding:12px;margin:6px 0;border:1px solid #ddd;border-radius:10px;box-sizing:border-box">
        <input id="tmCity" placeholder="${lang==="ar"?"المدينة":"Ville"}" style="width:100%;padding:12px;margin:6px 0;border:1px solid #ddd;border-radius:10px;box-sizing:border-box">
        <textarea id="tmNotes" placeholder="${lang==="ar"?"ملاحظات (اختياري)":"Notes (facultatif)"}" style="width:100%;padding:12px;margin:6px 0;border:1px solid #ddd;border-radius:10px;box-sizing:border-box;min-height:70px"></textarea>
        <div id="tmOrderMsg" style="margin:8px 0;color:#b42318;font-size:14px"></div>
        <div style="display:flex;gap:8px;margin-top:10px">
          <button id="tmCancel" style="flex:1;padding:12px;border:0;border-radius:10px;background:#eee;cursor:pointer">${lang==="ar"?"إلغاء":"Annuler"}</button>
          <button id="tmConfirm" style="flex:2;padding:12px;border:0;border-radius:10px;background:#0b63f6;color:#fff;font-weight:700;cursor:pointer">${lang==="ar"?"تأكيد وإرسال عبر WhatsApp":"Confirmer et envoyer sur WhatsApp"}</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);
  document.getElementById("tmCancel").onclick=()=>modal.remove();
  document.getElementById("tmName").focus();

  document.getElementById("tmConfirm").onclick=async()=>{
    const name=document.getElementById("tmName").value.trim();
    const phone=document.getElementById("tmPhone").value.trim();
    const address=document.getElementById("tmAddress").value.trim();
    const city=document.getElementById("tmCity").value.trim();
    const notes=document.getElementById("tmNotes").value.trim();
    const msgBox=document.getElementById("tmOrderMsg");
    if(!name||!phone||!address){msgBox.textContent=lang==="ar"?"الاسم ورقم الهاتف والعنوان مطلوبة.":"Nom, téléphone et adresse sont obligatoires.";return}

    const items=cart.map(i=>{const p=PRODUCTS.find(x=>x.id===i.id);return {id:p.id,name:p.name,price:Number(p.price),quantity:i.qty,qty:i.qty}});
    const total=items.reduce((sum,i)=>sum+i.price*i.quantity,0);
    const btn=document.getElementById("tmConfirm");
    btn.disabled=true;btn.textContent=lang==="ar"?"جاري حفظ الطلب...":"Enregistrement...";
    msgBox.textContent="";

    try{
      const {data,error}=await tmSupabase.from("orders").insert({
        customer_name:name,phone,address,city:city||null,items,total:Number(total.toFixed(3)),payment_method:"cash_on_delivery",status:"new",notes:notes||null
      }).select("id").single();
      if(error) throw error;

      let wa=lang==="ar"?"مرحبا، أريد تأكيد طلبي:\n":"Bonjour, je souhaite confirmer ma commande:\n";
      items.forEach(i=>{wa+=`- ${i.name} × ${i.quantity} = ${money(i.price*i.quantity)}\n`});
      wa+=`\n${lang==="ar"?"رقم الطلب":"Commande #"}: ${data?.id||""}\n`;
      wa+=`${lang==="ar"?"الاسم":"Nom"}: ${name}\n${lang==="ar"?"الهاتف":"Téléphone"}: ${phone}\n${lang==="ar"?"العنوان":"Adresse"}: ${address}\n`;
      if(city)wa+=`${lang==="ar"?"المدينة":"Ville"}: ${city}\n`;
      wa+=`\n${lang==="ar"?"المجموع":"Total"}: ${money(total)}\n${lang==="ar"?"الدفع: عند الاستلام":"Paiement: à la livraison"}`;
      modal.remove();
      closeCart();
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(wa)}`,"_blank");
      cart=[];saveCart();
      alert(lang==="ar"?"تم تسجيل الطلب بنجاح وإرساله إلى WhatsApp. رقم الطلب: "+(data?.id||""):"Commande enregistrée avec succès. Référence: "+(data?.id||""));
    }catch(e){
      btn.disabled=false;btn.textContent=lang==="ar"?"تأكيد وإرسال عبر WhatsApp":"Confirmer et envoyer sur WhatsApp";
      msgBox.textContent=(lang==="ar"?"تعذر حفظ الطلب: ":"Impossible d'enregistrer la commande: ")+(e?.message||String(e));
    }
  };
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