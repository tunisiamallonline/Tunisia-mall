const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);
const $=id=>document.getElementById(id);
let session=null;
async function init(){
 const {data}=await sb.auth.getSession(); session=data.session; renderAuth();
 if(session) loadOrders();
 sb.auth.onAuthStateChange((_e,s)=>{session=s;renderAuth();if(s)loadOrders();});
}
function renderAuth(){
 $("loginBox").hidden=!!session; $("ordersBox").hidden=!session; $("logout").hidden=!session;
}
$("login").onclick=async()=>{
 const {error}=await sb.auth.signInWithPassword({email:$("email").value.trim(),password:$("password").value});
 $("loginMsg").textContent=error?error.message:"تم الدخول.";
};
$("logout").onclick=()=>sb.auth.signOut();
async function loadOrders(){
 const {data,error}=await sb.from("orders").select("*").order("created_at",{ascending:false});
 if(error){$("orders").innerHTML=`<p class="danger">${error.message}</p>`;return;}
 $("allCount").textContent=data.length; $("newCount").textContent=data.filter(x=>x.status==="new").length;
 $("orders").innerHTML=data.map(o=>`
 <article class="order">
  <h3>طلب #${o.id.slice(0,8)}</h3>
  <p><b>العميل:</b> ${escapeHtml(o.customer_name)} — ${escapeHtml(o.phone)}</p>
  <p><b>العنوان:</b> ${escapeHtml(o.address)} ${escapeHtml(o.city||"")}</p>
  <p><b>المجموع:</b> ${Number(o.total).toFixed(3)} DT — <span class="muted">${new Date(o.created_at).toLocaleString("fr-TN")}</span></p>
  <pre>${escapeHtml(JSON.stringify(o.items,null,2))}</pre>
  <select class="status" data-id="${o.id}">
   ${["new","confirmed","preparing","shipped","delivered","cancelled"].map(s=>`<option value="${s}" ${s===o.status?"selected":""}>${s}</option>`).join("")}
  </select>
  <button class="primary save" onclick="updateStatus('${o.id}',this)">حفظ الحالة</button>
 </article>`).join("") || "<p>لا توجد طلبات حالياً.</p>";
}
async function updateStatus(id,btn){
 const select=btn.previousElementSibling;
 const {error}=await sb.from("orders").update({status:select.value}).eq("id",id);
 if(error) alert(error.message); else loadOrders();
}
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
init();
