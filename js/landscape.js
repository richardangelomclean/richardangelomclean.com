/* ==========================================================================
   Landscape Video Optimization
   When rotating to landscape on small screens, center the Vimeo video below nav
   ========================================================================== */

(function () {
  "use strict";

  function handleOrientationChange() {
    // Only trigger on small screens (height < 768px indicates mobile)
    if (Math.min(window.innerWidth, window.innerHeight) >= 768) return;

    // Check if user is near the top of the page
    if (window.scrollY > window.innerHeight * 2) return;

    // Find the Vimeo iframe container
    const reel = document.getElementById("reel");
    if (!reel) return;

    // Scroll to center the video below the nav
    reel.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // Listen for orientation changes
  if (screen.orientation) {
    screen.orientation.addEventListener("change", handleOrientationChange);
  }

  // Fallback for older browsers
  window.addEventListener("orientationchange", handleOrientationChange);
})();
