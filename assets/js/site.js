
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




