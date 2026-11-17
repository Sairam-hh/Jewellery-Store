/* Stackly Jewellers — dashboard logic (localStorage session; same keys as before) */
(function(){
 var d=document,b=d.body;function $(s,r){return (r||d).querySelector(s)}function $$(s,r){return Array.prototype.slice.call((r||d).querySelectorAll(s))}
 var ROLE=b.getAttribute('data-role'),KEY='stackly_user',u=null;
 try{u=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}
 if(!u||!u.email||!u.role){location.replace('login.html');return}
 if(u.role!==ROLE){location.replace(u.role==='Admin'?'admin-dashboard.html':'customer-dashboard.html');return}
 b.style.visibility='visible';
 d.addEventListener('error',function(e){var t=e.target;if(t&&t.tagName==='IMG'){t.style.visibility='hidden'}},true);
 var ini=(u.name||'U').charAt(0).toUpperCase(),last='';
 try{last=new Date(u.loginAt).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'})}catch(e){}
 $$('[data-u]').forEach(function(el){var k=el.getAttribute('data-u');el.textContent=k==='initial'?ini:k==='last'?(last||'Just now'):u[k]});
 /* toast */
 var tt=$('#toast'),tm;function toast(t){tt.textContent=t;tt.classList.add('show');clearTimeout(tm);tm=setTimeout(function(){tt.classList.remove('show')},2600)}
 /* panels */
 var btns=$$('.nv'),panels=$$('.panel'),title=$('#ptitle');
 function show(id,nohash){
  var ok=false;panels.forEach(function(p){var on=p.id==='p-'+id;p.classList.toggle('on',on);if(on)ok=true});
  if(!ok){id='overview';$('#p-overview').classList.add('on')}
  btns.forEach(function(x){var on=x.getAttribute('data-p')===id;x.classList.toggle('on',on);if(on){title.textContent=x.getAttribute('data-t');x.setAttribute('aria-current','page')}else x.removeAttribute('aria-current')});
  b.classList.remove('sb-open');window.scrollTo({top:0});
  if(!nohash)try{history.replaceState(null,'','#'+id)}catch(e){}
  counters();
 }
 btns.forEach(function(x){x.addEventListener('click',function(){show(x.getAttribute('data-p'))})});
 $$('[data-goto]').forEach(function(x){x.addEventListener('click',function(){show(x.getAttribute('data-goto'))})});
 /* counters */
 function counters(){$$('.panel.on [data-count]').forEach(function(el){if(el.getAttribute('data-done'))return;el.setAttribute('data-done','1');var to=+el.getAttribute('data-count'),sf=el.getAttribute('data-suffix')||'',t0=null;function st(t){if(!t0)t0=t;var p=Math.min((t-t0)/1200,1),v=Math.floor(to*(1-Math.pow(1-p,3)));el.textContent=v.toLocaleString('en-IN')+sf;if(p<1)requestAnimationFrame(st)}requestAnimationFrame(st)})}
 show((location.hash||'').slice(1)||'overview',true);
 /* drawer */
 $('#sbOpen').addEventListener('click',function(){b.classList.add('sb-open')});
 $('#sbClose').addEventListener('click',function(){b.classList.remove('sb-open')});
 $('#scrim').addEventListener('click',function(){b.classList.remove('sb-open')});
 d.addEventListener('keydown',function(e){if(e.key==='Escape')b.classList.remove('sb-open')});
 window.addEventListener('resize',function(){if(window.innerWidth>1024)b.classList.remove('sb-open')});
 /* logout */
 $$('[data-logout]').forEach(function(x){x.addEventListener('click',function(){try{localStorage.removeItem(KEY)}catch(e){}location.replace('login.html')})});
 $$('[data-toast]').forEach(function(x){x.addEventListener('click',function(){toast(x.getAttribute('data-toast'))})});
 $('#bell').addEventListener('click',function(){toast('You have no new notifications.')});
 /* top search jumps to the products/orders table filter */
 var gs=$('#gsearch');if(gs)gs.addEventListener('input',function(){var q=gs.value.toLowerCase();$$('.panel.on .tbl tbody tr').forEach(function(r){r.style.display=r.textContent.toLowerCase().indexOf(q)>-1?'':'none'})});
 /* filter chips */
 $$('[data-filter]').forEach(function(g){$$('.chp',g).forEach(function(c){c.addEventListener('click',function(){$$('.chp',g).forEach(function(x){x.classList.remove('on')});c.classList.add('on');var f=c.getAttribute('data-f');$$(g.getAttribute('data-filter')+' tr[data-s],'+g.getAttribute('data-filter')+' [data-s]').forEach(function(r){r.style.display=(f==='all'||r.getAttribute('data-s')===f)?'':'none'})})})});
 $$('[data-search]').forEach(function(i){i.addEventListener('input',function(){var q=i.value.toLowerCase();$$(i.getAttribute('data-search')+' tbody tr').forEach(function(r){r.style.display=r.textContent.toLowerCase().indexOf(q)>-1?'':'none'})})});
 /* delete + coupons */
 d.addEventListener('click',function(e){
  var del=e.target.closest('[data-del]');
  if(del){var t=del.closest(del.getAttribute('data-del'));if(t){t.style.transition='opacity .35s,transform .35s';t.style.opacity='0';t.style.transform='scale(.96)';setTimeout(function(){var p=t.parentNode,sel=del.getAttribute('data-del');t.remove();var box=p&&(p.closest('.dc')||p.parentNode);var em=box&&box.querySelector('.empty');if(em&&p&&!p.querySelector(sel))em.classList.add('show');toast('Removed successfully.')},340)}}
  var cp=e.target.closest('[data-copy]');if(cp){var c=cp.getAttribute('data-copy');try{navigator.clipboard.writeText(c)}catch(x){}toast('Coupon '+c+' copied!')}
 });
 /* add product (admin) */
 var ap=$('#addProd');
 if(ap){var af=$('#addForm');ap.addEventListener('click',function(){af.classList.toggle('show')});
  af.addEventListener('submit',function(e){e.preventDefault();var n=$('#npN').value.trim(),c=$('#npC').value,p=+$('#npP').value,s=+$('#npS').value;if(!n||!p||s<0||isNaN(s)){toast('Please fill all product fields.');return}
   var tr=d.createElement('tr');tr.innerHTML='<td data-l="Product"><div class="pr"><img src="'+ap.getAttribute('data-img')+'" alt="" width="50" height="50"><div><b></b><small>New</small></div></div></td><td data-l="Category"></td><td data-l="Price"></td><td data-l="Stock"></td><td data-l="Status"><span class="st st-info">Draft</span></td><td data-l="Action"><button class="ab del" type="button" data-del="tr" aria-label="Delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg></button></td>';
   tr.cells[0].querySelector('b').textContent=n;tr.cells[1].textContent=c;tr.cells[2].textContent='₹ '+p.toLocaleString('en-IN');tr.cells[3].textContent=s;
   var pb=$('#prodBody');pb.insertBefore(tr,pb.firstChild);af.reset();af.classList.remove('show');toast('Product added.')})}
 /* settings */
 var sf=$('#setForm');
 if(sf){try{var ss=JSON.parse(localStorage.getItem('stackly_settings')||'{}');$$('input',sf).forEach(function(i){var k=i.getAttribute('data-k');if(k&&ss[k]!==undefined){if(i.type==='checkbox')i.checked=ss[k];else i.value=ss[k]}})}catch(e){}
  sf.addEventListener('submit',function(e){e.preventDefault();var o={};$$('input',sf).forEach(function(i){var k=i.getAttribute('data-k');if(k)o[k]=i.type==='checkbox'?i.checked:i.value});try{localStorage.setItem('stackly_settings',JSON.stringify(o))}catch(x){}toast('Settings saved.')})}
 /* add address (customer) */
 var ad=$('#addrForm');
 if(ad){ad.addEventListener('submit',function(e){e.preventDefault();var l=$('#aL').value.trim(),a=$('#aA').value.trim();if(!l||!a){toast('Enter a label and address.');return}
  var c=d.createElement('article');c.className='dc adr';c.innerHTML='<h3></h3><p></p><div><button class="btn line mini" type="button" data-del="article">Remove</button></div>';c.querySelector('h3').textContent=l;c.querySelector('p').textContent=a;$('#adrList').appendChild(c);ad.reset();toast('Address saved.')})}
 /* support */
 var sp=$('#supForm');if(sp)sp.addEventListener('submit',function(e){e.preventDefault();var m=$('#supMsg');if(!m.value.trim()){toast('Please type your message first.');return}m.value='';toast('Message sent. We will reply within 24 hours.')});
 /* faq */
 $$('.faq-i').forEach(function(i){var q=$('.faq-q',i);q.addEventListener('click',function(){var o=i.classList.contains('open');$$('.faq-i',i.parentNode).forEach(function(x){x.classList.remove('open')});if(!o)i.classList.add('open')})});
})();
