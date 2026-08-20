
document.addEventListener('DOMContentLoaded',()=>{
  const toast=document.getElementById('toast');
  function showToast(msg){if(!toast)return;toast.textContent=msg;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2400)}
  document.querySelectorAll('[data-demo-action]').forEach(el=>el.addEventListener('click',()=>showToast(el.dataset.demoAction||'Demo action')));
  document.querySelectorAll('[data-postcode-route]').forEach(btn=>btn.addEventListener('click',()=>{
    const input=document.getElementById('area-postcode');
    const v=(input?.value||'').trim().toUpperCase();
    if(v.startsWith('CW1')) window.location.href='journeys/crewe-transport.html';
    else showToast('Demo: try postcode CW1 2AB');
  }));
  const menu=document.querySelector('.menu-toggle');
  const nav=document.querySelector('.navlinks');
  if(menu&&nav){menu.addEventListener('click',()=>{
    nav.style.display=nav.style.display==='flex'?'none':'flex';
    if(nav.style.display==='flex'){nav.style.position='absolute';nav.style.top='78px';nav.style.left='16px';nav.style.right='16px';nav.style.background='#0a1d38';nav.style.padding='16px';nav.style.flexDirection='column';nav.style.alignItems='flex-start';nav.style.zIndex='200'}
  })}
});
