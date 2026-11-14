// Cambia estos productos, nombres y precios por los de tu negocio.
const products = [
  {id:1,name:"Tenis urbanos",category:"TENIS / UNISEX",price:28900,art:"shoe"},
  {id:2,name:"Camiseta esencial",category:"ROPA / BÁSICOS",price:8500,art:"shirt"},
  {id:3,name:"Gorra clásica",category:"ACCESORIOS / UNISEX",price:6500,art:"cap"},
  {id:4,name:"Sudadera relaxed",category:"ROPA / CONFORT",price:18500,art:"shirt light"},
  {id:5,name:"Bolso diario",category:"ACCESORIOS / ESENCIAL",price:14500,art:"bag light"},
  {id:6,name:"Tenis clásicos",category:"TENIS / CASUAL",price:32500,art:"shoe light"}
];
let cart = JSON.parse(localStorage.getItem("nb-cart") || "[]");
const $ = (s) => document.querySelector(s);
const money = n => new Intl.NumberFormat("es-CR",{style:"currency",currency:"CRC",maximumFractionDigits:0}).format(n);
function save(){localStorage.setItem("nb-cart",JSON.stringify(cart));renderCart()}
function renderProducts(){
  $("#product-grid").innerHTML=products.map(p=>`
    <article class="product-card">
      <div class="product-art"><div class="shape ${p.art}"></div><span class="art-label">HANS — 0${p.id}</span></div>
      <div class="product-info"><div><h3>${p.name}</h3><p class="product-sub">${p.category}</p></div><span class="price">${money(p.price)}</span></div>
      <button class="add-button" data-add="${p.id}">AÑADIR AL CARRITO　＋</button>
    </article>`).join("");
}
function renderCart(){
  $("#cart-count").textContent=cart.reduce((s,i)=>s+i.qty,0);
  $("#cart-items").innerHTML=cart.length?cart.map(i=>`
    <div class="cart-row"><div><strong>${i.name}</strong><small>${money(i.price)} c/u</small>
      <div class="qty-controls"><button data-minus="${i.id}" aria-label="Restar">−</button><span>${i.qty}</span><button data-plus="${i.id}" aria-label="Sumar">＋</button></div>
    </div><div><strong>${money(i.price*i.qty)}</strong><br><button class="remove" data-remove="${i.id}">Eliminar</button></div></div>`).join(""):'<p class="muted">Tu carrito está vacío.</p>';
  $("#cart-total").textContent=money(cart.reduce((s,i)=>s+i.price*i.qty,0));
}
function toast(msg){const el=$("#toast");el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2600)}
function openCart(){$("#cart-drawer").classList.add("open");$("#cart-drawer").setAttribute("aria-hidden","false");$("#overlay").hidden=false}
function closeCart(){$("#cart-drawer").classList.remove("open");$("#cart-drawer").setAttribute("aria-hidden","true");$("#overlay").hidden=true}
document.addEventListener("click",e=>{
  const add=e.target.closest("[data-add]"); if(add){const p=products.find(x=>x.id===Number(add.dataset.add));const item=cart.find(x=>x.id===p.id);item?item.qty++:cart.push({...p,qty:1});save();toast("Producto agregado al carrito");return}
  const plus=e.target.closest("[data-plus]");if(plus){cart.find(x=>x.id===Number(plus.dataset.plus)).qty++;save();return}
  const minus=e.target.closest("[data-minus]");if(minus){const item=cart.find(x=>x.id===Number(minus.dataset.minus));item.qty--;if(item.qty<=0)cart=cart.filter(x=>x.id!==item.id);save();return}
  const remove=e.target.closest("[data-remove]");if(remove){cart=cart.filter(x=>x.id!==Number(remove.dataset.remove));save()}
});
$("#open-cart").onclick=openCart;$("#close-cart").onclick=closeCart;$("#overlay").onclick=closeCart;
$("#checkout-button").onclick=()=>{if(!cart.length){toast("Agrega al menos un producto");return}$("#checkout-modal").hidden=false};
$("#close-checkout").onclick=()=>$("#checkout-modal").hidden=true;
function getCheckoutData(){
  const formEl=$("#checkout-form");
  if(!formEl.reportValidity()) return null;
  return Object.fromEntries(new FormData(formEl).entries());
}
function createOrder(form, channel){
  const order={number:Date.now(),createdAt:new Date().toISOString(),customer:form,
    items:cart.map(({id,name,price,qty})=>({id,name,price,qty})),
    total:cart.reduce((s,i)=>s+i.price*i.qty,0),
    status:channel==="web"?"Pendiente de integración de pago":"Pedido por WhatsApp"};
  // DEMO: el navegador guarda localmente. Para producción se necesita backend.
  const orders=JSON.parse(localStorage.getItem("nb-orders")||"[]");
  orders.unshift(order);localStorage.setItem("nb-orders",JSON.stringify(orders));
  return order;
}
function whatsappMessage(order){
  const lines=order.items.map(i=>`${i.qty} x ${i.name} — ${money(i.price*i.qty)}`).join("\n");
  const c=order.customer;
  return `Hola, Tienda Hans. Quiero confirmar mi pedido #${String(order.number).slice(-6)}:\n${lines}\nTotal: ${money(order.total)}\nNombre: ${c.name}\nTeléfono: ${c.phone}\nCorreo: ${c.email}\nEntrega: ${c.delivery}\nDirección: ${c.address}\nTallas / colores / notas: ${c.notes||"No indicadas"}`;
}
function finishOrder(){
  $("#checkout-modal").hidden=true;closeCart();cart=[];save();$("#checkout-form").reset();
}
$("#checkout-form").addEventListener("submit",e=>{
  e.preventDefault();
  const form=getCheckoutData();if(!form)return;
  const order=createOrder(form,"web");
  finishOrder();
  toast("Pedido de demostración registrado. Falta conectar el pago web.");
});
$("#whatsapp-checkout").addEventListener("click",()=>{
  const form=getCheckoutData();if(!form)return;
  const order=createOrder(form,"whatsapp");
  const WHATSAPP_NEGOCIO = "50661344327"; // WhatsApp Tienda Hans y SINPE Móvil.
  if(!WHATSAPP_NEGOCIO){toast("Configura tu WhatsApp de negocio en app.js.");return;}
  window.open(`https://wa.me/${WHATSAPP_NEGOCIO}?text=${encodeURIComponent(whatsappMessage(order))}`,"_blank");
  finishOrder();
});
$("#year").textContent=new Date().getFullYear();
renderProducts();renderCart();
