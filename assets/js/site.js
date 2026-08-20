const demoForms=document.querySelectorAll('[data-demo-form]');
demoForms.forEach(form=>form.addEventListener('submit',e=>{
  e.preventDefault();
  const toast=document.getElementById('toast');
  if(toast){
    toast.textContent=form.dataset.message||'Demo only — form captured locally for prototype purposes.';
    toast.style.display='block';
    clearTimeout(window.__toastTimer);
    window.__toastTimer=setTimeout(()=>toast.style.display='none',3200);
  }
}));

const areaForms=document.querySelectorAll('[data-area-form]');
areaForms.forEach(areaForm=>areaForm.addEventListener('submit',e=>{
  e.preventDefault();
  const v=(areaForm.querySelector('input')?.value||'').toLowerCase().trim();
  if(v.includes('cw1')||v.includes('cw2')||v.includes('crewe')) location.href='journeys/crewe-transport.html';
  else location.href='area.html';
}));

const menuToggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('#primary-nav');
if(menuToggle&&nav){
  menuToggle.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded',String(open));
  });
}
