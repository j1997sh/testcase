
/* canonical mobile menu v6 */
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".site-header").forEach(function (header) {
    const button = header.querySelector(".site-menu-button");
    const nav = header.querySelector(".site-primary-nav");
    const logoImg = header.querySelector(".site-header-logo img");
    if (!button || !nav) return;

    /* remove any stale duplicates before rebuilding the mobile-only elements */
    nav.querySelectorAll(".site-mobile-actions").forEach(function(el, i){
      if (i > 0) el.remove();
    });
    nav.querySelectorAll(".site-mobile-menu-logo").forEach(function(el, i){
      if (i > 0) el.remove();
    });

    let menuLogo = nav.querySelector(".site-mobile-menu-logo");
    if (!menuLogo && logoImg) {
      menuLogo = document.createElement("a");
      menuLogo.className = "site-mobile-menu-logo";
      menuLogo.href = "index.html";
      menuLogo.setAttribute("aria-label", "Back Ben home");
      menuLogo.appendChild(logoImg.cloneNode(true));
      nav.insertBefore(menuLogo, nav.firstChild);
    }

    let actions = nav.querySelector(".site-mobile-actions");
    if (!actions) {
      actions = document.createElement("div");
      actions.className = "site-mobile-actions";
      actions.innerHTML =
        '<a class="mobile-volunteer" href="volunteer.html">Volunteer</a>' +
        '<a class="mobile-donate" href="donate.html">Donate</a>';
      nav.appendChild(actions);
    }

    button.textContent = "";
    button.setAttribute("aria-label", "Open navigation menu");

    button.addEventListener("click", function (e) {
      e.preventDefault();
      const open = nav.classList.toggle("open");
      document.body.classList.toggle("menu-open", open);
      button.textContent = "";
      button.setAttribute("aria-expanded", open ? "true" : "false");
      button.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    });

    nav.querySelectorAll("a").forEach(function(link){
      link.addEventListener("click", function(){
        nav.classList.remove("open");
        document.body.classList.remove("menu-open");
        button.setAttribute("aria-expanded","false");
        button.setAttribute("aria-label","Open navigation menu");
      });
    });
  });
});




document.addEventListener("submit",function(e){const form=e.target.closest("form[data-thanks]");if(!form)return;e.preventDefault();const prefix=window.location.pathname.indexOf("/journeys/")!==-1?"../":"";const type=form.dataset.thanks||"signup";let area="";const postcode=form.querySelector('input[autocomplete="postal-code"],input[placeholder*="Postcode" i],input[placeholder*="town" i]');if(postcode)area=postcode.value.trim();window.location.href=prefix+"thanks.html?from="+encodeURIComponent(type)+(area?"&area="+encodeURIComponent(area):"");});







