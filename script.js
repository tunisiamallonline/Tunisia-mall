let cart = JSON.parse(localStorage.getItem("tm_cart") || "[]");
let filteredProducts = [...PRODUCTS];

const $ = (id) => document.getElementById(id);
const money = (n) => Number(n).toFixed(3) + " DT";

function saveCart(){ localStorage.setItem("tm_cart", JSON.stringify(cart)); }

function renderProducts(){
  const grid = $("productsGrid");
  const empty = $("emptyState");
  if(!grid) return;
  grid.innerHTML = "";
  if(!filteredProducts.length){ empty.hidden = false; return; }
  empty.hidden = true;

  filteredProducts.forEach(p=>{
    const card = document.createElement("article");
    card.className = "product-card";
    const image = p.image
      ? `<img src="${p.image}" alt="${escapeHtml(p.name)}" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">`
      : "";
    card.innerHTML = `
      <div class="product-image">
        ${image}
        <span class="product-placeholder" style="${p.image ? "display:none":""}">${p.icon || "🛍️"}</span>
        ${p.badge ? `<span class="badge">${escapeHtml(p.badge)}</span>` : ""}
      </div>
      <div class="product-info">
        <span class="product-cat">${escapeHtml(p.category)}</span>
        <div class="product-name">${escapeHtml(p.name)}</div>
        <div class="product-bottom">
          <span class="price">${money(p.price)}</span>
          <button class="add-btn" onclick="addToCart(${p.id})">أضف للسلة</button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}

function addToCart(id){
  const p = PRODUCTS.find(x=>x.id===id); if(!p) return;
  const found = cart.find(x=>x.id===id);
  if(found) found.qty++; else cart.push({id:p.id,qty:1});
  saveCart(); renderCart(); openCart();
}

function changeQty(id,delta){
  const item=cart.find(x=>x.id===id); if(!item)return;
  item.qty += delta;
  if(item.qty<=0) cart=cart.filter(x=>x.id!==id);
  saveCart(); renderCart();
}

function renderCart(){
  $("cartCount").textContent = cart.reduce((s,x)=>s+x.qty,0);
  const box=$("cartItems"); box.innerHTML="";
  let total=0;
  if(!cart.length){
    box.innerHTML='<div class="empty-state"><div>🛒</div><h3>السلة فارغة</h3><p>أضف منتجات للبدء.</p></div>';
  }else{
    cart.forEach(item=>{
      const p=PRODUCTS.find(x=>x.id===item.id); if(!p)return;
      total += p.price*item.qty;
      box.innerHTML += `<div class="cart-item">
        <div class="cart-thumb">${p.icon||"🛍️"}</div>
        <div><h4>${escapeHtml(p.name)}</h4><small>${money(p.price)}</small>
          <div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><b>${item.qty}</b><button onclick="changeQty(${p.id},1)">+</button></div>
        </div>
        <b>${money(p.price*item.qty)}</b>
      </div>`;
    });
  }
  $("cartTotal").textContent=money(total);
}

function openCart(){ $("cartPanel").classList.add("open"); $("cartPanel").setAttribute("aria-hidden","false"); $("overlay").classList.add("show"); }
function closeCart(){ $("cartPanel").classList.remove("open"); $("cartPanel").setAttribute("aria-hidden","true"); $("overlay").classList.remove("show"); }

function applyFilters(){
  const q=$("searchInput").value.trim().toLowerCase();
  const cat=$("categoryFilter").value;
  const sort=$("sortFilter").value;
  filteredProducts=PRODUCTS.filter(p=>
    (cat==="all"||p.category===cat) &&
    (!q || (p.name+" "+p.category).toLowerCase().includes(q))
  );
  if(sort==="low") filteredProducts.sort((a,b)=>a.price-b.price);
  if(sort==="high") filteredProducts.sort((a,b)=>b.price-a.price);
  renderProducts();
}

$("searchForm").addEventListener("submit",e=>{e.preventDefault();applyFilters();document.querySelector("#products").scrollIntoView({behavior:"smooth"});});
$("searchInput").addEventListener("input",applyFilters);
$("categoryFilter").addEventListener("change",applyFilters);
$("sortFilter").addEventListener("change",applyFilters);
$("cartBtn").addEventListener("click",openCart);
$("closeCart").addEventListener("click",closeCart);
$("overlay").addEventListener("click",closeCart);
$("menuBtn").addEventListener("click",()=>$("nav").classList.toggle("open"));

document.querySelectorAll(".category-card").forEach(btn=>{
  btn.addEventListener("click",()=>{
    $("categoryFilter").value=btn.dataset.category;
    applyFilters();
    document.querySelector("#products").scrollIntoView({behavior:"smooth"});
  });
});

$("whatsappOrder").addEventListener("click",()=>{
  if(!cart.length){alert("السلة فارغة.");return;}
  let msg="مرحباً Tunisia Mall، أريد تأكيد هذا الطلب:%0A%0A";
  let total=0;
  cart.forEach(item=>{
    const p=PRODUCTS.find(x=>x.id===item.id);
    if(p){ total+=p.price*item.qty; msg+=`- ${encodeURIComponent(p.name)} × ${item.qty} = ${encodeURIComponent(money(p.price*item.qty))}%0A`; }
  });
  msg += `%0Aالمجموع: ${encodeURIComponent(money(total))}%0Aالدفع: عند الاستلام`;
  window.open("https://wa.me/21696416123?text="+msg,"_blank");
});

renderProducts();
renderCart();
