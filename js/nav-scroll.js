/* ==========================================================================
   Scroll-based Navigation Highlighting
   Highlight nav links based on scroll position (scroll-event approach)
   Reliably detects the "current" section during bidirectional scrolling
   ========================================================================== */

(function () {
  "use strict";

  // Get all nav links
  var navLinks = document.querySelectorAll(".nav__link");
  if (!navLinks.length) return;

  // Build sections array by reading href attributes from nav links
  var sections = [];
  navLinks.forEach(function(link) {
    var href = link.getAttribute("href");
    if (href && href.startsWith("#")) {
      var section = document.querySelector(href);
      if (section) {
        sections.push({ element: section, link: link });
      }
    }
  });

  if (!sections.length) return;

  var activeClass = "nav__link--active";
  var ticking = false;

  function setActive(link) {
    navLinks.forEach(function(l) {
      l.classList.remove(activeClass);
    });
    link.classList.add(activeClass);
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(function() {
      var scrollY = window.scrollY || window.pageYOffset;
      var windowHeight = window.innerHeight;
      var docHeight = document.documentElement.scrollHeight;

      // If at the very bottom of the page, highlight the last section
      if (scrollY + windowHeight >= docHeight - 50) {
        setActive(sections[sections.length - 1].link);
        ticking = false;
        return;
      }

      // Get nav height for offset (the nav is fixed at the top)
      var nav = document.querySelector(".nav");
      var navHeight = nav ? nav.offsetHeight : 0;
      var offset = navHeight + 20; // Small buffer below the nav

      // Find which section is currently active
      // The active section is the last one whose top has scrolled past the offset point
      var current = sections[0]; // Default to first section

      for (var i = 0; i < sections.length; i++) {
        var rect = sections[i].element.getBoundingClientRect();
        if (rect.top <= offset) {
          current = sections[i];
        }
      }

      setActive(current.link);
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  // Set initial state on page load
  onScroll();
})();
