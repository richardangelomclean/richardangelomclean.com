/* ==========================================================================
   Select Projects Carousel
   Loads projects from data/projects.json and renders one card at a time.
   Supports either an <img> or a muted auto-looping <video> per entry.
   ========================================================================== */

(function () {
  "use strict";

  const content = document.getElementById("carousel-content");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");

  if (!content || !prevBtn || !nextBtn) return;

  let projects = [];
  let index = 0;

  // --- Render a single project card ------------------------------------------

  function renderMediaWithButtons(media) {
    var mediaHtml = '';

    if (!media || !media.src) {
      mediaHtml = '<div class="carousel__media" aria-hidden="true"></div>';
    } else {
      const safeAlt = escapeHtml(media.alt || "");

      if (media.type === "video") {
        const poster = media.poster ? ` poster="${escapeAttr(media.poster)}"` : "";
        mediaHtml = (
          '<div class="carousel__media">' +
            '<video src="' + escapeAttr(media.src) + '"' + poster +
            ' autoplay muted loop playsinline preload="metadata"' +
            ' aria-label="' + safeAlt + '"></video>' +
          "</div>"
        );
      } else {
        // Default to image
        mediaHtml = (
          '<div class="carousel__media">' +
            '<img src="' + escapeAttr(media.src) + '" alt="' + safeAlt + '" loading="lazy" />' +
          "</div>"
        );
      }
    }

    // Wrap media and buttons in a container with position: relative
    return (
      '<div class="carousel__media-wrapper">' +
        mediaHtml +
        '<div class="carousel__overlay-buttons">' +
          '<button class="carousel__btn carousel__btn--prev" type="button" aria-label="Previous project">' +
            '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/></svg>' +
          '</button>' +
          '<button class="carousel__btn carousel__btn--next" type="button" aria-label="Next project">' +
            '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z" fill="currentColor"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>'
    );
  }

  function renderCard(project) {
    var titleHtml = '<h3 class="carousel__brand">' + escapeHtml(project.brand) + "</h3>";
    if (project.subtitle) {
      titleHtml += '<div class="carousel__subtitle">' + escapeHtml(project.subtitle) + "</div>";
    }

    return (
      renderMediaWithButtons(project.media) +
      '<div class="carousel__info">' +
        '<div class="carousel__title-group">' + titleHtml + "</div>" +
        '<div class="carousel__role">' + escapeHtml(project.role) + "</div>" +
        renderDescription(project.description) +
      "</div>"
    );
  }

  // Pause videos that are no longer visible, play the current one
  function manageVideo() {
    var videos = content.querySelectorAll("video");
    videos.forEach(function (v) { v.play(); });
  }

  function update(newIndex) {
    if (!projects.length) return;
    const total = projects.length;
    index = ((newIndex % total) + total) % total; // wrap both directions

    // Fade out, swap, fade in
    content.classList.add("is-transitioning");
    window.setTimeout(function () {
      content.innerHTML = renderCard(projects[index]);
      content.classList.remove("is-transitioning");
      attachButtonListeners();
      attachStaticButtonListeners();
      manageVideo();
      syncNavVisibility();
    }, 180);
  }

  function attachButtonListeners() {
    const prevBtns = content.querySelectorAll(".carousel__btn--prev");
    const nextBtns = content.querySelectorAll(".carousel__btn--next");
    prevBtns.forEach(function (btn) {
      btn.addEventListener("click", function () { update(index - 1); });
    });
    nextBtns.forEach(function (btn) {
      btn.addEventListener("click", function () { update(index + 1); });
    });
  }

  function attachStaticButtonListeners() {
    const staticPrev = document.getElementById("carousel-prev");
    const staticNext = document.getElementById("carousel-next");
    if (staticPrev) {
      staticPrev.onclick = function() { update(index - 1); };
    }
    if (staticNext) {
      staticNext.onclick = function() { update(index + 1); };
    }
  }

  // --- Controls (old buttons hidden, listeners attached to overlay buttons) ------

  // Hide overlay nav arrows when there's only one project
  function syncNavVisibility() {
    const show = projects.length > 1;
    const prevBtns = content.querySelectorAll(".carousel__btn--prev");
    const nextBtns = content.querySelectorAll(".carousel__btn--next");
    prevBtns.forEach(function (btn) { btn.style.display = show ? "" : "none"; });
    nextBtns.forEach(function (btn) { btn.style.display = show ? "" : "none"; });
  }

  // --- Helpers ---------------------------------------------------------------

  function renderDescription(text) {
    if (!text) return "";
    var paragraphs = String(text).split("\n\n");
    return paragraphs.map(function (p) {
      return '<p class="carousel__description">' + escapeHtml(p.trim()) + "</p>";
    }).join("");
  }

  function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttr(str) {
    return escapeHtml(str);
  }

  // --- Load ------------------------------------------------------------------

  function init(data) {
    projects = Array.isArray(data.projects) ? data.projects : [];
    if (!projects.length) {
      content.innerHTML = '<p class="carousel__description">No projects to display yet.</p>';
      return;
    }
    content.innerHTML = renderCard(projects[0]);
    attachButtonListeners();
    attachStaticButtonListeners();
    syncNavVisibility();
  }

  // Try fetch first (works on http/https); fall back to <script> injection for file://
  fetch("data/projects.json", { cache: "no-cache" })
    .then(function (res) {
      if (!res.ok) throw new Error("Failed to load projects.json (" + res.status + ")");
      return res.json();
    })
    .then(init)
    .catch(function () {
      // file:// fallback — load JSON via a script tag with a callback
      window.__loadProjects = function (data) { init(data); };
      var s = document.createElement("script");
      s.src = "data/projects.js";
      document.head.appendChild(s);
    });
})();
