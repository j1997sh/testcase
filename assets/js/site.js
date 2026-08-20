const demoForms=document.querySelectorAll('[data-demo-form]');
demoForms.forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();const toast=document.getElementById('toast');if(toast){toast.textContent=form.dataset.message||'Demo only — form captured locally for prototype purposes.';toast.style.display='block';setTimeout(()=>toast.style.display='none',3200)}}));
const areaForm=document.querySelector('[data-area-form]');
if(areaForm){areaForm.addEventListener('submit',e=>{e.preventDefault();const v=(areaForm.querySelector('input')?.value||'').toLowerCase();if(v.includes('cw1')||v.includes('cw2')||v.includes('crewe')) location.href='journeys/crewe-transport.html'; else location.href='area.html';});}
