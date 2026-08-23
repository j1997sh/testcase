
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".site-header").forEach(function (header) {
    const button = header.querySelector(".site-menu-button");
    const nav = header.querySelector(".site-primary-nav");
    if (!button || !nav) return;

    if (!nav.querySelector(".site-mobile-actions")) {
      const actions = document.createElement("div");
      actions.className = "site-mobile-actions";
      const prefix = window.location.pathname.indexOf("/journeys/") !== -1 ? "../" : "";
      actions.innerHTML =
        '<a href="' + prefix + 'volunteer.html">Volunteer</a>' +
        '<a href="' + prefix + 'donate.html">Donate</a>';
      nav.appendChild(actions);
    }

    button.textContent = "";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Open navigation menu");

    button.addEventListener("click", function (e) {
      e.preventDefault();
      const open = nav.classList.toggle("open");
      button.textContent = "";
      button.setAttribute("aria-expanded", open ? "true" : "false");
      button.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("open");
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-label", "Open navigation menu");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-label", "Open navigation menu");
        button.focus();
      }
    });
  });
});
