/* ============================================================
   UbiFit legal & support pages — progressive enhancement only.

   Every page is complete and readable with this file blocked:
   the theme is already set by the inline script in <head>, the
   contents list is real anchors, the questions are real
   <details>, and the entrance animation is opted into by the
   `js` class that same inline script adds.
   ============================================================ */

(function () {
  "use strict";

  var root = document.documentElement;
  var THEME_KEY = "ubiring-theme-v2";

  /* -- Theme ------------------------------------------------ */

  /* Same storage key as the ubifit.net landing page, so a visitor
     who picked light there keeps light here once the two sites
     share an origin. Storage throws in some privacy modes; a
     theme that fails to persist is not worth breaking a page
     over, so every access is guarded. */
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);

    var toggle = document.querySelector("[data-theme-toggle]");
    if (toggle) {
      toggle.setAttribute("aria-pressed", String(theme === "light"));
      toggle.setAttribute(
        "aria-label",
        theme === "light" ? "Switch to dark theme" : "Switch to light theme"
      );
    }

    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      /* Non-persistent theme is still a working theme. */
    }
  }

  var themeToggle = document.querySelector("[data-theme-toggle]");
  if (themeToggle) {
    /* Sync the button's label with whatever the inline script chose. */
    applyTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark");

    themeToggle.addEventListener("click", function () {
      applyTheme(root.getAttribute("data-theme") === "light" ? "dark" : "light");
    });
  }

  /* -- Scroll-driven chrome --------------------------------- */

  var header = document.querySelector("[data-header]");
  var progress = document.querySelector("[data-progress]");
  var toTop = document.querySelector("[data-to-top]");
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset || 0;

    if (header) {
      header.classList.toggle("is-scrolled", y > 8);
    }

    if (progress) {
      var span = root.scrollHeight - window.innerHeight;
      progress.style.setProperty(
        "--progress",
        span > 0 ? String(Math.min(y / span, 1)) : "0"
      );
    }

    if (toTop) {
      toTop.classList.toggle("is-visible", y > window.innerHeight * 0.6);
    }

    ticking = false;
  }

  function requestScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }

  if (header || progress || toTop) {
    window.addEventListener("scroll", requestScroll, { passive: true });
    window.addEventListener("resize", requestScroll, { passive: true });
    onScroll();
  }

  if (toTop) {
    toTop.addEventListener("click", function () {
      var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    });
  }

  /* -- Contents scroll-spy ---------------------------------- */

  /* Marks the section the reader is in. The rootMargin pins the
     trigger line just under the fixed header and three-quarters
     up the viewport, so the highlight changes when a heading
     reaches reading position rather than when it first appears.
     Links are collected from every [data-toc] — the desktop rail
     and the mobile sheet carry the same list, and both stay in
     step because they are updated together. */
  var tocLinks = Array.prototype.slice.call(
    document.querySelectorAll("[data-toc] a[href^='#']")
  );

  if (tocLinks.length > 0 && "IntersectionObserver" in window) {
    var targets = [];
    var visible = [];

    tocLinks.forEach(function (link) {
      var target = document.getElementById(link.getAttribute("href").slice(1));
      if (target && targets.indexOf(target) === -1) {
        targets.push(target);
      }
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var at = visible.indexOf(entry.target.id);
          if (entry.isIntersecting && at === -1) {
            visible.push(entry.target.id);
          } else if (!entry.isIntersecting && at !== -1) {
            visible.splice(at, 1);
          }
        });

        if (visible.length === 0) {
          return;
        }

        /* Resolve in DOCUMENT order, not in the order entries
           fired, so scrolling up lands on the section above
           rather than on whichever observer callback was last. */
        var active = null;
        for (var i = 0; i < targets.length; i += 1) {
          if (visible.indexOf(targets[i].id) !== -1) {
            active = targets[i].id;
            break;
          }
        }

        tocLinks.forEach(function (link) {
          link.classList.toggle(
            "is-active",
            link.getAttribute("href") === "#" + active
          );
        });
      },
      { rootMargin: "-96px 0px -75% 0px", threshold: 0 }
    );

    targets.forEach(function (target) {
      observer.observe(target);
    });
  }

  /* -- Disclosures ------------------------------------------ */

  /* A link to a collapsed question would otherwise jump to a
     closed <details> and show nothing, so open the target first.
     Covers both a pasted deep link and a click in the contents. */
  function openTargetDetails() {
    if (!window.location.hash || window.location.hash.length < 2) {
      return;
    }
    var target = document.getElementById(window.location.hash.slice(1));
    if (target && target.tagName === "DETAILS") {
      target.open = true;
    }
  }

  openTargetDetails();
  window.addEventListener("hashchange", openTargetDetails);

  /* Closes the mobile contents sheet once a section is chosen. */
  var mobileToc = document.querySelector(".toc--mobile");
  if (mobileToc) {
    mobileToc.addEventListener("click", function (event) {
      if (event.target.closest("a[href^='#']")) {
        mobileToc.open = false;
      }
    });
  }
})();
