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

  function setHrefById(id, value) {
    if (!value) return;
    var el = document.getElementById(id);
    if (el) el.setAttribute("href", value);
  }

  function setHrefByClass(className, value) {
    if (!value) return;
    document.querySelectorAll("." + className).forEach(function (el) {
      el.setAttribute("href", value);
    });
  }

  function hideByClass(className) {
    document.querySelectorAll("." + className).forEach(function (el) {
      el.style.display = "none";
    });
  }

  function applySettings(settings) {
    if (!settings) return;

    // ---- Logo (nav + footer) ----
    if (settings.logo) {
      document.querySelectorAll(".cms-site-logo").forEach(function (img) {
        img.setAttribute("src", settings.logo);
      });
    }

    // ---- Hero ----
    setText("cms-site-name", settings.siteName);
    setText("cms-hero-eyebrow", settings.heroEyebrow);
    setText("cms-hero-tagline", settings.heroTagline);

    // ---- Reserve buttons (nav, hero, banner, footer — every page) ----
    if (settings.tallyFormUrl) {
      document.querySelectorAll(".cms-tally-link, #cms-tally-link").forEach(function (link) {
        link.setAttribute("href", settings.tallyFormUrl);
      });
    }

    // ---- Contact info ----
    setText("cms-address", settings.address);
    if (settings.phoneDisplay) {
      setText("cms-phone-link", settings.phoneDisplay);
      setText("cms-footer-phone", settings.phoneDisplay);
    }
    if (settings.phoneLink) {
      var telHref = "tel:" + settings.phoneLink.replace(/\s+/g, "");
      setHrefById("cms-phone-link", telHref);
      setHrefById("cms-footer-phone", telHref);
    }
    if (settings.email) {
      setText("cms-email-link", settings.email);
      setText("cms-footer-email", settings.email);
      setHrefById("cms-email-link", "mailto:" + settings.email);
      setHrefById("cms-footer-email", "mailto:" + settings.email);
    }

    // ---- Hours ----
    setText("cms-hours-weekday", settings.hoursWeekday);
    setText("cms-hours-weekend", settings.hoursWeekend);
    setText("cms-footer-hours-weekday", settings.hoursWeekday);
    setText("cms-footer-hours-weekend", settings.hoursWeekend);

    // ---- Social links ----
    setHrefByClass("cms-facebook-link", settings.facebookUrl);
    setHrefByClass("cms-instagram-link", settings.instagramUrl);
    if (settings.tiktokUrl) {
      setHrefByClass("cms-tiktok-link", settings.tiktokUrl);
    } else {
      hideByClass("cms-tiktok-link");
    }

    // ---- Menu PDF download buttons (hidden until a real file is uploaded) ----
    if (settings.menuPdfUrl) {
      setHrefById("cms-menu-pdf-link", settings.menuPdfUrl);
    } else {
      var pdfButtons = document.querySelectorAll("#cms-menu-pdf-link");
      pdfButtons.forEach(function (btn) { btn.style.display = "none"; });
    }

    // ---- Our Story section ----
    setText("cms-story-label", settings.storyLabel);
    setText("cms-story-heading", settings.storyHeading);
    setText("cms-story-para1", settings.storyPara1);
    setText("cms-story-para2", settings.storyPara2);

    // ---- Homepage menu preview section ----
    setText("cms-menu-label", settings.menuSectionLabel);
    setText("cms-menu-heading", settings.menuSectionHeading);
    setText("cms-menu-blurb", settings.menuSectionBlurb);

    // ---- Full menu page hero (menu.html) ----
    setText("cms-menupage-heading", settings.menuPageHeading);
    setText("cms-menupage-blurb", settings.menuPageBlurb);

    // ---- Featured dishes (homepage preview cards, images stay fixed) ----
    for (var i = 1; i <= 6; i++) {
      setText("cms-dish" + i + "-name", settings["dish" + i + "Name"]);
      setText("cms-dish" + i + "-price", settings["dish" + i + "Price"]);
      setText("cms-dish" + i + "-desc", settings["dish" + i + "Desc"]);
    }

    // ---- Service / Private Dining cards ----
    for (var s = 1; s <= 3; s++) {
      setText("cms-service" + s + "-title", settings["service" + s + "Title"]);
      setText("cms-service" + s + "-desc", settings["service" + s + "Desc"]);
    }

    // ---- Testimonials ----
    for (var t = 1; t <= 3; t++) {
      setText("cms-testimonial" + t + "-quote", '"' + settings["testimonial" + t + "Quote"] + '"');
      setText("cms-testimonial" + t + "-name", settings["testimonial" + t + "Name"]);
      setText("cms-testimonial" + t + "-loc", settings["testimonial" + t + "Loc"]);
    }
  }

  function renderMenu(menuData) {
    var container = document.getElementById("cms-menu-list");
    if (!container || !menuData || !Array.isArray(menuData.items)) return;

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
