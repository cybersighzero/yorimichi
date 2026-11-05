/* Shop: search, category filter, sort, wishlist-only view */
const CATS=['All','Snacks','Drinks','Instant Ramen','Desserts'],JP={Snacks:'お菓子',Drinks:'飲み物','Instant Ramen':'即席麺',Desserts:'デザート'};
const qs=new URLSearchParams(location.search);
let cat=CATS.includes(qs.get('cat'))?qs.get('cat'):'All',wishOnly=qs.get('wish')=='1';
function render(){
 const q=$('#q').value.trim().toLowerCase(),s=$('#sort').value;
 const l=PRODUCTS.filter(p=>(cat=='All'||p.cat==cat)&&(!wishOnly||wish.includes(p.id))&&(p.name+p.jp+p.desc).toLowerCase().includes(q));
 l.sort(s=='lo'?(a,b)=>priceOf(a)-priceOf(b):s=='hi'?(a,b)=>priceOf(b)-priceOf(a):(a,b)=>b.pop-a.pop);
 $('#cats').innerHTML=CATS.map(c=>`<button class="chip ${c==cat?'on':''}" data-c="${c}" aria-pressed="${c==cat}">${c=='All'?t('all'):c+(lang=='ja'?' · '+JP[c]:'')}</button>`).join('')+`<button class="chip ${wishOnly?'on':''}" id="wo" aria-pressed="${wishOnly}">♥ ${t('wish')}</button>`;
 $('#count').textContent=l.length+' items';
 const g=$('#grid');
 if(l.length)mount(g,l);else g.innerHTML=`<div class="empty" style="grid-column:1/-1">${wishOnly&&!wish.length?'Your wishlist is empty. Tap ♥ on any product to save it.':'No products match. Try another word or clear the filters.'}</div>`;
}
$('#cats').onclick=e=>{const b=e.target.closest('[data-c]');if(b){cat=b.dataset.c;render()}if(e.target.closest('#wo')){wishOnly=!wishOnly;render()}};
$('#q').oninput=$('#sort').onchange=render;
document.addEventListener('ym:wish',()=>{if(wishOnly)render()});
document.addEventListener('ym:lang',render);
render();
