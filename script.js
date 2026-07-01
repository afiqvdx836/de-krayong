/* ============================================================
   De Krayong — Main Script (Vanilla JS)
   ============================================================ */

(function () {
  "use strict";

  /* ----- DOM References ----- */
  const loader = document.getElementById("loader");
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");
  const backToTop = document.getElementById("backToTop");
  const sections = document.querySelectorAll("section[id]");

  /* Lightbox */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  const lightboxCounter = document.getElementById("lightboxCounter");
  const galleryImages = Array.from(
    document.querySelectorAll(".gallery-item img"),
  );

  /* Reviews slider */
  const reviewsTrack = document.getElementById("reviewsTrack");
  const sliderPrev = document.getElementById("sliderPrev");
  const sliderNext = document.getElementById("sliderNext");
  const sliderDotsContainer = document.getElementById("sliderDots");

  /* ============================
     Loading Screen
     ============================ */
  window.addEventListener("load", () => {
    /* Animate hero elements */
    document.querySelectorAll(".reveal-hero").forEach((el, i) => {
      setTimeout(() => el.classList.add("visible"), 200 + i * 150);
    });

    /* Hide loader */
    setTimeout(() => {
      loader.classList.add("hidden");
    }, 600);
  });

  /* ============================
     Mobile Navigation
     ============================ */
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.classList.toggle("active");
    navToggle.setAttribute("aria-expanded", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  /* Close on link click */
  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      navToggle.classList.remove("active");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });

  /* ============================
     Scroll Handlers (combined for perf)
     ============================ */
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleNavbar();
        highlightActiveNav();
        handleBackToTop();
        ticking = false;
      });
      ticking = true;
    }
  }

  function handleNavbar() {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
  }

  function highlightActiveNav() {
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + id,
          );
        });
      }
    });
  }

  function handleBackToTop() {
    backToTop.classList.toggle("visible", window.scrollY > 500);
  }

  window.addEventListener("scroll", onScroll);
  handleNavbar();
  highlightActiveNav();

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ============================
     Scroll Reveal (Intersection Observer)
     ============================ */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  document
    .querySelectorAll(".reveal")
    .forEach((el) => revealObserver.observe(el));

  /* ============================
     Animated Counters
     ============================ */
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute("data-target"), 10);
          animateCounter(el, target);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 },
  );

  document
    .querySelectorAll(".counter-number")
    .forEach((el) => counterObserver.observe(el));

  function animateCounter(el, target) {
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + "+";
    }, 25);
  }

  /* ============================
     Gallery Lightbox
     ============================ */
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightboxFn() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function updateLightbox() {
    const img = galleryImages[currentIndex];
    lightboxImg.src = img.src.replace(/w=\d+/, "w=1400");
    lightboxImg.alt = img.alt;
    lightboxCounter.textContent =
      currentIndex + 1 + " / " + galleryImages.length;
  }

  function showPrevImg() {
    currentIndex =
      (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightbox();
  }

  function showNextImg() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    updateLightbox();
  }

  galleryImages.forEach((img, i) => {
    img
      .closest(".gallery-item")
      .addEventListener("click", () => openLightbox(i));
  });

  lightboxClose.addEventListener("click", closeLightboxFn);
  lightboxPrev.addEventListener("click", showPrevImg);
  lightboxNext.addEventListener("click", showNextImg);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightboxFn();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightboxFn();
    if (e.key === "ArrowLeft") showPrevImg();
    if (e.key === "ArrowRight") showNextImg();
  });

  /* ============================
     Testimonial Slider
     ============================ */
  const reviewCards = reviewsTrack.querySelectorAll(".review-card");
  let slidesPerView = 1;
  let slideIndex = 0;

  function getVisibleSlides() {
    const w = window.innerWidth;
    if (w <= 768) return 1;
    if (w <= 1024) return 2;
    return 3;
  }

  function buildDots() {
    sliderDotsContainer.innerHTML = "";
    const totalDots = Math.ceil(reviewCards.length / slidesPerView);
    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement("button");
      dot.classList.add("slider-dot");
      if (i === 0) dot.classList.add("active");
      dot.setAttribute("aria-label", "Go to slide " + (i + 1));
      dot.addEventListener("click", () => goToSlide(i));
      sliderDotsContainer.appendChild(dot);
    }
  }

  function goToSlide(index) {
    const totalDots = Math.ceil(reviewCards.length / slidesPerView);
    slideIndex = Math.max(0, Math.min(index, totalDots - 1));

    const cardWidth = reviewCards[0].offsetWidth + (parseFloat(getComputedStyle(reviewsTrack).gap) || 0);
    console.log("review card offset width:", reviewCards[0].offsetWidth)
    console.log("review track", (parseFloat(getComputedStyle(reviewsTrack).gap)))
    console.log("card width:", cardWidth)
    const offset = slideIndex * slidesPerView * cardWidth;
    reviewsTrack.style.transform = "translateX(-" + offset + "px)";
  
    sliderDotsContainer.querySelectorAll(".slider-dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === slideIndex);
    });
  }

  function initSlider() {
    slidesPerView = getVisibleSlides();
    slideIndex = 0;
    buildDots();
    goToSlide(0);
  }

  sliderPrev.addEventListener("click", () => goToSlide(slideIndex - 1));
  sliderNext.addEventListener("click", () => goToSlide(slideIndex + 1));

  initSlider();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initSlider, 200);
  });

  /* ============================
     Image Lazy Loading Fallback
     ============================ */
  if (!("loading" in HTMLImageElement.prototype)) {
    const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
    const lazyObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          lazyObs.unobserve(img);
        }
      });
    });
    lazyImgs.forEach((img) => lazyObs.observe(img));
  }
})();