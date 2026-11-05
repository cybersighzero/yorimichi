/* Shared core: storage, i18n, layout, cart/wishlist state, toasts, product card */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const store={get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};
const yen=n=>'¥'+n.toLocaleString('en-US');
const TAGS={Best:'Bestseller',New:'New Arrival',Limited:'Limited Edition'};
const byId=id=>PRODUCTS.find(p=>p.id===+id);
/* Today's special rotates daily, 15% off */
const SPECIAL=PRODUCTS[Math.floor(Date.now()/864e5)%PRODUCTS.length];
const priceOf=p=>p===SPECIAL?Math.round(p.price*.85):p.price;
const FREE_SHIP=2000,SHIP=300;
const I18N={
en:{nav_home:'Home',nav_shop:'Shop',nav_about:'About',lead:'A neighbourhood konbini that never switches off its lights. Come in out of the rain.',shop_now:'Shop Now',random:'Surprise me',add:'Add to Cart',open:'OPEN 24 HOURS',open_sub:'Every day, including 3 AM.',featured:'Featured',featured_s:'What the regulars grab first.',cats:'Browse categories',special:"Today's Special",special_s:'One item, 15% off, until midnight.',newa:'New Arrivals',newa_s:'Just stocked on the shelf.',promo:'Free delivery over ¥2,000',promo_s:'Stock up for the night shift.',search:'Search snacks, drinks, ramen…',sort_pop:'Most popular',sort_lo:'Price: low to high',sort_hi:'Price: high to low',all:'All',shop_t:'The Shelves',wish:'Wishlist only',cart_t:'Your Basket',sub:'Subtotal',ship:'Delivery',total:'Total',checkout:'Checkout (demo)',cont:'Continue shopping',related:'You might also like',foot:'Your little detour, open all night.',links:'Explore',visit:'Visit'},
ja:{nav_home:'ホーム',nav_shop:'ショップ',nav_about:'私たちについて',lead:'明かりを消さない街角のコンビニ。雨宿りがてら、どうぞ。',shop_now:'今すぐ買う',random:'おまかせスナック',add:'カートに入れる',open:'24時間営業',open_sub:'毎日、午前3時でも。',featured:'おすすめ商品',featured_s:'常連さんが最初に手に取る定番。',cats:'カテゴリー',special:'本日の特価',special_s:'今日だけ15%オフ。',newa:'新商品',newa_s:'棚に並んだばかりです。',promo:'2,000円以上で送料無料',promo_s:'夜勤のおともにまとめ買い。',search:'お菓子・飲み物・ラーメンを検索',sort_pop:'人気順',sort_lo:'価格の安い順',sort_hi:'価格の高い順',all:'すべて',shop_t:'商品棚',wish:'お気に入りのみ',cart_t:'カート',sub:'小計',ship:'送料',total:'合計',checkout:'レジへ（デモ）',cont:'買い物を続ける',related:'こちらもおすすめ',foot:'夜通し開いている、ちいさな寄り道。',links:'メニュー',visit:'店舗情報'}};
let lang=store.get('ym_lang','en');
const t=k=>I18N[lang][k]??I18N.en[k]??k;
function applyLang(root=document){document.documentElement.lang=lang;$$('[data-i18n]',root).forEach(e=>e.textContent=t(e.dataset.i18n));$$('[data-ph]',root).forEach(e=>e.placeholder=t(e.dataset.ph))}
/* State (persisted) */
let cart=store.get('ym_cart',{}),wish=store.get('ym_wish',[]);
const cartCount=()=>Object.values(cart).reduce((a,b)=>a+b,0);
function saveCart(){store.set('ym_cart',cart);badges()}
function addToCart(id,q=1){cart[id]=(cart[id]||0)+q;saveCart();toast('Added to cart: '+byId(id).name)}
function toggleWish(id){const i=wish.indexOf(id);i<0?wish.push(id):wish.splice(i,1);store.set('ym_wish',wish);toast(i<0?'Saved to wishlist ♥':'Removed from wishlist');badges();document.dispatchEvent(new Event('ym:wish'))}
function badges(){const c=$('#cc'),w=$('#wc');if(c)c.textContent=cartCount();if(w)w.textContent=wish.length;$$('[data-wish]').forEach(b=>{const on=wish.includes(+b.dataset.wish);b.setAttribute('aria-pressed',on);b.setAttribute('aria-label',on?'Remove from wishlist':'Add to wishlist')})}
function toast(m){const d=document.createElement('div');d.className='toast';d.textContent=m;$('#toasts').append(d);setTimeout(()=>d.remove(),2400)}
const card=p=>{const u='product.html?id='+p.id,sp=p===SPECIAL;return `<article class="card"><a class="pic" href="${u}" tabindex="-1"><img src="${pImg(p)}" alt="${p.name} packaging" loading="lazy">${p.tag?`<span class="tag ${p.tag}">${TAGS[p.tag]}</span>`:''}${sp?'<span class="tag Sp">Today’s Special</span>':''}</a><button class="heart" data-wish="${p.id}" aria-pressed="false">♥</button><div class="cb"><h3><a href="${u}">${p.name}</a></h3><p class="jp">${p.jp}</p><p class="d">${p.desc}</p><div class="pr"><b>${yen(priceOf(p))}</b>${sp?`<s>${yen(p.price)}</s>`:''}<button class="btn sm" data-add="${p.id}" data-i18n="add"></button></div></div></article>`};
function mount(el,list){el.innerHTML=list.map(card).join('');applyLang(el);badges()}
/* Shared header/footer */
function layout(){
 const pg=location.pathname.split('/').pop()||'index.html';
 $('#hdr').innerHTML=`<div class="wrap bar"><a class="logo" href="index.html"><span class="mono">YM</span><span>YORIMICHI<small>寄り道</small></span></a><nav id="nav" aria-label="Main">${[['index.html','nav_home'],['shop.html','nav_shop'],['about.html','nav_about']].map(([h,k])=>`<a href="${h}" ${pg==h?'aria-current="page"':''} data-i18n="${k}"></a>`).join('')}</nav><div class="tools"><button class="chip" id="lang" aria-label="Switch language">EN / 日本語</button><a class="ico" href="shop.html?wish=1" aria-label="Wishlist">♥<b id="wc">0</b></a><a class="ico" href="cart.html" aria-label="Cart">🛒<b id="cc">0</b></a><button class="chip burger" id="bg" aria-label="Menu" aria-expanded="false">☰</button></div></div>`;
 $('#ftr').innerHTML=`<div class="wrap"><div class="fgrid"><div><a class="logo" href="index.html"><span class="mono">YM</span><span>YORIMICHI</span></a><p style="margin-top:10px" data-i18n="foot"></p></div><div><p data-i18n="links"></p><a href="shop.html">Shop</a><a href="cart.html">Basket</a><a href="about.html">About</a></div><div><p data-i18n="visit"></p><p>3-12-7 Yorimichi-cho, Setagaya, Tokyo</p><p>OPEN 24 HOURS</p></div></div><p>© 2026 YORIMICHI 寄り道. A fictional store for a portfolio demo.</p></div>`;
 document.body.insertAdjacentHTML('beforeend','<div id="toasts" aria-live="polite"></div>');
 $('#lang').onclick=()=>{lang=lang=='en'?'ja':'en';store.set('ym_lang',lang);applyLang();document.dispatchEvent(new Event('ym:lang'))};
 $('#bg').onclick=e=>{const o=$('#nav').classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',o)};
 applyLang();badges();
}
document.addEventListener('click',e=>{const a=e.target.closest('[data-add]'),w=e.target.closest('[data-wish]');if(a)addToCart(+a.dataset.add);if(w)toggleWish(+w.dataset.wish)});
layout();
