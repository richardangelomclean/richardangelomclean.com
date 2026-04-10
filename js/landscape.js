/* ==========================================================================
   Landscape Orientation Handler
   Handles video scrolling when rotating to landscape on mobile devices.
   ========================================================================== */

(function () {
  "use strict";

  var reel = document.getElementById("reel");
  if (!reel) return;

  var navHeight = 60; // Approximate nav height in px

  function handleOrientationChange() {
    // Only run on small screens (phones)
    if (window.innerWidth > 767) return;

    // If user is near the top (within about 2 screens), scroll hero video into view
    if (window.scrollY < window.innerHeight * 2) {
      // Scroll the video container into view, positioned just below the nav
      var offsetTop = reel.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({
        top: Math.max(0, offsetTop),
        behavior: "smooth"
      });
    }
  }

  // Listen for orientation changes
  if (window.screen && window.screen.orientation) {
    try {
      window.screen.orientation.addEventListener("change", handleOrientationChange);
    } catch (e) {
      // Fallback for older browsers
      window.addEventListener("orientationchange", handleOrientationChange);
    }
  } else {
    // Fallback for older browsers without screen.orientation API
    window.addEventListener("orientationchange", handleOrientationChange);
  }

  // Also listen for resize in case orientation change is detected that way
  var orientationCheckTimeout;
  window.addEventListener("resize", function () {
    clearTimeout(orientationCheckTimeout);
    orientationCheckTimeout = setTimeout(function () {
      // Check if we've transitioned to landscape
      if (window.innerHeight < window.innerWidth) {
        handleOrientationChange();
      }
    }, 300);
  });
})();
