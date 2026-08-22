
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".site-header").forEach(function (header) {
    const button = header.querySelector(".site-menu-button");
    const nav = header.querySelector(".site-primary-nav");
    if (!button || !nav) return;

    if (!button.getAttribute("aria-label")) button.setAttribute("aria-label","Open navigation menu");

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

    button.addEventListener("click", function (e) {
      e.preventDefault();
      const open = nav.classList.toggle("open");
      button.textContent = "";
      button.setAttribute("aria-expanded", open ? "true" : "false");
      button.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    });
  });

  // Universal prototype signup / form routing.
  document.querySelectorAll("[data-thanks]").forEach(function(el){
    el.addEventListener("click", function(e){
      e.preventDefault();
      const action = el.getAttribute("data-thanks") || "signup";
      const prefix = window.location.pathname.indexOf("/journeys/") !== -1 ? "../" : "";
      window.location.href = prefix + "thanks.html?action=" + encodeURIComponent(action);
    });
  });

  // Find-my-area routing used on homepage and area hub.
  function routeArea(value, prefix){
    const q = (value || "").trim().toLowerCase().replace(/\s+/g," ");
    if(!q) return null;
    const routes = [
      {match:["crewe","cw1","cw2","cw3"], url:"journeys/crewe.html"},
      {match:["chester","ch1","ch2","ch3","ch4"], url:"journeys/chester.html"},
      {match:["warrington","wa1","wa2","wa3","wa4","wa5"], url:"journeys/warrington.html"},
      {match:["northwich","cw8","cw9"], url:"journeys/northwich.html"},
      {match:["macclesfield","sk10","sk11"], url:"journeys/macclesfield.html"},
      {match:["congleton","cw12"], url:"journeys/congleton.html"},
      {match:["winsford","cw7"], url:"journeys/winsford.html"},
      {match:["ellesmere port","ch65","ch66"], url:"journeys/ellesmere-port.html"},
      {match:["nantwich","cw5"], url:"journeys/nantwich.html"}
    ];
    for(const r of routes){
      if(r.match.some(x => q.includes(x))) return prefix + r.url;
    }
    return prefix + "area.html?q=" + encodeURIComponent(value);
  }

  document.querySelectorAll("[data-area-search]").forEach(function(form){
    const input = form.querySelector("input");
    const button = form.querySelector("button,a");
    const prefix = window.location.pathname.indexOf("/journeys/") !== -1 ? "../" : "";
    function go(e){
      if(e) e.preventDefault();
      const url = routeArea(input ? input.value : "", prefix);
      if(url) window.location.href = url;
      else if(input) input.focus();
    }
    if(button) button.addEventListener("click", go);
    if(input) input.addEventListener("keydown", function(e){ if(e.key === "Enter") go(e); });
  });
});
