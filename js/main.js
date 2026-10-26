/* =====================================================
   FLOWRA DANCE STUDIO — MAIN.JS
   Navigation, animations and hero typewriter effect
===================================================== */

(() => {
  "use strict";

  function initFlowra() {

    /* ================================================
       1. MOBILE NAVIGATION
    ================================================ */

    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    if (menuToggle && mainNav) {

      function closeMenu() {
        mainNav.classList.remove("is-open");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      }

      menuToggle.addEventListener("click", () => {
        const isOpen =
          menuToggle.getAttribute("aria-expanded") === "true";

        if (isOpen) {
          closeMenu();
        } else {
          mainNav.classList.add("is-open");

          menuToggle.setAttribute("aria-expanded", "true");
          menuToggle.setAttribute("aria-label", "Close navigation");
        }
      });

      mainNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeMenu();
        }
      });

      document.addEventListener("click", (event) => {
        const isOpen =
          menuToggle.getAttribute("aria-expanded") === "true";

        if (
          isOpen &&
          !mainNav.contains(event.target) &&
          !menuToggle.contains(event.target)
        ) {
          closeMenu();
        }
      });

      window.addEventListener("resize", () => {
        if (window.innerWidth > 820) {
          closeMenu();
        }
      });
    }


    /* ================================================
       2. HERO QUESTION TYPEWRITER

    ================================================ */

    const typedQuestion = document.getElementById("typedQuestion");

    if (typedQuestion) {

      const questions = [
        "Planning a surprise dance for your brother's wedding?",
        "Ready to find your signature dance style?",
        "Want to own the stage at your next event?",
        "Dreaming of a performance worth remembering?",
        "Ready to make every moment unforgettable?"
      ];

      let questionIndex = 0;
      let characterIndex = 0;
      let isDeleting = false;
      let typingTimer = null;

      // Remove the static HTML question.
      typedQuestion.textContent = "";

      function typeQuestion() {

        // Stop scheduling timers after leaving the page.
        if (window.flowraPageLeaving) return;

        // Pause while the browser tab is hidden.
        if (document.hidden) {
          typingTimer = setTimeout(typeQuestion, 500);
          return;
        }

        const currentQuestion = questions[questionIndex];

        if (isDeleting === false) {

          // Write the question one character at a time.
          characterIndex++;

          typedQuestion.textContent =
            currentQuestion.substring(0, characterIndex);

          if (characterIndex >= currentQuestion.length) {

            // Keep the complete question visible briefly.
            isDeleting = true;

            typingTimer = setTimeout(typeQuestion, 2500);
            return;
          }

          typingTimer = setTimeout(typeQuestion, 45);

        } else {

          // Delete the current question one character at a time.
          characterIndex--;

          typedQuestion.textContent =
            currentQuestion.substring(0, characterIndex);

          if (characterIndex <= 0) {

            // Move to the next question.
            isDeleting = false;

            questionIndex =
              (questionIndex + 1) % questions.length;

            typingTimer = setTimeout(typeQuestion, 350);
            return;
          }

          typingTimer = setTimeout(typeQuestion, 25);
        }
      }

      // Start the animation.
      typingTimer = setTimeout(typeQuestion, 400);

      document.addEventListener("visibilitychange", () => {
        if (!document.hidden && characterIndex === 0) {
          clearTimeout(typingTimer);
          typingTimer = setTimeout(typeQuestion, 300);
        }
      });

      window.addEventListener("pagehide", () => {
        window.flowraPageLeaving = true;
        clearTimeout(typingTimer);
      }, { once: true });
    }


    /* ================================================
       3. SCROLL REVEAL ANIMATIONS
    ================================================ */

    const revealItems = document.querySelectorAll(".reveal");

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
      revealItems.length > 0 &&
      !prefersReducedMotion &&
      "IntersectionObserver" in window
    ) {

      revealItems.forEach((item) => {

        // Add staggered delays to related cards.
        const siblings = Array.from(item.parentElement.children)
          .filter((element) => element.classList.contains("reveal"));

        if (siblings.length > 1) {
          const index = siblings.indexOf(item);

          item.style.transitionDelay =
            `${Math.min(index * 100, 400)}ms`;
        }

        item.classList.add("animate-on-scroll");
      });

      const revealObserver = new IntersectionObserver(
        (entries, observer) => {

          entries.forEach((entry) => {

            if (entry.isIntersecting) {

              entry.target.classList.add("is-visible");

              observer.unobserve(entry.target);
            }

          });

        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -30px 0px"
        }
      );

      revealItems.forEach((item) => {
        revealObserver.observe(item);
      });
    }


    /* ================================================
       4. CINEMATIC HERO IMAGE PARALLAX
    ================================================ */

    const heroSection = document.getElementById("hero-reveal");

    const heroImage = heroSection
      ? heroSection.querySelector(".hero-image")
      : null;

    if (heroSection && heroImage && !prefersReducedMotion) {

      let animationFrame = null;

      function updateHeroImage() {

        const bounds = heroSection.getBoundingClientRect();

        if (
          bounds.bottom > 0 &&
          bounds.top < window.innerHeight
        ) {

          const offset = Math.max(
            -12,
            Math.min(12, -bounds.top * 0.02)
          );

          heroImage.style.transform =
            `translate3d(0, ${offset}px, 0) scale(1.035)`;
        }

        animationFrame = null;
      }

      function requestHeroUpdate() {

        if (animationFrame === null) {
          animationFrame =
            requestAnimationFrame(updateHeroImage);
        }
      }

      window.addEventListener(
        "scroll",
        requestHeroUpdate,
        { passive: true }
      );

      window.addEventListener(
        "resize",
        requestHeroUpdate
      );

      requestHeroUpdate();
    }


    /* ================================================
       5. MEMBERSHIP FORM DEMO MESSAGE
       Does not save data to a database.
    ================================================ */

    const membershipForm =
      document.getElementById("membershipForm");

    const formStatus =
      document.getElementById("formStatus");

    if (membershipForm && formStatus) {

      membershipForm.addEventListener("submit", (event) => {

        event.preventDefault();

        if (!membershipForm.checkValidity()) {
          membershipForm.reportValidity();
          return;
        }

        formStatus.hidden = false;

        formStatus.textContent =
          "Demo only: your membership request has not been saved. Database integration will be added later.";

        formStatus.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "nearest"
        });
      });
    }


    /* ================================================
       6. FOOTER YEAR
    ================================================ */

    document.querySelectorAll("[data-current-year]").forEach((element) => {
      element.textContent = new Date().getFullYear();
    });

  }


  /* ================================================
     START AFTER HTML IS READY
  ================================================ */

  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      initFlowra,
      { once: true }
    );

  } else {

    initFlowra();

  }

})();