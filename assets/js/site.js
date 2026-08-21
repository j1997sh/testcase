
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

    button.addEventListener("click", function (e) {
      e.preventDefault();
      const open = nav.classList.toggle("open");
      button.textContent = open ? "Close" : "Menu";
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
});
