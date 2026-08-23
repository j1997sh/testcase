
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".site-header").forEach(function (header) {
    const button = header.querySelector(".site-menu-button");
    const nav = header.querySelector(".site-primary-nav");
    if (!button || !nav) return;

    if (!nav.querySelector(".site-mobile-actions")) {
      const actions = document.createElement("div");
      actions.className = "site-mobile-actions";
      actions.innerHTML =
        '<a href="volunteer.html">Volunteer</a>' +
        '<a href="donate.html">Donate</a>';
      nav.appendChild(actions);
    }

    button.textContent = "";
    button.setAttribute("aria-label", "Open navigation menu");

    button.addEventListener("click", function (e) {
      e.preventDefault();
      const open = nav.classList.toggle("open");
      button.textContent = "";
      button.setAttribute("aria-expanded", open ? "true" : "false");
      button.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    });
  });
});


document.addEventListener("submit",function(e){const form=e.target.closest("form[data-thanks]");if(!form)return;e.preventDefault();const prefix=window.location.pathname.indexOf("/journeys/")!==-1?"../":"";const type=form.dataset.thanks||"signup";let area="";const postcode=form.querySelector('input[autocomplete="postal-code"],input[placeholder*="Postcode" i],input[placeholder*="town" i]');if(postcode)area=postcode.value.trim();window.location.href=prefix+"thanks.html?from="+encodeURIComponent(type)+(area?"&area="+encodeURIComponent(area):"");});


/* mobile menu body-state parity v4 */
document.addEventListener('click', function(e){
  const btn = e.target.closest('.site-menu-button');
  if (btn) {
    setTimeout(function(){
      const nav = document.querySelector('.site-primary-nav');
      document.body.classList.toggle('menu-open', !!(nav && nav.classList.contains('open')));
    }, 0);
  }
  const navLink = e.target.closest('.site-primary-nav a');
  if (navLink) {
    setTimeout(function(){ document.body.classList.remove('menu-open'); }, 0);
  }
});
