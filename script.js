const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
let cart = JSON.parse(localStorage.getItem("tm_cart") || "[]");

function money(v){return Number(v).toFixed(3)+" DT";}
function saveCart(){localStorage.setItem("tm_cart",JSON.stringify(cart));renderCart();}
function addToCart(id){
  const p=PRODUCTS.find(x=>x.id===id); if(!p)return;
  const item=cart.find(x=>x.id===id);
  if(item)item.qty++; else cart.push({id:p.id,qty:1});
  saveCart(); openCart();
}
function removeFromCart(id){
  const i=cart.findIndex(x=>x.id===id);
  if(i<0)return;
  if(cart[i].qty>1)cart[i].qty--; else cart.splice(i,1);
  saveCart();
}
function openCart(){document.getElementById("cartPanel").style.display="flex";renderCart();}
function closeCart(){document.getElementById("cartPanel").style.display="none";}
function renderProducts(){
  document.getElementById("products").innerHTML=PRODUCTS.map(p=>`
  <article class="card">
    <img src="${p.image}" alt="${p.nameAr}">
    <h3>${p.nameAr}</h3><div class="price">${money(p.price)}</div>
    <button onclick="addToCart('${p.id}')">أضف إلى السلة</button>
  </article>`).join("");
}
function renderCart(){
  const box=document.getElementById("cartItems");
  let total=0;
  if(!cart.length) box.innerHTML="<p>السلة فارغة.</p>";
  else box.innerHTML=cart.map(x=>{
    const p=PRODUCTS.find(y=>y.id===x.id); const sub=p.price*x.qty; total+=sub;
    return `<div class="cart-row"><span>${p.nameAr} × ${x.qty}</span><span>${money(sub)} <button onclick="removeFromCart('${p.id}')">−</button></span></div>`;
  }).join("");
  document.getElementById("cartTotal").textContent=money(total);
  document.getElementById("cartCount").textContent=`السلة: ${cart.reduce((s,x)=>s+x.qty,0)}`;
}
document.getElementById("orderForm").addEventListener("submit",async e=>{
  e.preventDefault();
  if(!cart.length){alert("السلة فارغة");return;}
  const message=document.getElementById("orderMessage");
  message.className="message"; message.textContent="جاري إرسال الطلب...";
  const items=cart.map(x=>{const p=PRODUCTS.find(y=>y.id===x.id);return {id:p.id,name:p.nameAr,qty:x.qty,price:p.price};});
  const total=items.reduce((s,x)=>s+x.price*x.qty,0);
  const {error}=await supabaseClient.from("orders").insert({
    customer_name:document.getElementById("customerName").value.trim(),
    phone:document.getElementById("phone").value.trim(),
    address:document.getElementById("address").value.trim(),
    city:document.getElementById("city").value.trim(),
    notes:document.getElementById("notes").value.trim(),
    items,total,payment_method:"cash_on_delivery",status:"new"
  });
  if(error){console.error(error);message.className="message error";message.textContent="تعذر إرسال الطلب. حاول مرة أخرى.";return;}
  const phone="21696416123";
  const text=encodeURIComponent(`طلب جديد من Tunisia Mall%0Aالاسم: ${document.getElementById("customerName").value}%0Aالهاتف: ${document.getElementById("phone").value}%0Aالمجموع: ${money(total)}`);
  window.open(`https://wa.me/${phone}?text=${text}`,"_blank");
  cart=[];saveCart();
  message.className="message ok";message.textContent="تم تسجيل طلبك بنجاح. شكراً لك!";
  e.target.reset();
});
renderProducts(); renderCart();
