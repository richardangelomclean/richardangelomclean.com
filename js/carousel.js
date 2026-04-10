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

    return (
      renderMedia(project.media) +
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
      manageVideo();
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

  // Hide nav arrows when there's only one project
  function syncNavVisibility() {
    const show = projects.length > 1;
    prevBtn.style.display = show ? "" : "none";
    nextBtn.style.display = show ? "" : "none";
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
