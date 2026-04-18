/* ==========================================================================
   Influences / How I Think Carousel
   Loads books from data/influences.json and renders one card at a time.
   Two-column layout: book cover (left) + text (right).
   ========================================================================== */

(function () {
  "use strict";

  var content = document.getElementById("influences-content");
  var prevBtn = document.getElementById("influences-prev");
  var nextBtn = document.getElementById("influences-next");
  var counterEl = document.getElementById("influences-counter");
  var contentWrapper = document.querySelector(".influences__content-wrapper");

  if (!content) return;

  var books = [];
  var index = 0;

  // --- Mobile arrow positioning ---------------------------------------------
  // On mobile the cover image height varies by aspect ratio, so we measure the
  // cover after render and set a CSS variable the arrows read.
  // On desktop the CSS uses a fixed top (var is ignored there).

  function positionArrows() {
    if (!contentWrapper) return;
    var cover = content.querySelector(".influences__cover");
    if (!cover) return;
    var h = cover.offsetHeight;
    if (h === 0) return; // image not laid out yet
    var centerY = cover.offsetTop + h / 2;
    contentWrapper.style.setProperty("--cover-center", centerY + "px");
  }

  function positionArrowsWhenReady() {
    positionArrows();
    var img = content.querySelector(".influences__cover img");
    if (img && !img.complete) {
      img.addEventListener("load", positionArrows, { once: true });
    }
  }

  // --- Render a single book card ---------------------------------------------

  function renderCard(book) {
    var descParagraphs = String(book.description).split("\n\n");
    var descHtml = descParagraphs.map(function (p) {
      return '<p class="influences__description">' + renderInline(p.trim()) + "</p>";
    }).join("");

    return (
      '<div class="influences__cover">' +
        '<img src="' + escapeAttr(book.cover) + '" alt="Cover of ' + escapeAttr(book.title) + ' by ' + escapeAttr(book.author) + '" />' +
      '</div>' +
      '<div class="influences__text">' +
        '<h3 class="influences__book-title"><em>' + escapeHtml(book.title) + '</em></h3>' +
        '<div class="influences__author">' + escapeHtml(book.author) + '</div>' +
        descHtml +
      '</div>'
    );
  }

  // Escape HTML first, then convert *text* markers to <em> tags.
  // Order matters: escape runs on raw content so user text stays safe; the
  // italic conversion only affects our own asterisk markers (added in JSON).
  function renderInline(str) {
    return escapeHtml(str).replace(/\*([^*]+)\*/g, "<em>$1</em>");
  }

  function updateCounter() {
    if (counterEl && books.length) {
      counterEl.textContent = (index + 1) + " of " + books.length;
    }
  }

  function update(newIndex) {
    if (!books.length) return;
    var total = books.length;
    index = ((newIndex % total) + total) % total;

    content.classList.add("is-transitioning");
    window.setTimeout(function () {
      content.innerHTML = renderCard(books[index]);
      content.classList.remove("is-transitioning");
      updateCounter();
      positionArrowsWhenReady();
    }, 180);
  }

  // --- Controls ---------------------------------------------------------------

  if (prevBtn) prevBtn.addEventListener("click", function () { update(index - 1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { update(index + 1); });
  window.addEventListener("resize", positionArrows);

  // --- Helpers ----------------------------------------------------------------

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

  // --- Load -------------------------------------------------------------------

  function init(data) {
    books = Array.isArray(data.books) ? data.books : [];
    if (!books.length) {
      content.innerHTML = '<p class="influences__description">No books to display yet.</p>';
      return;
    }
    content.innerHTML = renderCard(books[0]);
    updateCounter();
    positionArrowsWhenReady();
  }

  // Try fetch first (works on http/https); fall back to <script> injection for file://
  fetch("data/influences.json", { cache: "no-cache" })
    .then(function (res) {
      if (!res.ok) throw new Error("Failed to load influences.json (" + res.status + ")");
      return res.json();
    })
    .then(init)
    .catch(function () {
      // file:// fallback — load JSON via a script tag with a callback
      window.__loadInfluences = function (data) { init(data); };
      var s = document.createElement("script");
      s.src = "data/influences.js";
      document.head.appendChild(s);
    });
})();
