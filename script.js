(() => {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.primary-nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open navigation');
      });
    });
  }

  const filterButtons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((btn) => btn.classList.toggle('active', btn === button));

      cards.forEach((card) => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.hidden = !show;
      });
    });
  });

  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', (event) => {
      event.preventDefault();
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      if (history.replaceState) history.replaceState(null, '', '#top');
    });
  }

  const achievementSlider = document.querySelector('[data-achievement-slider]');
  if (achievementSlider) {
    const slides = [...achievementSlider.querySelectorAll('.achievement-slide')];
    const dots = [...achievementSlider.querySelectorAll('.achievement-dot')];
    const prevButton = achievementSlider.querySelector('.achievement-prev');
    const nextButton = achievementSlider.querySelector('.achievement-next');
    const sliderStage = achievementSlider.querySelector('.achievement-stage');
    const sliderReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let currentSlide = 0;
    let autoplayTimer = null;
    let touchStartX = null;

    const showSlide = (index) => {
      currentSlide = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === currentSlide;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
      });
      dots.forEach((dot, dotIndex) => {
        const active = dotIndex === currentSlide;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-current', active ? 'true' : 'false');
      });
    };

    const stopAutoplay = () => {
      if (autoplayTimer) window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    };

    const startAutoplay = () => {
      stopAutoplay();
      if (!sliderReduceMotion && slides.length > 1) {
        autoplayTimer = window.setInterval(() => showSlide(currentSlide + 1), 6500);
      }
    };

    prevButton?.addEventListener('click', () => {
      showSlide(currentSlide - 1);
      startAutoplay();
    });
    nextButton?.addEventListener('click', () => {
      showSlide(currentSlide + 1);
      startAutoplay();
    });
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        showSlide(Number(dot.dataset.slideTo));
        startAutoplay();
      });
    });

    achievementSlider.addEventListener('mouseenter', stopAutoplay);
    achievementSlider.addEventListener('mouseleave', startAutoplay);
    achievementSlider.addEventListener('focusin', stopAutoplay);
    achievementSlider.addEventListener('focusout', (event) => {
      if (!achievementSlider.contains(event.relatedTarget)) startAutoplay();
    });

    sliderStage?.addEventListener('touchstart', (event) => {
      touchStartX = event.changedTouches[0]?.clientX ?? null;
    }, { passive: true });
    sliderStage?.addEventListener('touchend', (event) => {
      if (touchStartX === null) return;
      const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
      const distance = touchEndX - touchStartX;
      touchStartX = null;
      if (Math.abs(distance) < 45) return;
      showSlide(currentSlide + (distance < 0 ? 1 : -1));
      startAutoplay();
    }, { passive: true });

    achievementSlider.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        showSlide(currentSlide - 1);
        startAutoplay();
      } else if (event.key === 'ArrowRight') {
        showSlide(currentSlide + 1);
        startAutoplay();
      }
    });

    showSlide(0);
    startAutoplay();
  }

  const revealItems = document.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => observer.observe(item));
  }


  const customCursor = document.querySelector('.custom-cursor');

  if (customCursor && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (event) => {
      customCursor.style.left = `${event.clientX}px`;
      customCursor.style.top = `${event.clientY}px`;
    });

    const interactiveElements = document.querySelectorAll(
      'a, button, input, select, textarea, .project-card'
    );

    interactiveElements.forEach((element) => {
      element.addEventListener('mouseenter', () => {
        customCursor.classList.add('is-hovering');
      });

      element.addEventListener('mouseleave', () => {
        customCursor.classList.remove('is-hovering');
      });
    });
  }
})();
