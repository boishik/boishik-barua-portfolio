const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const currentYear = document.getElementById('currentYear');

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);
revealItems.forEach((item) => revealObserver.observe(item));

const typingText = document.getElementById('typingText');
const typedLines = [
  'training models with purpose...',
  'building AI for real-world impact...',
  'bridging research and deployment...'
];
let lineIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  if (!typingText) return;
  const currentLine = typedLines[lineIndex];

  if (!deleting) {
    charIndex += 1;
    typingText.textContent = currentLine.slice(0, charIndex);
    if (charIndex === currentLine.length) {
      deleting = true;
      setTimeout(typeLoop, 1350);
      return;
    }
  } else {
    charIndex -= 1;
    typingText.textContent = currentLine.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      lineIndex = (lineIndex + 1) % typedLines.length;
    }
  }

  setTimeout(typeLoop, deleting ? 44 : 74);
}
typeLoop();

const slides = Array.from(document.querySelectorAll('.gallery-slide'));
const dotsWrap = document.getElementById('galleryDots');
const prevButton = document.getElementById('prevSlide');
const nextButton = document.getElementById('nextSlide');
const galleryTrack = document.getElementById('galleryTrack');
let activeSlide = 0;
let autoplayTimer;
let touchStartX = 0;

function renderDots() {
  if (!dotsWrap) return;
  dotsWrap.innerHTML = '';
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = `gallery-dot${index === activeSlide ? ' active' : ''}`;
    dot.type = 'button';
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    dot.addEventListener('click', () => setSlide(index, true));
    dotsWrap.appendChild(dot);
  });
}

function setSlide(index, resetAutoplay = false) {
  if (!slides.length) return;
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle('active', slideIndex === activeSlide);
  });
  renderDots();
  if (resetAutoplay) startAutoplay();
}

function startAutoplay() {
  clearInterval(autoplayTimer);
  autoplayTimer = setInterval(() => setSlide(activeSlide + 1), 5000);
}

if (prevButton) {
  prevButton.addEventListener('click', () => setSlide(activeSlide - 1, true));
}

if (nextButton) {
  nextButton.addEventListener('click', () => setSlide(activeSlide + 1, true));
}

if (galleryTrack) {
  galleryTrack.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].screenX;
  }, { passive: true });

  galleryTrack.addEventListener('touchend', (event) => {
    const touchEndX = event.changedTouches[0].screenX;
    const distance = touchEndX - touchStartX;
    if (Math.abs(distance) > 52) {
      setSlide(distance > 0 ? activeSlide - 1 : activeSlide + 1, true);
    }
  }, { passive: true });



  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const observerOptions = {
    root: null,
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute("id");

        navLinks.forEach((link) => {
          link.classList.remove("active");

          if (link.getAttribute("href") === `#${currentId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

}

setSlide(0);
startAutoplay();

