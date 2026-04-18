/* ==========================================================================
   Mobile Nav Toggle
   Handles hamburger open/close behavior below the 768px breakpoint.
   Desktop CSS renders the link row statically and ignores is-open state.
   ========================================================================== */

(function () {
  "use strict";

  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav__toggle");
  var links = document.getElementById("nav-links");

  if (!nav || !toggle || !links) return;

  function open() {
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
  }

  function close() {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  function isOpen() {
    return nav.classList.contains("is-open");
  }

  // Toggle on button click
  toggle.addEventListener("click", function () {
    if (isOpen()) close(); else open();
  });

  // Close when a nav link is tapped (lets the anchor scroll happen, then hides)
  links.addEventListener("click", function (e) {
    var target = e.target;
    while (target && target !== links) {
      if (target.classList && target.classList.contains("nav__link")) {
        close();
        return;
      }
      target = target.parentNode;
    }
  });

  // Close on outside click
  document.addEventListener("click", function (e) {
    if (!isOpen()) return;
    if (nav.contains(e.target)) return;
    close();
  });

  // Close on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen()) {
      close();
      toggle.focus();
    }
  });

  // If the viewport grows past the mobile breakpoint while the menu is open,
  // reset state so the desktop layout doesn't carry is-open styles.
  var mq = window.matchMedia("(min-width: 768px)");
  function handleBreakpointChange(e) {
    if (e.matches && isOpen()) close();
  }
  if (mq.addEventListener) {
    mq.addEventListener("change", handleBreakpointChange);
  } else if (mq.addListener) {
    mq.addListener(handleBreakpointChange); // Safari < 14
  }
})();
