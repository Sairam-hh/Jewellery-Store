/* Stackly Jewellers — login / signup (localStorage session, same keys as before) */
(function(){
 var d=document;function $(s,r){return (r||d).querySelector(s)}function $$(s,r){return Array.prototype.slice.call((r||d).querySelectorAll(s))}
 var KEY='stackly_user',EMSG='Email must end with .com, .in or .org';
 function role(f){var r=$('input[name=role]:checked',f);return r?r.value:''}
 function msg(el,t,c){el.className='fbox show '+(c||'');el.textContent=t}
 function shake(f){f.classList.remove('shake');void f.offsetWidth;f.classList.add('shake')}
 function clr(f){$$('.inp,input[type=radio],input[type=checkbox]',f).forEach(function(i){var h=function(){var x=i.closest('.fld');if(x)x.classList.remove('bad')};i.addEventListener('input',h);i.addEventListener('change',h)})}
 $$('.eye').forEach(function(b){b.addEventListener('click',function(){var i=$('input',b.parentNode),s=i.type==='password';i.type=s?'text':'password';b.classList.toggle('show',s);b.setAttribute('aria-label',s?'Hide password':'Show password')})});
 $$('form').forEach(clr);
 var fl=$('#fLogin');
 if(fl){var lm=$('#lmsg');
  try{var rm=JSON.parse(localStorage.getItem('stackly_remember')||'null');if(rm){$('#lEmail').value=rm.email||'';$('#remember').checked=true;var rr=$$('input[name=role]',fl).filter(function(x){return x.value===rm.role})[0];if(rr)rr.checked=true}}catch(e){}
  try{var ok=sessionStorage.getItem('stackly_signup');if(ok){var o=JSON.parse(ok);sessionStorage.removeItem('stackly_signup');msg(lm,'Account created for '+o.email+'. Please login to continue.','good');$('#lEmail').value=o.email;var r2=$$('input[name=role]',fl).filter(function(x){return x.value===o.role})[0];if(r2)r2.checked=true}}catch(e){}
  fl.addEventListener('submit',function(e){
   e.preventDefault();var good=true,r=role(fl),em=$('#lEmail').value.trim(),pw=$('#lPw').value;
   var fr=$('#lr'),fe=$('#lEmail').closest('.fld'),fp=$('#lPw').closest('.fld');
   if(!r){SV.bad(fr,'Please select a role (Admin or Customer)');good=false}else SV.good(fr);
   if(!SV.email(em)){SV.bad(fe,EMSG);good=false}else SV.good(fe);
   if(pw.length<6){SV.bad(fp,'Password must be at least 6 characters');good=false}else SV.good(fp);
   if(!good){shake(fl);msg(lm,'Please fix the highlighted fields.','bad');return}
   var local=em.split('@')[0].trim(),name=local.charAt(0).toUpperCase()+local.slice(1);
   var user={name:name,role:r,email:em,loginAt:new Date().toISOString()};
   try{localStorage.setItem(KEY,JSON.stringify(user));if($('#remember').checked)localStorage.setItem('stackly_remember',JSON.stringify({email:em,role:r}));else localStorage.removeItem('stackly_remember')}catch(x){msg(lm,'Storage is blocked in this browser. Please enable it to continue.','bad');return}
   $('#loginBtn').classList.add('load');msg(lm,'Signing you in as '+r+'...','good');
   setTimeout(function(){location.replace(r==='Admin'?'admin-dashboard.html':'customer-dashboard.html')},700)});
  /* forgot password toggle */
  var pl=$('#p-login'),pf=$('#p-forgot');
  if(pf){$('#toForgot').addEventListener('click',function(){pl.classList.remove('on');pf.classList.add('on')});$('#backLogin').addEventListener('click',function(){pf.classList.remove('on');pl.classList.add('on')});
   $('#fForgot').addEventListener('submit',function(e){e.preventDefault();var i=$('#fEmail'),f=i.closest('.fld'),fm=$('#fmsg');if(!SV.email(i.value.trim())){SV.bad(f,EMSG);fm.className='fbox';return}SV.good(f);msg(fm,'If this email is registered, a reset link is on its way.','good')})}}
 var fs=$('#fSign');
 if(fs){var sm=$('#smsg');SV.lettersOnly($('#sName'));
  fs.addEventListener('submit',function(e){
   e.preventDefault();var good=true,r=role(fs),nm=$('#sName').value.trim(),em=$('#sEmail').value.trim(),p1=$('#sPw').value,p2=$('#sPw2').value;
   function chk(el,ok,m){var f=el.closest('.fld');if(ok)SV.good(f);else{SV.bad(f,m);good=false}}
   if(!r){SV.bad($('#sr'),'Please select a role (Admin or Customer)');good=false}else SV.good($('#sr'));
   chk($('#sName'),SV.name(nm),'Full name must contain alphabets only');
   chk($('#sEmail'),SV.email(em),EMSG);
   chk($('#sPw'),p1.length>=6,'Password must be at least 6 characters');
   chk($('#sPw2'),p2.length>0&&p1===p2,'Passwords do not match');
   chk($('#terms'),$('#terms').checked,'You must accept the Terms & Conditions');
   if(!good){shake(fs);msg(sm,'Please fix the highlighted fields.','bad');return}
   try{var acc=JSON.parse(localStorage.getItem('stackly_accounts')||'[]');acc=acc.filter(function(a){return a.email!==em});acc.push({name:nm,email:em,role:r});localStorage.setItem('stackly_accounts',JSON.stringify(acc));sessionStorage.setItem('stackly_signup',JSON.stringify({email:em,role:r}))}catch(x){}
   $('#signBtn').classList.add('load');msg(sm,'Account created! Taking you to login...','good');
   setTimeout(function(){location.href='login.html'},900)})}
 $$('[data-soc]').forEach(function(b){b.addEventListener('click',function(){var m=$('#socmsg');if(m)msg(m,b.getAttribute('data-soc')+' sign-in is not connected in this demo. Please use email and password.','')})});
})();
