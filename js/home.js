/* Home page sections */
mount($('#featured'),[...PRODUCTS].sort((a,b)=>b.pop-a.pop).slice(0,4));
mount($('#special'),[SPECIAL]);
mount($('#fresh'),PRODUCTS.filter(p=>p.tag=='New').slice(0,4));
/* Random Snack Generator */
$('#rnd').onclick=()=>{const s=PRODUCTS.filter(p=>p.cat=='Snacks'),p=s[Math.floor(Math.random()*s.length)],o=$('#rndOut');o.hidden=false;mount(o,[p]);o.scrollIntoView({behavior:'smooth',block:'center'});toast('Tonight’s snack: '+p.name)};
