/* V234 shared connection indicator; session tokens and passwords are NEVER copied here. */
(function(){'use strict';
 function init(){
  if(document.getElementById('dc-v234-connection'))return;
  const badge=document.createElement('div');badge.id='dc-v234-connection';badge.hidden=true;badge.setAttribute('role','status');badge.setAttribute('aria-live','polite');document.body.appendChild(badge);
  let t;
  function update(initial){
   clearTimeout(t);
   if(!navigator.onLine){badge.hidden=false;badge.dataset.state='offline';badge.textContent='No internet connection · Previously loaded content remains available';}
   else if(!initial){badge.hidden=false;badge.dataset.state='online';badge.textContent='Back online · Syncing updates';t=setTimeout(()=>{badge.hidden=true},3500);}
   else badge.hidden=true;
  }
  window.addEventListener('online',()=>update(false));window.addEventListener('offline',()=>update(false));update(true);
  if('serviceWorker' in navigator && /^https?:$/.test(location.protocol)){
   navigator.serviceWorker.register('./duarte-sw-v234.js',{updateViaCache:'none'}).catch(()=>{});
  }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
