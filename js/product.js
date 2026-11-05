/* Product details, rendered dynamically from ?id= */
const p=byId(new URLSearchParams(location.search).get('id')),box=$('#pd');let qty=1;
if(!p){box.innerHTML='<div class="empty" style="grid-column:1/-1">We couldn’t find that product. <a href="shop.html">Back to the shelves</a></div>';$('#relWrap').hidden=true}
else{
 document.title=p.name+' | YORIMICHI';
 box.innerHTML=`<img src="${pImg(p)}" alt="${p.name} packaging"><div><p class="jp">${p.cat}${p.tag?' · '+TAGS[p.tag]:''}</p><h1 style="font-size:2.2rem">${p.name}</h1><p class="jp" style="font-size:1.2rem">${p.jp}</p><p class="price">${yen(priceOf(p))} ${p===SPECIAL?`<s class="jp">${yen(p.price)}</s> <span class="tag Sp" style="position:static">Today’s Special</span>`:''}</p><p>${p.desc}</p><dl class="meta"><dt>Category</dt><dd>${p.cat}</dd><dt>Availability</dt><dd>${p.tag=='Limited'?'Limited stock':'In stock, open 24 hours'}</dd></dl><div class="acts"><div class="qty" role="group" aria-label="Quantity"><button id="mn" aria-label="Decrease">−</button><span id="qv">1</span><button id="pl" aria-label="Increase">+</button></div><button class="btn" id="ad" data-i18n="add"></button><button class="chip" data-wish="${p.id}" aria-pressed="false">♥ Wishlist</button></div></div>`;
 $('#mn').onclick=()=>{qty=Math.max(1,qty-1);$('#qv').textContent=qty};
 $('#pl').onclick=()=>{qty=Math.min(20,qty+1);$('#qv').textContent=qty};
 $('#ad').onclick=()=>addToCart(p.id,qty);
 applyLang(box);badges();
 mount($('#rel'),PRODUCTS.filter(x=>x.cat==p.cat&&x!==p).slice(0,4));
}
