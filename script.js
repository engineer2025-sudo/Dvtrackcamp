const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

let scrollFrame = 0;
window.addEventListener('scroll', () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    header?.classList.toggle('scrolled', window.scrollY > 8);
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.min(1, window.scrollY / maxScroll) : 0;
    document.documentElement.style.setProperty('--page-progress', `${progress * 100}%`);
    scrollFrame = 0;
  });
}, { passive: true });

if (menuButton && navLinks) {
  const closeMenu = () => {
    navLinks.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  };
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    navLinks.classList.toggle('open', open);
  });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });
  document.addEventListener('click', event => {
    if (menuButton.getAttribute('aria-expanded') === 'true' &&
        !navLinks.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
}

const items = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: .12, rootMargin: '0px 0px -25px 0px' });
  items.forEach(item => observer.observe(item));
} else {
  items.forEach(item => item.classList.add('visible'));
}

// Optional, quiet UI sound; never starts until a visitor explicitly enables it.
const soundButtons = document.querySelectorAll('.sound-toggle');
let soundEnabled = false;
try { soundEnabled = localStorage.getItem('dv-camp-sound') === 'on'; } catch (_) {}
let audioContext;
function syncSoundButtons() {
  soundButtons.forEach(button => {
    button.setAttribute('aria-pressed', String(soundEnabled));
    button.setAttribute('aria-label', soundEnabled ? 'Turn sound effects off' : 'Turn sound effects on');
    const label = button.querySelector('.sound-label');
    if (label) label.textContent = soundEnabled ? 'Sound on' : 'Sound off';
  });
}
function playUiSound(isPrimary = false) {
  if (!soundEnabled) return;
  try {
    const AudioApi = window.AudioContext || window.webkitAudioContext;
    if (!AudioApi) return;
    audioContext ??= new AudioApi();
    if (audioContext.state === 'suspended') audioContext.resume();
    const now = audioContext.currentTime;
    const tone = (frequency, endFrequency, startAt, duration, volume, type = 'sine') => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, startAt);
      oscillator.frequency.exponentialRampToValueAtTime(endFrequency, startAt + duration * .72);
      gain.gain.setValueAtTime(.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(volume, startAt + .008);
      gain.gain.exponentialRampToValueAtTime(.0001, startAt + duration);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(startAt);
      oscillator.stop(startAt + duration + .01);
    };
    tone(620, 470, now, .085, .018);
    if (isPrimary) tone(790, 640, now + .055, .105, .012, 'sine');
  } catch (_) {
    // Audio is decorative only: continue normally if a device blocks Web Audio.
  }
}
syncSoundButtons();
soundButtons.forEach(button => button.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  try { localStorage.setItem('dv-camp-sound', soundEnabled ? 'on' : 'off'); } catch (_) {}
  syncSoundButtons();
  if (soundEnabled) playUiSound();
}));
document.addEventListener('click', event => {
  const control = event.target.closest('.button, .menu-toggle, .faq-item summary, .article-next');
  if (control) playUiSound(control.classList.contains('button'));
}, true);

// Give readers a quiet sense of progress through longer articles.
const story = document.querySelector('.article-shell article');
const progress = document.querySelector('.reading-progress span');
if (story && progress) {
  let framePending = false;
  const updateProgress = () => {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(() => {
      const start = story.getBoundingClientRect().top + window.scrollY;
      const length = Math.max(1, story.offsetHeight - window.innerHeight);
      const ratio = Math.min(1, Math.max(0, (window.scrollY - start) / length));
      progress.style.width = `${ratio * 100}%`;
      framePending = false;
    });
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
}


// Subtle pointer-led camera shift on the editorial hero image (mouse/trackpad only).
const hero = document.querySelector('.hero');
const heroArt = document.querySelector('.hero-art');
const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (hero && heroArt && motionOK && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  let raf = 0;
  hero.addEventListener('pointermove', event => {
    const bounds = hero.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      heroArt.style.setProperty('--pointer-x', `${x * 7}px`);
      heroArt.style.setProperty('--pointer-y', `${y * 5}px`);
    });
  }, { passive: true });
  hero.addEventListener('pointerleave', () => {
    heroArt.style.setProperty('--pointer-x', '0px');
    heroArt.style.setProperty('--pointer-y', '0px');
  }, { passive: true });
}
