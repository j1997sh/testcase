
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
