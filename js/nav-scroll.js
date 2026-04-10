/* ==========================================================================
   Scroll-based Navigation Highlighting
   Highlight nav links based on which section is in view
   ========================================================================== */

(function () {
  "use strict";

  // Get all nav links
  const navLinks = document.querySelectorAll(".nav__link");
  if (!navLinks.length) return;

  // Get the main sections to watch
  const workSection = document.getElementById("work");
  const aboutSection = document.getElementById("about");
  const contactSection = document.getElementById("contact");

  if (!workSection || !aboutSection || !contactSection) return;

  // Map sections to their corresponding nav link indices
  const sectionMap = [
    { section: workSection, link: navLinks[0] },
    { section: aboutSection, link: navLinks[1] },
    { section: contactSection, link: navLinks[2] }
  ];

  // Function to remove active class from all links
  function clearActive() {
    navLinks.forEach(function (link) {
      link.classList.remove("nav__link--active");
    });
  }

  // Function to set active link
  function setActive(link) {
    clearActive();
    link.classList.add("nav__link--active");
  }

  // Create IntersectionObserver to watch sections
  const observerOptions = {
    threshold: 0.3,
    rootMargin: "-20% 0px -20% 0px"
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Find the corresponding nav link
        for (let i = 0; i < sectionMap.length; i++) {
          if (sectionMap[i].section === entry.target) {
            setActive(sectionMap[i].link);
            break;
          }
        }
      }
    });
  }, observerOptions);

  // Observe all sections
  sectionMap.forEach(function (item) {
    observer.observe(item.section);
  });

  // Set Work as active on page load (default)
  setActive(sectionMap[0].link);
})();