/* News filters + You're the Mayor interactive */
(function(){
  function initNewsFilters(){
    var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-news-filter]'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-news-category]'));
    buttons.forEach(function(btn){
      btn.addEventListener('click',function(e){
        if(btn.tagName==='A') e.preventDefault();
        var filter=btn.getAttribute('data-news-filter')||'all';
        buttons.forEach(function(b){
          var active=b===btn;
          b.classList.toggle('is-active',active);
          b.setAttribute('aria-pressed',active?'true':'false');
        });
        cards.forEach(function(card){
          card.classList.toggle('is-filtered-out',filter!=='all'&&card.getAttribute('data-news-category')!==filter);
        });
      });
    });
    var all=document.querySelector('[data-news-filter="all"]');
    if(all) all.classList.add('is-active');
  }

  function initMayor(){
    var modal=document.querySelector('[data-mayor-modal]');
    var open=document.querySelector('[data-mayor-open]');
    if(!modal||!open) return;

    var close=modal.querySelector('[data-mayor-close]');
    var sliders=Array.prototype.slice.call(modal.querySelectorAll('[data-priority]'));
    var left=modal.querySelector('[data-points-left]');
    var live=modal.querySelector('[data-live-result]');
    var labels={transport:'Better transport',safety:'Safer communities',housing:'Homes & opportunity',growth:'Jobs & growth',services:'Town centres & local services'};
    var subs={
      transport:['Buses','Roads','Rail','Congestion','Walking and cycling'],
      safety:['Antisocial behaviour','Neighbourhood policing','Town centre safety','Youth services'],
      housing:['Affordability','Infrastructure','Planning','Brownfield development','Renting'],
      growth:['Jobs','Skills','Business costs','Transport and infrastructure','Investment'],
      services:['GP access','Schools','Town centre','Council services']
    };
    var current=1, selectedSub='';
    function vals(){var o={};sliders.forEach(function(s){o[s.dataset.priority]=parseInt(s.value||'0',10)});return o}
    function ranked(){var v=vals();return Object.keys(v).map(function(k){return[k,v[k]]}).sort(function(a,b){return b[1]-a[1]})}
    function show(n){
      current=n;
      modal.querySelectorAll('[data-step]').forEach(function(s){s.classList.toggle('is-active',parseInt(s.dataset.step,10)===n)});
      modal.scrollTop=0;
    }
    function update(){
      var v=vals(), total=Object.keys(v).reduce(function(a,k){return a+v[k]},0);
      left.textContent=100-total;
      sliders.forEach(function(s){var el=modal.querySelector('[data-value="'+s.dataset.priority+'"]');if(el)el.textContent=v[s.dataset.priority]});
      var n1=modal.querySelector('[data-step="1"] [data-next]');
      if(n1)n1.disabled=total!==100;
      var r=ranked();
      if(total===0)live.textContent='Start allocating your 100 points.';
      else if(r[1]&&r[1][1]>0)live.textContent='You’ve put '+labels[r[0][0]].toLowerCase()+' first — with '+labels[r[1][0]].toLowerCase()+' close behind.';
      else live.textContent='You’ve put '+labels[r[0][0]].toLowerCase()+' first.';
    }
    sliders.forEach(function(sl){
      sl.addEventListener('input',function(){
        var v=vals(), total=Object.keys(v).reduce(function(a,k){return a+v[k]},0);
        if(total>100)sl.value=Math.max(0,parseInt(sl.value,10)-(total-100));
        update();
      });
    });

    function follow(){
      selectedSub='';
      var top=ranked()[0][0];
      modal.querySelector('[data-followup-lead]').textContent='You put '+labels[top].toLowerCase()+' first. Which part of that should the mayor tackle first?';
      var box=modal.querySelector('[data-followup-options]');
      box.innerHTML='';
      subs[top].forEach(function(item){
        var b=document.createElement('button');
        b.type='button';b.className='mayor-choice';b.textContent=item;
        b.addEventListener('click',function(){
          selectedSub=item;
          box.querySelectorAll('.mayor-choice').forEach(function(x){x.classList.remove('is-selected')});
          b.classList.add('is-selected');
          modal.querySelector('[data-step="2"] [data-next]').disabled=false;
        });
        box.appendChild(b);
      });
      modal.querySelector('[data-step="2"] [data-next]').disabled=true;
    }

    function results(){
      var r=ranked(), list=modal.querySelector('[data-ranking]');
      list.innerHTML='';
      r.forEach(function(item,i){
        var li=document.createElement('li');
        li.innerHTML='<span class="rank">'+(i+1)+'</span><span class="name">'+labels[item[0]]+'</span><span class="points">'+item[1]+' points</span>';
        list.appendChild(li);
      });
      var top=r[0][0], area=modal.dataset.area;
      var prefix=area==='crewe'?'Ben’s been hearing directly from people in Crewe about these priorities.':'Ben is listening to people across Cheshire & Warrington about these priorities.';
      modal.querySelector('[data-result-message]').textContent=prefix+' You put '+labels[top].toLowerCase()+' first'+(selectedSub?', with '+selectedSub.toLowerCase()+' as the first thing to tackle.':'.');
    }

    open.addEventListener('click',function(){modal.classList.add('is-open');document.body.classList.add('mayor-modal-open');show(1)});
    close.addEventListener('click',function(){modal.classList.remove('is-open');document.body.classList.remove('mayor-modal-open')});
    modal.addEventListener('keydown',function(e){if(e.key==='Escape')close.click()});

    modal.querySelectorAll('[data-next]').forEach(function(b){
      b.addEventListener('click',function(){
        if(current===1){follow();show(2)}
        else if(current===2){show(3)}
      });
    });
    modal.querySelectorAll('[data-back]').forEach(function(b){
      b.addEventListener('click',function(){if(current>1)show(current-1)});
    });
    modal.querySelector('[data-finish]').addEventListener('click',function(){results();show(4)});
    update();
  }

  function init(){initNewsFilters();initMayor()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

/* V4 mobile menu source canonicalizer */
(function(){
  function canonicalizeMobileMenu(){
    var nav=document.querySelector('.site-primary-nav');
    if(!nav) return;

    var logos=nav.querySelectorAll('.site-mobile-menu-logo');
    logos.forEach(function(el,i){ if(i>0) el.remove(); });

    var actions=nav.querySelectorAll('.site-mobile-actions');
    actions.forEach(function(el,i){ if(i>0) el.remove(); });

    var logo=nav.querySelector('.site-mobile-menu-logo');
    if(!logo){
      var headerLogo=document.querySelector('.site-header-logo img');
      if(headerLogo){
        logo=document.createElement('a');
        logo.className='site-mobile-menu-logo';
        logo.href='index.html';
        var img=document.createElement('img');
        img.src=headerLogo.getAttribute('src');
        img.alt=headerLogo.getAttribute('alt')||'Back Ben for Mayor';
        logo.appendChild(img);
        nav.insertBefore(logo,nav.firstChild);
      }
    }

    var actionsBox=nav.querySelector('.site-mobile-actions');
    if(!actionsBox){
      actionsBox=document.createElement('div');
      actionsBox.className='site-mobile-actions';
      actionsBox.innerHTML='<a class="mobile-volunteer" href="volunteer.html">Volunteer</a><a class="mobile-donate" href="donate.html">Donate</a>';
      nav.appendChild(actionsBox);
    }
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',canonicalizeMobileMenu);
  }else{
    canonicalizeMobileMenu();
  }
})();
