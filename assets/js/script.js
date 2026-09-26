/* ============================================================
   Rennes — script principal
   Aucune dépendance externe.
   ============================================================ */
(function () {
  "use strict";

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  /* ---------- Navbar : effet au scroll ---------- */
  var nav = $(".nav");

  /* ---------- Menu mobile ---------- */
  var toggle = $(".nav__toggle");
  var links = $(".nav__links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // Ferme le menu après un clic sur un lien
    $$(".nav__link", links).forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
    // Ferme au clic hors menu
    document.addEventListener("click", function (e) {
      if (!links.contains(e.target) && !toggle.contains(e.target)) {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Bouton retour en haut ---------- */
  var toTop = $(".to-top");
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Scrollspy + état navbar + bouton haut ---------- */
  var sections = $$("section[id], header[id]");
  var navLinks = $$(".nav__link");

  function onScroll() {
    var y = window.scrollY;

    if (nav) nav.classList.toggle("is-scrolled", y > 40);
    if (toTop) toTop.classList.toggle("is-visible", y > 500);

    var current = "";
    sections.forEach(function (sec) {
      if (y >= sec.offsetTop - 140) current = sec.id;
    });
    navLinks.forEach(function (l) {
      l.classList.toggle("is-active", l.getAttribute("href") === "#" + current);
    });
  }

  var ticking = false;
  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );
  onScroll();

  /* ---------- Hero : carousel a points avec compte a rebours ---------- */
  var heroDots = $$(".hero-dot");
  var heroDotsWrap = $(".hero-dots");
  var heroRoot = $(".hero");

  if (heroRoot && heroDots.length) {
    var heroImages = [
      "/assets/img/hero.jpg",
      "/assets/img/parc.jpg",
      "/assets/img/palais.jpg",
      "/assets/img/marche.jpg",
      "/assets/img/cargo.jpg"
    ];
    var heroIndex = 0;
    var heroTimer = null;
    var heroTransitionTimer = null;
    var heroDuration = 5000;
    heroRoot.style.setProperty("--hero-slide-duration", heroDuration + "ms");

    function setHeroSlide(index, restartTimer) {
      var nextIndex = (index + heroImages.length) % heroImages.length;
      var nextImage = heroImages[nextIndex];
      var currentImage = heroImages[heroIndex];

      if (nextIndex !== heroIndex) {
        if (heroTransitionTimer) clearTimeout(heroTransitionTimer);
        heroRoot.style.setProperty("--hero-img", "url('" + currentImage + "')");
        heroRoot.style.setProperty("--hero-next-img", "url('" + nextImage + "')");
        heroRoot.classList.add("is-transitioning");
        heroTransitionTimer = setTimeout(function () {
          heroRoot.style.setProperty("--hero-img", "url('" + nextImage + "')");
          heroRoot.classList.remove("is-transitioning");
        }, 720);
      } else {
        heroRoot.style.setProperty("--hero-img", "url('" + nextImage + "')");
        heroRoot.classList.remove("is-transitioning");
      }

      heroIndex = nextIndex;

      heroDots.forEach(function (dot, i) {
        var active = i === heroIndex;
        dot.classList.toggle("is-active", active);
        dot.classList.remove("is-paused");
        if (active) {
          dot.setAttribute("aria-current", "true");
          // Relance l'animation CSS de progression meme si on revient sur le meme point.
          var progress = dot.querySelector("span");
          if (progress) {
            progress.style.animation = "none";
            progress.offsetHeight;
            progress.style.animation = "";
          }
        } else {
          dot.removeAttribute("aria-current");
        }
      });

      if (restartTimer !== false) startHeroTimer();
    }

    function startHeroTimer() {
      if (heroTimer) clearTimeout(heroTimer);
      if (document.hidden) return;
      heroTimer = setTimeout(function () {
        setHeroSlide(heroIndex + 1, true);
      }, heroDuration + 80);
    }

    if (heroDotsWrap) {
      heroDotsWrap.addEventListener("click", function (event) {
        var dot = event.target.closest(".hero-dot");
        if (!dot || !heroDotsWrap.contains(dot)) return;
        setHeroSlide(parseInt(dot.dataset.slide, 10) || 0, true);
      });

      heroDotsWrap.addEventListener("animationend", function (event) {
        if (!event.target.closest(".hero-dot.is-active")) return;
        if (event.animationName !== "heroDotProgress") return;
        setHeroSlide(heroIndex + 1, true);
      });
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        if (heroTimer) clearTimeout(heroTimer);
        heroDots.forEach(function (dot) { dot.classList.add("is-paused"); });
      } else {
        setHeroSlide(heroIndex, true);
      }
    });

    setHeroSlide(0, true);
  }

  /* ---------- Révélation au scroll ---------- */
  var revealables = $$(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -60px 0px" }
    );
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Compteurs animés ---------- */
  function animateCount(el) {
    var target = parseFloat(el.dataset.count);
    var suffix = el.dataset.suffix || "";
    var duration = 1500;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      var value = target * eased;
      el.textContent = (target % 1 === 0 ? Math.round(value) : value.toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counters = $$(".stat__value[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    var ioCount = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            ioCount.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) { ioCount.observe(el); });
  }

  /* ---------- Accordéon FAQ : un seul ouvert à la fois ---------- */
  var faqItems = $$(".faq details");
  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) {
        faqItems.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ---------- Licence : favicon emoji (évite un 404) ---------- */
  var favicon = $('link[rel="icon"]');
  if (favicon) {
    favicon.setAttribute(
      "href",
      "data:image/svg+xml," +
        encodeURIComponent(
          "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>" +
            "<rect width='100' height='100' fill='%23e50914'/>" +
            "<text x='50' y='72' font-size='64' text-anchor='middle' fill='white' " +
            "font-family='Arial,sans-serif' font-weight='bold'>R</text></svg>"
        )
    );
  }
})();
