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

  // Get absolute top of an element by walking offsetParent chain
  function getAbsoluteTop(el) {
    var top = 0;
    while (el) {
      top += el.offsetTop;
      el = el.offsetParent;
    }
    return top;
  }

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
      var offset = navHeight + 40; // Buffer below the nav

      // The trigger point in the document
      var triggerPoint = scrollY + offset;

      // Find which section is currently active using "last section passed"
      // algorithm. The active section is the last one whose top we've scrolled
      // past. This means each section's zone extends from its top all the way
      // to the next section's top. Sections without nav links (like Video Case
      // Studies) are naturally absorbed into the zone of the previous nav section.
      var current = sections[0];

      for (var i = sections.length - 1; i >= 0; i--) {
        var sectionTop = getAbsoluteTop(sections[i].element);
        if (triggerPoint >= sectionTop) {
          current = sections[i];
          break;
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
