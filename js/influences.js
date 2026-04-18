/* ==========================================================================
   Influences / How I Think Carousel
   Loads books from data/influences.json and renders one card at a time.
   Two-column layout: book cover (left) + text (right).

   Cover space is reserved via CSS aspect-ratio (2:3) on .influences__cover,
   so the layout never shifts when images load. All covers are preloaded on
   init so card swaps read from cache and feel instant.
   ========================================================================== */

(function () {
  "use strict";

  var content = document.getElementById("influences-content");
  var prevBtn = document.getElementById("influences-prev");
  var nextBtn = document.getElementById("influences-next");
  var counterEl = document.getElementById("influences-counter");

  if (!content) return;

  var books = [];
  var index = 0;

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
    }, 180);
  }

  // Warm the browser cache with every cover so card swaps are instant.
  // Runs after the first card renders, so it doesn't block initial paint.
  function preloadCovers() {
    books.forEach(function (book) {
      if (!book.cover) return;
      var img = new Image();
      img.src = book.cover;
    });
  }

  // --- Controls ---------------------------------------------------------------
  // Fire on pointerdown so taps register the moment the finger lands, bypassing
  // the iOS double-tap-to-zoom click delay entirely. Click is kept as a fallback
  // for keyboard users (Enter/Space). Time-based debounce prevents one user
  // action from firing twice (pointerdown → synthetic click ~50ms later).

  function debounce(fn) {
    var lastFired = 0;
    return function () {
      var now = Date.now();
      if (now - lastFired < 300) return;
      lastFired = now;
      fn();
    };
  }

  if (prevBtn) {
    var goPrev = debounce(function () { update(index - 1); });
    prevBtn.addEventListener("pointerdown", goPrev);
    prevBtn.addEventListener("click", goPrev);
  }
  if (nextBtn) {
    var goNext = debounce(function () { update(index + 1); });
    nextBtn.addEventListener("pointerdown", goNext);
    nextBtn.addEventListener("click", goNext);
  }

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
    preloadCovers();
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
