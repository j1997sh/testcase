
document.addEventListener("DOMContentLoaded", function(){
  const menu = document.querySelector(".menu-btn");
  const nav = document.querySelector(".navlinks");
  if(menu && nav){
    menu.addEventListener("click", function(){
      const open = nav.classList.toggle("mobile-open");
      if(open){
        nav.style.display="flex";
        nav.style.position="absolute";
        nav.style.top="72px";
        nav.style.left="14px";
        nav.style.right="14px";
        nav.style.padding="18px";
        nav.style.background="#071a34";
        nav.style.flexDirection="column";
        nav.style.alignItems="flex-start";
        nav.style.zIndex="50";
      } else {
        nav.removeAttribute("style");
      }
    });
  }
});



document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("header").forEach(function(header){
    const btn = header.querySelector(".menu-btn");
    const navlinks = header.querySelector(".navlinks");

    if (!btn || !navlinks) return;

    // Add mobile-only action buttons once.
    if (!navlinks.querySelector(".mobile-menu-actions")) {
      const actions = document.createElement("div");
      actions.className = "mobile-menu-actions";
      const inJourney = window.location.pathname.includes("/journeys/");
      const prefix = inJourney ? "../" : "";
      actions.innerHTML =
        '<a class="mobile-volunteer" href="' + prefix + 'volunteer.html">Volunteer</a>' +
        '<a class="mobile-donate" href="' + prefix + 'donate.html">Donate</a>';
      navlinks.appendChild(actions);
    }

    btn.setAttribute("aria-expanded", "false");

    btn.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      const isOpen = navlinks.classList.toggle("open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      btn.textContent = isOpen ? "Close" : "Menu";
    });

    navlinks.querySelectorAll("a").forEach(function(link){
      link.addEventListener("click", function(){
        navlinks.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        btn.textContent = "Menu";
      });
    });

    document.addEventListener("click", function(event){
      if (!header.contains(event.target) && navlinks.classList.contains("open")) {
        navlinks.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        btn.textContent = "Menu";
      }
    });
  });
});


document.addEventListener("DOMContentLoaded", function(){
  const header = document.querySelector("header");
  if(!header) return;
  const btn = header.querySelector(".menu-btn");
  const menu = header.querySelector(".navlinks");
  if(!btn || !menu) return;

  btn.onclick = function(e){
    e.preventDefault();
    const open = menu.classList.toggle("open");
    btn.textContent = open ? "Close" : "Menu";
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  };
});


// Definitive mobile menu actions
document.addEventListener("DOMContentLoaded", function(){
  document.querySelectorAll("header").forEach(function(header){
    const btn = header.querySelector(".menu-btn");
    const navlinks = header.querySelector(".navlinks");
    if(!btn || !navlinks) return;

    function ensureMobileActions(){
      let actions = navlinks.querySelector(".mobile-menu-actions");

      if(window.innerWidth <= 900){
        if(!actions){
          const inJourney = window.location.pathname.includes("/journeys/");
          const prefix = inJourney ? "../" : "";
          actions = document.createElement("div");
          actions.className = "mobile-menu-actions";
          actions.innerHTML =
            '<a class="mobile-volunteer" href="' + prefix + 'volunteer.html">Volunteer</a>' +
            '<a class="mobile-donate" href="' + prefix + 'donate.html">Donate</a>';
          navlinks.appendChild(actions);
        }
      } else if(actions){
        actions.remove();
      }
    }

    ensureMobileActions();
    window.addEventListener("resize", ensureMobileActions);
  });
});
