
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".site-header").forEach(function (header) {
    const button = header.querySelector(".site-menu-button");
    const nav = header.querySelector(".site-primary-nav");

    if (!button || !nav) return;

    // Add mobile Volunteer / Donate actions inside the dropdown.
    if (!nav.querySelector(".site-mobile-actions")) {
      const inJourney = window.location.pathname.includes("/journeys/");
      const prefix = inJourney ? "../" : "";

      const actions = document.createElement("div");
      actions.className = "site-mobile-actions";
      actions.innerHTML =
        '<a class="site-mobile-volunteer" href="' + prefix + 'volunteer.html">Volunteer</a>' +
        '<a class="site-mobile-donate" href="' + prefix + 'donate.html">Donate</a>';

      nav.appendChild(actions);
    }

    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      const isOpen = nav.classList.toggle("open");
      button.textContent = isOpen ? "Close" : "Menu";
      button.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        button.textContent = "Menu";
        button.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", function (event) {
      if (!header.contains(event.target) && nav.classList.contains("open")) {
        nav.classList.remove("open");
        button.textContent = "Menu";
        button.setAttribute("aria-expanded", "false");
      }
    });
  });
});
