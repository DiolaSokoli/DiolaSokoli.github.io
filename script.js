const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  siteNav.classList.remove("is-open");
}

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  siteNav.classList.toggle("is-open", !isExpanded);
});

siteNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menuToggle.focus();
  }
});

const sectionLinks = [...siteNav.querySelectorAll('a[href^="#"]')];
const linksBySectionId = new Map(
  sectionLinks.map((link) => [link.hash.slice(1), link])
);
const sections = [...document.querySelectorAll("main section[id]")]
  .filter((section) => linksBySectionId.has(section.id));
const visibleSections = new Map();

function updateCurrentSection() {
  const activeSection = [...visibleSections.entries()]
    .sort(([, firstRatio], [, secondRatio]) => secondRatio - firstRatio)[0]?.[0];

  for (const link of sectionLinks) {
    if (activeSection && link.hash === `#${activeSection.id}`) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  }
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        visibleSections.set(entry.target, entry.intersectionRatio);
      } else {
        visibleSections.delete(entry.target);
      }
    }
    updateCurrentSection();
  },
  { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
);

for (const section of sections) {
  sectionObserver.observe(section);
}

document.addEventListener("click", (event) => {
  if (
    menuToggle.getAttribute("aria-expanded") === "true"
    && event.target instanceof Element
    && !event.target.closest(".site-header")
  ) {
    closeMenu();
  }
});
