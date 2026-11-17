/* Stackly Jewellers — shared site scripts */
(function(){
 var d=document,b=d.body;
 function $(s,r){return (r||d).querySelector(s)}
 function $$(s,r){return Array.prototype.slice.call((r||d).querySelectorAll(s))}
 /* image fallback: if a photo cannot load, show the warm gradient placeholder */
 d.addEventListener('error',function(e){var t=e.target;if(t&&t.tagName==='IMG'){var p=t.closest('.ph');if(p)p.classList.add('img-fail')}},true);
 /* header: shadow on scroll (header itself is position:fixed in CSS) */
 var h=$('#hdr');function onS(){if(h)h.classList.toggle('sc',window.scrollY>10)}onS();window.addEventListener('scroll',onS,{passive:true});
 /* mobile menu */
 function setMenu(o){b.classList.toggle('menu-open',o);var mo=$('#menuOpen');if(mo)mo.setAttribute('aria-expanded',o)}
 var mo=$('#menuOpen');if(mo)mo.addEventListener('click',function(){setMenu(true)});
 $$('#menuClose,#mscrim,.mnav a').forEach(function(x){x.addEventListener('click',function(){setMenu(false)})});
 d.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});
 window.addEventListener('resize',function(){if(window.innerWidth>900)setMenu(false)});
 /* header Login button always stays "Login" (no auto-swap to Dashboard) */
 /* toast */
 var tt=$('#toast'),tm;function toast(t){if(!tt)return;tt.textContent=t;tt.classList.add('show');clearTimeout(tm);tm=setTimeout(function(){tt.classList.remove('show')},2600)}window.toast=toast;
 /* cart counter + add to cart */
 var cartN=0;try{cartN=+localStorage.getItem('stackly_cart_n')||0}catch(e){}
 function paint(){$$('[data-cart]').forEach(function(i){i.textContent=cartN||'';i.setAttribute('data-n',cartN)})}paint();
 $$('[data-add]').forEach(function(x){x.addEventListener('click',function(){cartN++;try{localStorage.setItem('stackly_cart_n',cartN)}catch(e){}paint();toast((x.getAttribute('data-add')||'Item')+' added to your bag')})});
 $$('[data-cartbtn]').forEach(function(x){x.addEventListener('click',function(){toast(cartN?cartN+' item(s) in your bag. Checkout is a demo.':'Your bag is empty.')})});
 $$('.heart').forEach(function(x){x.addEventListener('click',function(){var on=x.classList.toggle('on');x.setAttribute('aria-pressed',on);toast(on?'Saved to wishlist':'Removed from wishlist')})});
 /* reveal on scroll */
 var rv=$$('.rv');
 if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var t=e.target;t.classList.add('in');setTimeout(function(){t.classList.add('rvd')},1300);io.unobserve(t)}})},{threshold:.1,rootMargin:'0px 0px -40px 0px'});rv.forEach(function(el){io.observe(el)})}else{rv.forEach(function(el){el.classList.add('in','rvd')})}
 /* year */
 $$('[data-year]').forEach(function(y){y.textContent=new Date().getFullYear()});
 /* accordion */
 $$('.faq-i').forEach(function(i){var q=$('.faq-q',i);q.addEventListener('click',function(){var o=i.classList.contains('open');$$('.faq-i',i.parentNode).forEach(function(x){x.classList.remove('open');$('.faq-q',x).setAttribute('aria-expanded','false')});if(!o){i.classList.add('open');q.setAttribute('aria-expanded','true')}})});
 /* counters */
 var cs=$$('[data-count]');
 if(cs.length&&'IntersectionObserver' in window){var co=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var el=e.target,to=+el.getAttribute('data-count'),sf=el.getAttribute('data-suffix')||'',t0=null;function st(t){if(!t0)t0=t;var p=Math.min((t-t0)/1600,1),v=Math.floor(to*(1-Math.pow(1-p,3)));el.textContent=v.toLocaleString('en-IN')+sf;if(p<1)requestAnimationFrame(st)}requestAnimationFrame(st);co.unobserve(el)})},{threshold:.5});cs.forEach(function(c){co.observe(c)})}
 /* collection filter */
 var fb=$$('[data-f]');
 if(fb.length){var cards=$$('.pcard[data-cat]'),cn=$('#pcount');
  function apply(f){var n=0;cards.forEach(function(c){var show=f==='all'||c.getAttribute('data-cat')===f;c.classList.toggle('hide',!show);if(show)n++});if(cn)cn.textContent=n+' pieces'}
  fb.forEach(function(x){x.addEventListener('click',function(){fb.forEach(function(y){y.classList.remove('on')});x.classList.add('on');apply(x.getAttribute('data-f'))})});
  var hh=(location.hash||'').slice(1);var m=fb.filter(function(x){return x.getAttribute('data-f')===hh})[0];if(m)m.click();else apply('all')}
 /* validation helpers */
 window.SV={
  email:function(v){return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.(com|in|org)$/i.test(v)},
  name:function(v){return /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(v)},
  phone:function(v){return /^[6-9][0-9]{9}$/.test(v)},
  bad:function(f,m){f.classList.add('bad');f.classList.remove('ok');var e=f.querySelector('.err,.err-t');if(e)e.textContent=m},
  good:function(f){f.classList.remove('bad');f.classList.add('ok');var e=f.querySelector('.err,.err-t');if(e)e.textContent=''},
  lettersOnly:function(inp){inp.addEventListener('input',function(){var v=inp.value,n=v.replace(/[^A-Za-z ]/g,'').replace(/^ +/,'').replace(/ {2,}/g,' ');if(n!==v)inp.value=n})}
 };
 /* newsletter */
 $$('[data-news]').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();var i=$('input',f),ok=$('.msg-ok',f.parentNode),er=$('.err-t',f.parentNode);var v=i.value.trim();if(!SV.email(v)){if(er)er.textContent='Enter a valid email ending in .com, .in or .org';if(ok)ok.classList.remove('show');return}if(er)er.textContent='';if(ok)ok.classList.add('show');f.reset()})});
 /* contact form */
 var cf=$('#contactForm');
 if(cf){SV.lettersOnly($('#cName'));
  cf.addEventListener('submit',function(e){e.preventDefault();var ok=true;
   function chk(id,t,m){var el=$('#'+id),f=el.closest('.fld');if(t(el.value.trim())){SV.good(f)}else{SV.bad(f,m);ok=false}}
   chk('cName',SV.name,'Name must contain letters only');
   chk('cEmail',SV.email,'Enter a valid email ending in .com, .in or .org');
   chk('cPhone',SV.phone,'Enter a valid 10-digit Indian mobile number');
   chk('cMsg',function(v){return v.length>=10},'Please write at least 10 characters');
   var s=$('#cOk');if(ok){s.classList.add('show');cf.reset();$$('.fld',cf).forEach(function(f){f.classList.remove('ok')})}else s.classList.remove('show')})}
})();
