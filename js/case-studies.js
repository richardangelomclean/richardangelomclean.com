/* ==========================================================================
   Video Case Studies Carousel
   Standalone carousel for the three video case study projects.
   Data is hardcoded — these are a curated set, not a dynamic feed.
   ========================================================================== */

(function () {
  "use strict";

  var content = document.getElementById("cs-carousel-content");
  var counterEl = document.getElementById("cs-carousel-counter");
  if (!content) return;

  var index = 0;

  var caseStudies = [
    {
      brand: "ChefSteps",
      subtitle: "ChefSteps Live!",
      role: "Director & Technical Producer",
      wistiaId: "el33xa3vk4",
      description: "I directed and produced six live cooking classes for ChefSteps, a YouTube channel with over a million subscribers, designed to encourage viewers of their free content to sign up for the exclusive Studio Pass membership.\n\nWe highlighted the benefits of membership by inviting select Studio Pass members to appear on camera, adding exclusivity and sparking curiosity. Each class, covering everything from Thanksgiving turkey to Valentine's chocolate steak, featured interactive polls and responses to questions via live chat, allowing viewers to influence the sessions."
    },
    {
      brand: "Crate & Barrel",
      subtitle: "Live from CrateKitchen",
      role: "Director & Technical Producer",
      wistiaId: "ieeupkf6mj",
      description: "At CrateKitchen in Northbrook, IL, I directed and produced nine live sessions: three cooking classes and six espresso classes.\n\nWe collaborated with renowned chefs and baristas, including Carolina Gellen, Top Chef's Nini Nguyen, and 2020 US Barista Champion Andrea Allen. These experts shared invaluable tips and tricks while showcasing Crate & Barrel's most popular products.\n\nWhile most of the audience watched on YouTube, we offered a VIP exclusive experience in Zoom for select community members. These Zoom attendees could interact directly with the chefs and baristas and get feedback as they followed along at home. At the end of each class, we held a product giveaway specifically for the Zoom audience."
    },
    {
      brand: "Williams-Sonoma",
      subtitle: "Coffee Classes",
      role: "Director & Technical Producer",
      wistiaId: "budrolpwia",
      description: "I directed and produced 12 interactive coffee classes for Williams-Sonoma, designed for new espresso machine owners, turning their kitchens into a collaborative learning experience.\n\nLed by 2019 US Barista Champion Sam Spillman, the classes covered everything from grinding beans to latte art. Participants didn't just get a lecture about coffee techniques; they actively shared their creations and received live feedback from Sam in real time through a custom Zoom integration, fostering an interactive and supportive environment."
    }
  ];

  // --- Helpers ---------------------------------------------------------------

  function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderInline(str) {
    return escapeHtml(str).replace(/\*([^*]+)\*/g, "<em>$1</em>");
  }

  function renderDescription(text) {
    if (!text) return "";
    var paragraphs = String(text).split("\n\n");
    return paragraphs.map(function (p) {
      return '<p class="carousel__description">' + renderInline(p.trim()) + "</p>";
    }).join("");
  }

  // --- Render ----------------------------------------------------------------

  function renderCard(study) {
    var wistiaId = escapeHtml(study.wistiaId);

    // Load media-specific Wistia embed script
    if (!document.querySelector('script[src*="' + wistiaId + '"]')) {
      var ws = document.createElement("script");
      ws.src = "https://fast.wistia.com/embed/" + wistiaId + ".js";
      ws.async = true;
      ws.type = "module";
      document.head.appendChild(ws);
    }

    var mediaHtml =
      '<div class="carousel__media carousel__media--wistia">' +
        '<wistia-player media-id="' + wistiaId + '" aspect="1.7777777777777777"></wistia-player>' +
      "</div>";

    var titleHtml = '<h3 class="carousel__brand">' + escapeHtml(study.brand) + "</h3>";
    if (study.subtitle) {
      titleHtml += '<div class="carousel__subtitle">' + renderInline(study.subtitle) + "</div>";
    }

    return (
      '<div class="carousel__media-wrapper">' +
        mediaHtml +
        '<div class="carousel__overlay-buttons">' +
          '<button class="carousel__btn carousel__btn--prev" type="button" aria-label="Previous case study">' +
            '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/></svg>' +
          '</button>' +
          '<button class="carousel__btn carousel__btn--next" type="button" aria-label="Next case study">' +
            '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z" fill="currentColor"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<div class="carousel__mobile-nav">' +
        '<button class="carousel__mobile-btn carousel__mobile-btn--prev" type="button" aria-label="Previous case study">' +
          '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/></svg>' +
        '</button>' +
        '<span class="carousel__mobile-counter"></span>' +
        '<button class="carousel__mobile-btn carousel__mobile-btn--next" type="button" aria-label="Next case study">' +
          '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z" fill="currentColor"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="carousel__info">' +
        '<div class="carousel__title-group">' + titleHtml + "</div>" +
        '<div class="carousel__role">' + escapeHtml(study.role) + "</div>" +
        renderDescription(study.description) +
      "</div>"
    );
  }

  // --- Navigation ------------------------------------------------------------

  function updateCounter() {
    var text = (index + 1) + " of " + caseStudies.length;
    if (counterEl) counterEl.textContent = text;
    var mobileCounter = content.querySelector(".carousel__mobile-counter");
    if (mobileCounter) mobileCounter.textContent = text;
  }

  function update(newIndex) {
    var total = caseStudies.length;
    index = ((newIndex % total) + total) % total;

    content.classList.add("is-transitioning");
    window.setTimeout(function () {
      content.innerHTML = renderCard(caseStudies[index]);
      content.classList.remove("is-transitioning");
      attachButtonListeners();
      updateCounter();
    }, 180);
  }

  function attachButtonListeners() {
    var prevBtns = content.querySelectorAll(".carousel__btn--prev, .carousel__mobile-btn--prev");
    var nextBtns = content.querySelectorAll(".carousel__btn--next, .carousel__mobile-btn--next");
    prevBtns.forEach(function (btn) {
      btn.addEventListener("click", function () { update(index - 1); });
    });
    nextBtns.forEach(function (btn) {
      btn.addEventListener("click", function () { update(index + 1); });
    });
  }

  // --- Init ------------------------------------------------------------------

  content.innerHTML = renderCard(caseStudies[0]);
  attachButtonListeners();
  updateCounter();
})();
