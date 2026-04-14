/* ==========================================================================
   Hero Rotator
   Cycles through descriptor phrases with a fade transition.
   ========================================================================== */

(function () {
  "use strict";

  var el = document.getElementById("rotator-text");
  if (!el) return;

  var phrases = [
    "Technical complexity demystified.",
    "Clarity between stakeholders.",
    "Delegation made simple."
  ];

  var index = 0;
  var DISPLAY_MS = 2500;  // how long each phrase is visible
  var FADE_MS = 600;      // matches CSS transition duration

  // Respect prefers-reduced-motion
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    el.textContent = phrases.join(" ");
    el.style.opacity = "1";
    return;
  }

  function next() {
    el.classList.add("is-fading");

    setTimeout(function () {
      index = (index + 1) % phrases.length;
      el.textContent = phrases[index];
      el.classList.remove("is-fading");
    }, FADE_MS);
  }

  setInterval(next, DISPLAY_MS + FADE_MS);
})();
