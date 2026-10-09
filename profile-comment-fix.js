/* V110: Direct profile-post comments; Home and Profile share one comments table. */
(function(){
 'use strict';
 const root=document.getElementById('ffFullPosts');
 if(!root)return;
 const postCard=el=>el?.closest?.('#ffFullPosts .post-card[data-post-id]');
 const refresh=async id=>{
   if(typeof loadPostActivity!=='function')return;
   const cards=document.querySelectorAll('.post-card[data-post-id="'+id+'"]');
   await Promise.allSettled([...cards].map(card=>loadPostActivity(id,card)));
 };
 // Stop profile Comment and count buttons from opening an overlaid modal.
 root.addEventListener('click',event=>{
   const card=postCard(event.target);
   if(!card)return;
   const send=event.target.closest('.comment-send');
   if(send){
     event.preventDefault();event.stopImmediatePropagation();
     submit(card,send);
     return;
   }
   const commentButton=event.target.closest('.post-buttons .post-btn');
   const count=event.target.closest('.comment-count');
   if(count || (commentButton && /comment/i.test(commentButton.textContent||''))){
     event.preventDefault();event.stopImmediatePropagation();
     const input=card.querySelector('.comment-input');
     if(input){card.querySelector('.comment-area')?.classList.add('show');input.focus({preventScroll:true});}
   }
 },true);
 root.addEventListener('keydown',event=>{
   if(event.key!=='Enter'||event.shiftKey||!event.target.matches('.post-card .comment-input'))return;
   const card=postCard(event.target);if(!card)return;
   event.preventDefault();event.stopImmediatePropagation();
   submit(card,card.querySelector('.comment-send'));
 },true);
 async function submit(card,button){
   const id=Number(card.dataset.postId),field=card.querySelector('.comment-input');
   const value=field?.value?.trim();
   if(!id||!value||!button||button.disabled)return;
   if(typeof currentUser==='undefined'||!currentUser?.id){alert('Sign in to comment.');return;}
   button.disabled=true;
   try{
     if(!navigator.onLine && window.ffOfflineQueue?.enqueueComment){
       await window.ffOfflineQueue.enqueueComment(id,value,null);
       field.value='';window.ffShowOfflinePending?.('comment',value,card);
     }else{
       const {error}=await supabaseClient.from('comments').insert({post_id:id,user_id:currentUser.id,content:value,parent_comment_id:null});
       if(error)throw error;
       field.value='';await refresh(id);
     }
   }catch(error){alert('Comment could not be saved: '+(error?.message||String(error)));}
   finally{button.disabled=false;}
 }
 // Existing post cards render comment fields hidden; show them only within a profile.
 // When the page changes, no observer, polling, or duplicate UI is required.
 window.ffV110RefreshProfilePostComments=refresh;
})();
