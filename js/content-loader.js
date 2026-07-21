/* ===========================================================
   Avodah Kitchen — CMS Content Loader
   Reads content/settings.json and content/menu.json (edited via
   the /admin CMS) and populates the corresponding elements on
   page load. If a fetch fails (e.g. viewing the file locally
   without a server), the page simply keeps its existing static
   content — nothing breaks.
   =========================================================== */

(function () {
  function setText(id, value) {
    if (value === undefined || value === null || value === "") return;
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function setHref(id, value) {
    if (!value) return;
    var el = document.getElementById(id);
    if (el) el.setAttribute("href", value);
  }

  function applySettings(settings) {
    if (!settings) return;

    // Logo — every element sharing this class gets updated (nav + footer)
    if (settings.logo) {
      document.querySelectorAll(".cms-site-logo").forEach(function (img) {
        img.setAttribute("src", settings.logo);
      });
    }

    setText("cms-site-name", settings.siteName);
    setText("cms-hero-tagline", settings.heroTagline);
    if (settings.tallyFormUrl) {
      document.querySelectorAll(".cms-tally-link, #cms-tally-link").forEach(function (link) {
        link.setAttribute("href", settings.tallyFormUrl);
      });
    }

    setText("cms-address", settings.address);

    if (settings.phoneDisplay) {
      setText("cms-phone-link", settings.phoneDisplay);
      setText("cms-footer-phone", settings.phoneDisplay);
    }
    if (settings.phoneLink) {
      setHref("cms-phone-link", "tel:" + settings.phoneLink);
      setHref("cms-footer-phone", "tel:" + settings.phoneLink);
    }
    if (settings.email) {
      setText("cms-email-link", settings.email);
      setText("cms-footer-email", settings.email);
      setHref("cms-email-link", "mailto:" + settings.email);
      setHref("cms-footer-email", "mailto:" + settings.email);
    }
  }

  function renderMenu(menuData) {
    var container = document.getElementById("cms-menu-list");
    if (!container || !menuData || !Array.isArray(menuData.items)) return;

    // Group items by category, preserving first-seen order
    var categories = [];
    var byCategory = {};
    menuData.items.forEach(function (item) {
      if (!byCategory[item.category]) {
        byCategory[item.category] = [];
        categories.push(item.category);
      }
      byCategory[item.category].push(item);
    });

    var html = "";
    categories.forEach(function (cat) {
      html += '<h3 class="menu-category">' + escapeHtml(cat) + "</h3>";
      byCategory[cat].forEach(function (item) {
        html +=
          '<div class="menu-list-item"><div><h4>' +
          escapeHtml(item.name) +
          "</h4><p>" +
          escapeHtml(item.description || "") +
          "</p></div><span class=\"menu-list-price\">" +
          escapeHtml(item.price) +
          "</span></div>";
      });
    });
    container.innerHTML = html;
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  document.addEventListener("DOMContentLoaded", function () {
    fetch("content/settings.json")
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(applySettings)
      .catch(function () { /* keep static fallback content */ });

    if (document.getElementById("cms-menu-list")) {
      fetch("content/menu.json")
        .then(function (res) { return res.ok ? res.json() : null; })
        .then(renderMenu)
        .catch(function () { /* keep static fallback content */ });
    }
  });
})();
