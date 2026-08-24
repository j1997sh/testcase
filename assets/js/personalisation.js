(function () {
  "use strict";

  const STORAGE_KEY = "ben_campaign_context_v2";
  const SESSION_KEY = "ben_campaign_session_v2";
  const ACQUISITION_KEY = "ben_campaign_acquisition_v1";

  const qs = (sel, root=document) => root.querySelector(sel);
  const qsa = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  function clean(value) {
    return (value || "").toString().trim();
  }

  function lower(value) {
    return clean(value).toLowerCase();
  }

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
  }

  function readSessionJSON(key, fallback) {
    try {
      const raw = sessionStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function writeSessionJSON(key, value) {
    try { sessionStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
  }

  function getContext() {
    const persistent = readJSON(STORAGE_KEY, {
      area: "regional",
      issue: "",
      postcode: "",
      area_source: "default",
      preference_explicit: false
    });

    const session = readSessionJSON(SESSION_KEY, {
      area: "",
      issue: "",
      source: "",
      campaign: "",
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
      utm_content: "",
      landing_page: "",
      area_source: ""
    });

    return {
      area: session.area || persistent.area || "regional",
      issue: session.issue || persistent.issue || "",
      source: session.source || "",
      campaign: session.campaign || "",
      utm_source: session.utm_source || "",
      utm_medium: session.utm_medium || "",
      utm_campaign: session.utm_campaign || "",
      utm_content: session.utm_content || "",
      landing_page: session.landing_page || "",
      postcode: persistent.postcode || "",
      area_source: session.area_source || persistent.area_source || "default",
      preference_explicit: !!persistent.preference_explicit
    };
  }

  function savePersistentContext(ctx) {
    const persistent = {
      area: ctx.area || "regional",
      issue: ctx.issue || "",
      postcode: ctx.postcode || "",
      area_source: ctx.area_source || "manual",
      preference_explicit: !!ctx.preference_explicit
    };
    writeJSON(STORAGE_KEY, persistent);
  }

  function saveSessionContext(ctx) {
    const session = {
      area: ctx.area || "",
      issue: ctx.issue || "",
      source: ctx.source || "",
      campaign: ctx.campaign || "",
      utm_source: ctx.utm_source || "",
      utm_medium: ctx.utm_medium || "",
      utm_campaign: ctx.utm_campaign || "",
      utm_content: ctx.utm_content || "",
      landing_page: ctx.landing_page || "",
      area_source: ctx.area_source || ""
    };
    writeSessionJSON(SESSION_KEY, session);
    window.BEN_CONTEXT = getContext();
    return window.BEN_CONTEXT;
  }

  function saveContext(ctx, mode="session") {
    if (mode === "persistent") savePersistentContext(ctx);
    return saveSessionContext(ctx);
  }

  function analytics(name, detail) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: name,
      ben_area: (window.BEN_CONTEXT || {}).area || "regional",
      ben_issue: (window.BEN_CONTEXT || {}).issue || "",
      ...detail
    });
    window.dispatchEvent(new CustomEvent("ben:analytics", { detail: { name, ...detail } }));
  }

  function postcodeToArea(postcode) {
    const p = clean(postcode).toUpperCase().replace(/\s+/g, "");
    if (!p) return null;
    const areas = window.BEN_CAMPAIGN_AREAS || {};
    for (const [key, area] of Object.entries(areas)) {
      if (key === "regional") continue;
      const prefixes = area.postcodePrefixes || [];
      if (prefixes.some(prefix => p.startsWith(prefix.replace(/\s+/g, "").toUpperCase()))) {
        return key;
      }
    }
    return null;
  }

  function captureURLContext() {
    const params = new URLSearchParams(location.search);
    const current = getContext();
    const persistent = readJSON(STORAGE_KEY, {});
    const next = { ...current };
    const acquisition = readJSON(ACQUISITION_KEY, {});

    const urlArea = lower(params.get("area"));
    const urlIssue = lower(params.get("issue"));
    const hasCampaignArea = !!(urlArea && window.BEN_CAMPAIGN_AREAS[urlArea]);

    // A clean visit to the site root should show the regional version unless
    // the visitor has explicitly chosen/entered their area previously.
    const isPlainRoot = (location.pathname.endsWith("/") || location.pathname.endsWith("/index.html")) &&
                        !urlArea && !urlIssue &&
                        !params.get("utm_source") && !params.get("utm_campaign");

    if (isPlainRoot && !persistent.preference_explicit) {
      next.area = "regional";
      next.issue = "";
      next.area_source = "default";
      writeSessionJSON(SESSION_KEY, {});
    }

    if (hasCampaignArea) {
      next.area = urlArea;
      next.area_source = "url";
      analytics("area_detected_from_url", { area: urlArea });
    }

    if (urlIssue && window.BEN_ISSUES[urlIssue]) {
      next.issue = urlIssue;
    }

    ["utm_source","utm_medium","utm_campaign","utm_content"].forEach(key => {
      const val = clean(params.get(key));
      if (val) next[key] = val;
    });

    next.source = next.utm_source || next.source || clean(params.get("source"));
    next.campaign = next.utm_campaign || next.campaign || clean(params.get("campaign"));
    next.landing_page = next.landing_page || location.pathname + location.search;

    if (!acquisition.first_landing_page) {
      acquisition.first_landing_page = location.pathname + location.search;
      acquisition.first_utm_source = next.utm_source || "";
      acquisition.first_utm_medium = next.utm_medium || "";
      acquisition.first_utm_campaign = next.utm_campaign || "";
      acquisition.first_utm_content = next.utm_content || "";
      acquisition.first_area = urlArea || "";
      acquisition.first_issue = urlIssue || "";
      acquisition.referrer = document.referrer || "";
      acquisition.captured_at = new Date().toISOString();
      writeJSON(ACQUISITION_KEY, acquisition);
    }

    return saveContext(next, "session");
  }

  function setArea(area, source="manual", postcode="") {
    const key = lower(area);
    const ctx = getContext();
    ctx.area = window.BEN_CAMPAIGN_AREAS[key] ? key : "regional";
    ctx.area_source = source;
    if (postcode) ctx.postcode = clean(postcode).toUpperCase();

    const explicit = source === "postcode" || source === "manual";
    if (explicit) {
      ctx.preference_explicit = true;
      saveContext(ctx, "persistent");
    } else {
      saveContext(ctx, "session");
    }

    analytics(source === "postcode" ? "postcode_area_established" : "area_selected", { area: ctx.area });
    applyAll();
  }

  function setIssue(issue) {
    const ctx = getContext();
    const key = lower(issue);
    ctx.issue = window.BEN_ISSUES[key] ? key : "";
    saveContext(ctx);
    applyAll();
  }

  function localiseText(el, value) {
    if (el && value) el.textContent = value;
  }

  function localiseLink(el, href, label) {
    if (!el) return;
    if (href) el.setAttribute("href", addContextToHref(href));
    if (label) el.textContent = label;
  }

  function addContextToHref(href) {
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("http")) return href;
    try {
      const url = new URL(href, location.href);
      const ctx = getContext();
      if (ctx.area && ctx.area !== "regional") url.searchParams.set("area", ctx.area);
      if (ctx.issue) url.searchParams.set("issue", ctx.issue);
      return url.pathname.split("/").pop() + (url.search ? url.search : "") + (url.hash || "");
    } catch (_) {
      return href;
    }
  }

  function ensureAreaIndicator() {
    const ctx = getContext();
    qsa(".ben-area-indicator").forEach(el => el.remove());

    if (!ctx.area || ctx.area === "regional") return;

    const area = window.BEN_CAMPAIGN_AREAS[ctx.area];
    if (!area) return;

    const bar = document.createElement("div");
    bar.className = "ben-area-indicator";
    bar.setAttribute("role", "status");
    bar.innerHTML = `
      <span>Showing campaign updates for <strong>${area.name}</strong></span>
      <button type="button" class="ben-change-area">Change area</button>
    `;

    const footer = qs("footer");
    if (footer) footer.insertAdjacentElement("beforebegin", bar);
    else document.body.appendChild(bar);

    qs(".ben-change-area", bar)?.addEventListener("click", openAreaSelector);
  }

  function openAreaSelector() {
    qs(".ben-area-selector")?.remove();

    const overlay = document.createElement("div");
    overlay.className = "ben-area-selector";
    overlay.innerHTML = `
      <div class="ben-area-selector-panel" role="dialog" aria-modal="true" aria-labelledby="ben-area-title">
        <button class="ben-area-close" type="button" aria-label="Close area selector">×</button>
        <h2 id="ben-area-title">Change your local campaign area</h2>
        <p>Enter your postcode, choose Crewe, or return to the regional campaign.</p>
        <form class="ben-area-postcode-form">
          <label for="ben-area-postcode">Postcode</label>
          <div class="ben-area-postcode-row">
            <input id="ben-area-postcode" name="postcode" autocomplete="postal-code" placeholder="Enter your postcode">
            <button type="submit">Use postcode</button>
          </div>
        </form>
        <div class="ben-area-buttons">
          <button type="button" data-ben-select-area="crewe">Crewe</button>
          <button type="button" data-ben-select-area="regional">Show all Cheshire & Warrington</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    qs(".ben-area-postcode", overlay)?.focus();

    qs(".ben-area-close", overlay)?.addEventListener("click", () => overlay.remove());
    overlay.addEventListener("click", e => { if (e.target === overlay) overlay.remove(); });
    qsa("[data-ben-select-area]", overlay).forEach(btn => {
      btn.addEventListener("click", () => {
        setArea(btn.dataset.benSelectArea, "manual");
        overlay.remove();
      });
    });
    qs(".ben-area-postcode-form", overlay)?.addEventListener("submit", e => {
      e.preventDefault();
      const postcode = clean(qs("input[name=postcode]", e.currentTarget)?.value);
      const area = postcodeToArea(postcode);
      if (area) {
        setArea(area, "postcode", postcode);
        overlay.remove();
      } else {
        alert("We can’t match that postcode to a local campaign area yet. The regional campaign will remain selected.");
      }
    });
  }

  function applyHomepage(area, ctx) {
    if (!document.body.classList.contains("home-page")) return;

    const hero = qs(".home-hero");
    const heroTitle = qs(".home-hero h1");
    const heroText = qs(".home-hero p");
    const heroBg = qs(".home-hero-bg, .home-hero-image, .home-hero");

    if (ctx.area === "crewe") {
      document.documentElement.dataset.benArea = "crewe";
      if (hero) hero.classList.add("is-personalised");
      if (heroBg) heroBg.style.setProperty("--ben-local-hero-image", `url('${area.heroImage}')`);
      localiseText(heroTitle, area.heroTitle);
      localiseText(heroText, area.heroSupport);

      const joinBtn = qs(".home-hero .btn-red, .home-join-button");
      localiseLink(joinBtn, "tell-ben.html", area.primaryCTA);

      const cards = qsa(".home-story-card, .home-campaign-card, .campaign-card");
      if (cards[0]) {
        localiseText(qs("h3, h2", cards[0]), area.featuredStoryTitle);
        localiseText(qs("p", cards[0]), area.featuredStoryCopy);
        localiseLink(qs("a", cards[0]), area.featuredStoryHref, "Latest news");
      }
      if (cards[1]) {
        localiseText(qs("h3, h2", cards[1]), area.localIssueTitle);
        localiseText(qs("p", cards[1]), area.localIssueCopy);
        localiseLink(qs("a", cards[1]), area.localIssueHref, "Ben’s Plan");
      }
      if (cards[2]) {
        localiseText(qs("h3, h2", cards[2]), area.featuredEventTitle);
        localiseText(qs("p", cards[2]), area.featuredEventCopy);
        localiseLink(qs("a", cards[2]), area.featuredEventHref, "Events");
      }

      qsa("[data-ben-tell-prompt], .tell-ben-prompt").forEach(el => localiseText(el, area.tellBenPrompt));
      analytics("personalised_homepage_viewed", { area: ctx.area, issue: ctx.issue || "" });
    } else {
      delete document.documentElement.dataset.benArea;
      if (hero) hero.classList.remove("is-personalised");
    }
  }

  function applyPlan(area, ctx) {
    if (!location.pathname.endsWith("plan.html")) return;
    const title = qs(".plan-photo-hero h1");
    const intro = qs(".plan-photo-hero p");
    if (ctx.area === "crewe") {
      localiseText(title, area.planTitle + ".");
      localiseText(intro, area.planIntro);
    }
  }

  function applyPolicyPage(area, ctx) {
    const issueMap = {
      "better-transport.html": "transport",
      "safer-communities.html": "safety",
      "stronger-economy.html": "economy",
      "homes-opportunity.html": "housing"
    };
    const file = location.pathname.split("/").pop();
    const issue = issueMap[file];
    if (!issue || ctx.area !== "crewe") return;

    const issueLabel = window.BEN_ISSUES[issue]?.label || "";
    const title = qs(".issue-hero h1, .inner-hero h1");
    if (title && !title.textContent.includes("Crewe")) {
      title.textContent = `${issueLabel} for Crewe.`;
    }

    const section = qs(".ben-local-policy-insert") || document.createElement("section");
    if (!section.classList.contains("ben-local-policy-insert")) {
      section.className = "ben-local-policy-insert";
      const main = qs("main");
      if (main) main.insertBefore(section, main.children[1] || null);
    }

    const content = {
      transport: ["What better transport means for Crewe", "Better bus connections, tackling bottlenecks and making the most of Crewe’s position as one of the region’s most important transport gateways."],
      safety: ["Safer communities in Crewe", "Visible neighbourhood policing, practical action on antisocial behaviour and a town centre where people feel confident spending time."],
      economy: ["Backing Crewe’s economy", "Supporting local employers, skills, investment and the infrastructure Crewe needs to grow with confidence."],
      housing: ["Homes and opportunity in Crewe", "New homes should come with roads, schools, GP capacity and a clear plan to strengthen existing communities as well as build new ones."]
    }[issue];

    section.innerHTML = `
      <div class="container ben-local-policy-inner">
        <img src="${area.localPhoto}" alt="Campaign activity in Crewe">
        <div>
          <h2>${content[0]}</h2>
          <p>${content[1]}</p>
          <a class="btn btn-red" href="${addContextToHref('tell-ben.html?issue=' + issue)}">Tell Ben about ${issue === 'safety' ? 'safety' : issue} in Crewe</a>
        </div>
      </div>`;
  }

  function applyNews(area, ctx) {
    if (!location.pathname.endsWith("news.html")) return;
    const stories = qsa("[data-news-area], .news-story");
    if (!stories.length) return;

    stories.forEach((story, index) => {
      if (!story.dataset.newsArea) {
        const text = story.textContent.toLowerCase();
        story.dataset.newsArea = text.includes("crewe") ? "crewe" : "all";
        if (text.includes("transport")) story.dataset.newsIssue = "transport";
      }
    });

    if (ctx.area === "regional" && !ctx.issue) return;
    const parent = stories[0].parentElement;
    if (!parent) return;

    const scored = stories.map((story, index) => {
      let score = 0;
      if (story.dataset.newsArea === ctx.area) score += 100;
      if (story.dataset.newsArea === "all") score += 30;
      if (ctx.issue && story.dataset.newsIssue === ctx.issue) score += 50;
      return { story, score, index };
    }).sort((a,b) => b.score - a.score || a.index - b.index);

    scored.forEach(item => parent.appendChild(item.story));
  }

  function applyEvents(area, ctx) {
    if (!location.pathname.endsWith("events.html")) return;
    const events = qsa("[data-event-area], .event-card, .event-item, .events-card");
    if (!events.length) return;

    events.forEach(event => {
      if (!event.dataset.eventArea) {
        event.dataset.eventArea = event.textContent.toLowerCase().includes("crewe") ? "crewe" : "all";
      }
    });

    if (ctx.area === "regional") return;
    const parent = events[0].parentElement;
    if (!parent) return;
    const scored = events.map((event, index) => ({
      event,
      index,
      score: event.dataset.eventArea === ctx.area ? 100 : event.dataset.eventArea === "all" ? 30 : 0
    })).sort((a,b) => b.score - a.score || a.index - b.index);
    scored.forEach(item => parent.appendChild(item.event));
  }

  function getIssueSubOptions(issue) {
    return {
      transport: ["Buses", "Roads", "Rail", "Congestion", "Walking and cycling", "Other"],
      safety: ["Antisocial behaviour", "Neighbourhood policing", "Town centre safety", "Youth services", "Other"],
      economy: ["Jobs", "Skills", "Business costs", "Transport and infrastructure", "Investment", "Other"],
      housing: ["Affordability", "Infrastructure", "Planning", "Brownfield development", "Renting", "Other"],
      services: ["GP access", "Schools", "Town centre", "Council services", "Other"],
      other: ["Something else"]
    }[issue] || ["Something else"];
  }

  function enhanceTellBen(area, ctx) {
    if (!location.pathname.endsWith("tell-ben.html")) return;

    const title = qs(".tell-ben-hero h1");
    if (ctx.area === "crewe" && title) title.textContent = area.tellBenPrompt;

    const postcodeStep = qs("#tell-step-1, .tell-step-1");
    const postcodeInput = qs('input[name="postcode"], input[placeholder*="postcode" i]');
    if (ctx.postcode && postcodeInput) postcodeInput.value = ctx.postcode;

    /* If area already known, retain context but don't force a repeated postcode interaction */
    if (ctx.area === "crewe" && postcodeStep) {
      const h = qs("h2", postcodeStep);
      const p = qs("p", postcodeStep);
      if (h) h.textContent = "What matters most in Crewe?";
      if (p) p.textContent = "Choose the issue you most want Ben to focus on.";
    }

    /* Add a compact structured issue layer if the page doesn't already have one */
    let intelligence = qs(".ben-intelligence-questions");
    if (!intelligence) {
      intelligence = document.createElement("section");
      intelligence.className = "ben-intelligence-questions";
      intelligence.innerHTML = `
        <div class="container ben-intelligence-inner">
          <h2>${ctx.area === "crewe" ? "What needs to change in Crewe?" : "What needs to change where you live?"}</h2>
          <p>Choose the issue that matters most. We’ll ask one short follow-up.</p>
          <div class="ben-issue-options" role="group" aria-label="Main issue">
            <button type="button" data-ben-issue="transport">Transport</button>
            <button type="button" data-ben-issue="housing">Housing</button>
            <button type="button" data-ben-issue="safety">Crime and community safety</button>
            <button type="button" data-ben-issue="economy">Jobs, business and growth</button>
            <button type="button" data-ben-issue="services">Local services</button>
            <button type="button" data-ben-issue="other">Something else</button>
          </div>
          <div class="ben-subissue-wrap" hidden>
            <label for="ben-subissue">Tell us a little more</label>
            <select id="ben-subissue" name="ben_subissue"></select>
          </div>
        </div>`;
      const main = qs("main");
      if (main) main.insertBefore(intelligence, main.children[1] || null);
    }

    qsa("[data-ben-issue]", intelligence).forEach(btn => {
      btn.addEventListener("click", () => {
        qsa("[data-ben-issue]", intelligence).forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        const issue = btn.dataset.benIssue;
        if (window.BEN_ISSUES[issue]) setIssue(issue);
        const wrap = qs(".ben-subissue-wrap", intelligence);
        const select = qs("#ben-subissue", intelligence);
        select.innerHTML = getIssueSubOptions(issue).map(v => `<option value="${v}">${v}</option>`).join("");
        wrap.hidden = false;
        analytics("tell_ben_started", { issue });
      });
    });
  }

  function prepareForms(area, ctx) {
    const acquisition = readJSON(ACQUISITION_KEY, {});
    qsa("form").forEach(form => {
      const hiddenValues = {
        ben_area: ctx.area || "regional",
        ben_issue: ctx.issue || "",
        ben_area_source: ctx.area_source || "",
        ben_postcode_context: ctx.postcode || "",
        ben_utm_source: ctx.utm_source || "",
        ben_utm_medium: ctx.utm_medium || "",
        ben_utm_campaign: ctx.utm_campaign || "",
        ben_utm_content: ctx.utm_content || "",
        ben_landing_page: ctx.landing_page || "",
        ben_original_utm_source: acquisition.first_utm_source || "",
        ben_original_utm_campaign: acquisition.first_utm_campaign || "",
        ben_original_area: acquisition.first_area || "",
        ben_original_issue: acquisition.first_issue || ""
      };

      Object.entries(hiddenValues).forEach(([name, value]) => {
        let input = qs(`input[name="${name}"]`, form);
        if (!input) {
          input = document.createElement("input");
          input.type = "hidden";
          input.name = name;
          input.dataset.nationbuilderField = name;
          form.appendChild(input);
        }
        input.value = value;
      });

      qsa('input[name="postcode"], input[placeholder*="postcode" i]', form).forEach(input => {
        if (ctx.postcode && !input.value) input.value = ctx.postcode;
        input.addEventListener("change", () => {
          const areaKey = postcodeToArea(input.value);
          if (areaKey) setArea(areaKey, "postcode", input.value);
        });
      });

      if (!form.dataset.benTracked) {
        form.dataset.benTracked = "1";
        form.addEventListener("submit", () => {
          const kind = form.dataset.thanks || form.dataset.formType || "form";
          analytics(kind === "tell-ben" ? "tell_ben_completed" : "signup_completed", { form: kind });
        });
      }
    });
  }

  function contextualiseThanks(area, ctx) {
    if (!location.pathname.endsWith("thanks.html")) return;

    const heroTitle = qs(".thanks-hero h1");
    const heroText = qs(".thanks-hero p");

    if (ctx.area === "crewe" && ctx.issue) {
      const label = window.BEN_ISSUES[ctx.issue]?.label || ctx.issue;
      if (heroTitle) heroTitle.textContent = "Thanks — Ben is listening.";
      if (heroText) heroText.textContent = `Thanks for telling Ben what matters in Crewe about ${label.toLowerCase()}.`;

      const firstCTA = qs(".thanks-page a.btn, .thanks-page .btn");
      if (firstCTA) {
        const planHref = window.BEN_ISSUES[ctx.issue]?.plan || "plan.html";
        firstCTA.href = addContextToHref(planHref);
        firstCTA.textContent = `Read Ben’s ${label.toLowerCase()} plan`;
      }
    } else if (ctx.area === "crewe") {
      if (heroText) heroText.textContent = "You’re now part of the campaign for Crewe and the wider Cheshire & Warrington region.";
    }
  }

  function bindGlobalPostcodes() {
    qsa('form').forEach(form => {
      const postcode = qs('input[name="postcode"], input[placeholder*="postcode" i]', form);
      if (!postcode || form.dataset.benPostcodeBound) return;
      form.dataset.benPostcodeBound = "1";
      form.addEventListener("submit", () => {
        const area = postcodeToArea(postcode.value);
        if (area) setArea(area, "postcode", postcode.value);
      });
    });
  }

  function applyContextToLinks() {
    qsa('a[href]').forEach(a => {
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("http")) return;
      if (a.hasAttribute("data-ben-no-context")) return;
      a.setAttribute("href", addContextToHref(href));
    });
  }

  function applyAll() {
    const ctx = getContext();
    const area = window.BEN_CAMPAIGN_AREAS[ctx.area] || window.BEN_CAMPAIGN_AREAS.regional;
    window.BEN_CONTEXT = ctx;

    ensureAreaIndicator();
    applyHomepage(area, ctx);
    applyPlan(area, ctx);
    applyPolicyPage(area, ctx);
    applyNews(area, ctx);
    applyEvents(area, ctx);
    enhanceTellBen(area, ctx);
    prepareForms(area, ctx);
    contextualiseThanks(area, ctx);
    bindGlobalPostcodes();
    applyContextToLinks();

    document.documentElement.dataset.benArea = ctx.area || "regional";
    if (ctx.issue) document.documentElement.dataset.benIssue = ctx.issue;
    else delete document.documentElement.dataset.benIssue;
  }

  window.BenPersonalisation = {
    getContext,
    setArea,
    setIssue,
    postcodeToArea,
    openAreaSelector,
    applyAll
  };

  captureURLContext();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyAll);
  } else {
    applyAll();
  }
})();


/* mobile reconciliation v3 safeguard */
window.addEventListener("pageshow", function(){
  document.body.classList.remove("menu-open");
  document.querySelectorAll(".site-primary-nav.open").forEach(function(nav){
    nav.classList.remove("open");
  });
});
