/* Product details, rendered dynamically from ?id= (labels use data-i18n so the language toggle applies instantly) */
const p=byId(new URLSearchParams(location.search).get('id')),box=$('#pd');let qty=1;
if(!p){box.innerHTML='<div class="empty" style="grid-column:1/-1"><span data-i18n="p_nf"></span> <a href="shop.html" data-i18n="r_back"></a></div>';$('#relWrap').hidden=true;applyLang(box)}
else{
 const ck='cat_'+p.cat.replace(' ','_');
 document.title=p.name+' | YORIMICHI';
 box.innerHTML=`<img src="${pImg(p)}" alt="${p.name} packaging"><div><p class="jp"><span data-i18n="${ck}"></span>${p.tag?` · <span data-i18n="tag_${p.tag}"></span>`:''}</p><h1 style="font-size:2.2rem">${p.name}</h1><p class="jp" style="font-size:1.2rem">${p.jp}</p><p class="price">${yen(priceOf(p))} ${p===SPECIAL?`<s class="jp">${yen(p.price)}</s> <span class="tag Sp" style="position:static" data-i18n="special_tag"></span>`:''}</p><p>${p.desc}</p><dl class="meta"><dt data-i18n="p_cat"></dt><dd data-i18n="${ck}"></dd><dt data-i18n="p_av"></dt><dd data-i18n="${p.tag=='Limited'?'p_lim':'p_in'}"></dd></dl><div class="acts"><div class="qty" role="group" aria-label="Quantity"><button id="mn" aria-label="Decrease">−</button><span id="qv">1</span><button id="pl" aria-label="Increase">+</button></div><button class="btn" id="ad" data-i18n="add"></button><button class="chip" data-wish="${p.id}" aria-pressed="false" data-i18n="p_wish"></button></div></div>`;
 $('#mn').onclick=()=>{qty=Math.max(1,qty-1);$('#qv').textContent=qty};
 $('#pl').onclick=()=>{qty=Math.min(20,qty+1);$('#qv').textContent=qty};
 $('#ad').onclick=()=>addToCart(p.id,qty);
 applyLang(box);badges();
 mount($('#rel'),PRODUCTS.filter(x=>x.cat==p.cat&&x!==p).slice(0,4));
}
