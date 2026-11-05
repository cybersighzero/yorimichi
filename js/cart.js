let rcpt=null; // set after an order so the receipt survives a language switch
/* Basket: quantities, removal, totals, demo checkout. State persists via localStorage. */
function render(){
 if(rcpt){showReceipt();return}
 const ids=Object.keys(cart).filter(byId),el=$('#cartBox');
 if(!ids.length){el.innerHTML='<div class="empty"><p style="font-size:2.4rem">🧺</p><p>'+t('c_empty')+'</p><p style="margin-top:16px"><a class="btn" href="shop.html" data-i18n="cont"></a></p></div>';applyLang(el);return}
 const sub=ids.reduce((a,id)=>a+priceOf(byId(id))*cart[id],0),ship=sub>=FREE_SHIP?0:SHIP;
 el.innerHTML=`<div class="cart"><div>${ids.map(id=>{const p=byId(id);return `<div class="row"><a href="product.html?id=${id}"><img src="${pImg(p)}" alt="${p.name}"></a><div><a href="product.html?id=${id}"><b>${p.name}</b></a><p class="jp">${yen(priceOf(p))} ${t('c_each')}</p><button class="rm" data-rm="${id}">${t('c_rm')}</button></div><div class="qty"><button data-d="${id}" aria-label="Decrease ${p.name}">−</button><span>${cart[id]}</span><button data-u="${id}" aria-label="Increase ${p.name}">+</button></div></div>`}).join('')}<p style="margin-top:18px"><a class="btn ghost" href="shop.html" data-i18n="cont"></a></p></div><aside class="panel sum"><p><span data-i18n="sub"></span><span>${yen(sub)}</span></p><p><span data-i18n="ship"></span><span>${ship?yen(ship):t('c_free')}</span></p><div class="shipbar" aria-hidden="true"><i style="width:${Math.min(100,Math.round(sub/FREE_SHIP*100))}%"></i></div><p class="jp">${ship?t('c_more1')+yen(FREE_SHIP-sub)+t('c_more2'):t('c_unl')}</p><p class="tot"><span data-i18n="total"></span><span>${yen(sub+ship)}</span></p><button class="btn" style="width:100%" id="co" data-i18n="checkout"></button></aside></div>`;
 applyLang(el);
}
$('#cartBox').onclick=e=>{
 const u=e.target.closest('[data-u]'),d=e.target.closest('[data-d]'),r=e.target.closest('[data-rm]');
 if(u)cart[u.dataset.u]++;
 else if(d){const i=d.dataset.d;cart[i]>1?cart[i]--:delete cart[i]}
 else if(r){delete cart[r.dataset.rm];toast(t('t_rm'))}
 else if(e.target.closest('#co')){openCheckout();return}
 else return;
 saveCart();render();
};
document.addEventListener('ym:lang',render);
render();

/* Checkout (demo): details dialog, then a confirmation receipt. Nothing is sent or stored. */
function openCheckout(){
 const ids=Object.keys(cart).filter(byId);if(!ids.length)return;
 const sub=ids.reduce((a,id)=>a+priceOf(byId(id))*cart[id],0),ship=sub>=FREE_SHIP?0:SHIP,total=sub+ship,count=cartCount();
 $('#co-dlg')?.remove();
 const d=document.createElement('dialog');d.id='co-dlg';d.className='dlg';d.setAttribute('aria-labelledby','co-t');
 d.innerHTML=`<form id="coForm"><h2 id="co-t">${t('d_title')} <span class="jp">レジ</span></h2><p class="jp">${t('d_demo')}</p><label>${t('d_name')}<input name="n" required autocomplete="name"></label><label>${t('d_addr')}<input name="a" required placeholder="3-12-7 Yorimichi-cho, Setagaya"></label><label>${t('d_slot')}<select name="s"><option>${t('s1')}</option><option>${t('s2')}</option><option>${t('s3')}</option></select></label><p class="dtot"><span>${count} ${t('d_items')}</span><b>${yen(total)}</b></p><div class="acts"><button type="button" class="btn ghost" id="coX">${t('d_cancel')}</button><button class="btn">${t('d_place')}</button></div></form>`;
 document.body.append(d);d.showModal();
 $('#coX').onclick=()=>d.close();
 d.addEventListener('close',()=>d.remove());
 $('#coForm').onsubmit=e=>{
  e.preventDefault();const f=new FormData(e.target),no='YM-'+Math.floor(100000+Math.random()*900000);
  cart={};saveCart();d.close();
  rcpt={no,total,n:f.get('n'),a:f.get('a'),s:f.get('s')};showReceipt();
  scrollTo({top:0,behavior:'smooth'});toast(t('t_order'));
 };
}

/* Receipt is kept in memory so the language toggle can re-render it */
function showReceipt(){
 const r=rcpt;
 $('#cartBox').innerHTML=`<div class="empty receipt"><p style="font-size:2.4rem">🍙</p><h2>${t('r1')}<span id="oN"></span>${t('r2')}</h2><p>${t('r_order')} <b>${r.no}</b> ${t('r_note')}</p><dl class="meta"><dt>${t('r_to')}</dt><dd id="oA"></dd><dt>${t('r_slot')}</dt><dd id="oS"></dd><dt>${t('total')}</dt><dd>${yen(r.total)}</dd></dl><a class="btn" href="shop.html">${t('r_back')}</a></div>`;
 $('#oN').textContent=r.n;$('#oA').textContent=r.a;$('#oS').textContent=r.s;
}
