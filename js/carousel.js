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

  function renderMedia(media) {
    if (!media || !media.src) {
      return '<div class="carousel__media" aria-hidden="true"></div>';
    }

    const safeAlt = escapeHtml(media.alt || "");

    if (media.type === "video") {
      const poster = media.poster ? ` poster="${escapeAttr(media.poster)}"` : "";
      return (
        '<div class="carousel__media">' +
          '<video src="' + escapeAttr(media.src) + '"' + poster +
          ' autoplay muted loop playsinline preload="metadata"' +
          ' aria-label="' + safeAlt + '"></video>' +
        "</div>"
      );
    }

    // Default to image
    return (
      '<div class="carousel__media">' +
        '<img src="' + escapeAttr(media.src) + '" alt="' + safeAlt + '" loading="lazy" />' +
      "</div>"
    );
  }

  function renderCard(project) {
    var titleHtml = '<h3 class="carousel__brand">' + escapeHtml(project.brand) + "</h3>";
    if (project.subtitle) {
      titleHtml += '<div class="carousel__subtitle">' + escapeHtml(project.subtitle) + "</div>";
    }

    var mediaHtml = renderMedia(project.media);
    // Inject nav buttons inside the media container
    mediaHtml = mediaHtml.replace(
      '></div>',
      '><div class="carousel__nav">' +
        '<button class="carousel__btn carousel__btn--prev" type="button" aria-label="Previous project">' +
          '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/></svg>' +
        '</button>' +
        '<button class="carousel__btn carousel__btn--next" type="button" aria-label="Next project">' +
          '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z" fill="currentColor"/></svg>' +
        '</button>' +
      '</div>'
    );

    return (
      mediaHtml +
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

  function attachNavListeners() {
    // Attach listeners to newly created buttons inside the media container
    var mediaPrevBtn = content.querySelector(".carousel__btn--prev");
    var mediaNextBtn = content.querySelector(".carousel__btn--next");

    if (mediaPrevBtn) {
      mediaPrevBtn.addEventListener("click", function () { update(index - 1); });
      mediaPrevBtn.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft")  { e.preventDefault(); update(index - 1); }
        if (e.key === "ArrowRight") { e.preventDefault(); update(index + 1); }
      });
    }

    if (mediaNextBtn) {
      mediaNextBtn.addEventListener("click", function () { update(index + 1); });
      mediaNextBtn.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft")  { e.preventDefault(); update(index - 1); }
        if (e.key === "ArrowRight") { e.preventDefault(); update(index + 1); }
      });
    }
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
      manageVideo();
      attachNavListeners();
    }, 180);
  }

  // --- Controls --------------------------------------------------------------

  prevBtn.addEventListener("click", function () { update(index - 1); });
  nextBtn.addEventListener("click", function () { update(index + 1); });

  // Keyboard: left/right when a carousel button is focused
  [prevBtn, nextBtn].forEach(function (btn) {
    btn.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft")  { e.preventDefault(); update(index - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); update(index + 1); }
    });
  });

  // Hide nav arrows when there's only one project (hide the old nav container)
  function syncNavVisibility() {
    const show = projects.length > 1;
    // Hide the old carousel__nav container in the HTML
    var oldNav = document.querySelector(".carousel__nav:not(.carousel__media .carousel__nav)");
    if (oldNav) {
      oldNav.style.display = show ? "" : "none";
    }
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
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
      return;
    }
    content.innerHTML = renderCard(projects[0]);
    attachNavListeners();
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
