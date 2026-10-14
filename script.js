/* ===== Particle Background ===== */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null, radius: 120 };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = Math.random() * 30 + 1;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#7c5cfc';
    ctx.globalAlpha = 0.5;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

    // Mouse interaction
    if (mouse.x != null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        this.x -= Math.cos(angle) * force * 2;
        this.y -= Math.sin(angle) * force * 2;
      }
    }
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}
initParticles();
window.addEventListener('resize', initParticles);

function connectParticles() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#7c5cfc';
        ctx.globalAlpha = 0.15 * (1 - dist / 120);
        ctx.lineWidth = 0.8;
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  connectParticles();
  requestAnimationFrame(animateParticles);
}
animateParticles();

window.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

window.addEventListener('mouseout', () => {
  mouse.x = null;
  mouse.y = null;
});

/* ===== Cursor Glow ===== */
const cursorGlow = document.querySelector('.cursor-glow');
document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});

/* ===== Theme Toggle ===== */
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
  html.setAttribute('data-theme', 'light');
}

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  if (current === 'light') {
    html.removeAttribute('data-theme');
    localStorage.setItem('theme', 'dark');
  } else {
    html.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
});

/* ===== Navbar Scroll ===== */
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  if (window.scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }

  // Active nav link
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== Mobile Menu ===== */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

/* ===== Typewriter Effect ===== */
function typeWriter(element, text, speed = 80, callback) {
  let i = 0;
  element.textContent = '';
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else if (callback) {
      callback();
    }
  }
  type();
}

const roles = [
  'MERN Stack Developer',
  'Java Backend Engineer',
  'Full-Stack Creator',
  'Git & GitHub Expert'
];

let roleIndex = 0;
const roleEl = document.getElementById('typed-role');
const nameEl = document.getElementById('typed-name');

typeWriter(nameEl, 'Test', 100, () => {
  typeRole();
});

function typeRole() {
  const role = roles[roleIndex];
  let i = 0;
  roleEl.textContent = '';
  function type() {
    if (i < role.length) {
      roleEl.textContent += role.charAt(i);
      i++;
      setTimeout(type, 60);
    } else {
      setTimeout(eraseRole, 2200);
    }
  }
  type();
}

function eraseRole() {
  const current = roleEl.textContent;
  if (current.length > 0) {
    roleEl.textContent = current.slice(0, -1);
    setTimeout(eraseRole, 30);
  } else {
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(typeRole, 300);
  }
}

/* ===== Counter Animation ===== */
function animateCounters() {
  const counters = document.querySelectorAll('[data-target]');
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const update = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(update);
      } else {
        counter.textContent = target;
      }
    };
    update();
  });
}

/* ===== Skill Bars Animation ===== */
function animateSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  fills.forEach(fill => {
    const width = fill.getAttribute('data-width');
    fill.style.width = width + '%';
  });
}

/* ===== Intersection Observer ===== */
const observerOptions = {
  threshold: 0.2,
  rootMargin: '0px 0px -50px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (entry.target.id === 'skills') {
        animateSkillBars();
      }
      if (entry.target.id === 'home' || entry.target.id === 'github') {
        // Counters already handled separately
      }
      entry.target.classList.add('in-view');
    }
  });
}, observerOptions);

document.querySelectorAll('section').forEach(sec => {
  sectionObserver.observe(sec);
});

// Trigger counters once when hero or github enters
let countersTriggered = false;
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersTriggered) {
      animateCounters();
      countersTriggered = true;
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.hero-stats, .github-stats').forEach(el => {
  counterObserver.observe(el);
});

/* ===== Skill Cloud Interaction ===== */
const skillDetails = {
  'React': 'Expert in React 18+ with hooks, context, and performance optimization. Built multiple production SPAs and component libraries.',
  'Node.js': 'Strong Node.js experience building scalable REST APIs, real-time services with Socket.io, and microservices.',
  'MongoDB': 'Proficient with MongoDB & Mongoose — schema design, aggregation pipelines, indexing, and Atlas deployment.',
  'Express': 'Built numerous Express.js backends with middleware, authentication (JWT), validation, and clean architecture.',
  'Java': 'Solid Java foundation with OOP, collections, concurrency, and enterprise patterns. 3+ years professional experience.',
  'Spring Boot': 'Developed REST microservices with Spring Boot, Spring Security, JPA, and Spring Cloud components.',
  'Git': 'Daily Git user with advanced branching strategies, rebasing, interactive rebase, and conflict resolution.',
  'GitHub': 'Active on GitHub — clean commit history, PRs, Actions for CI/CD, and open-source contributions.',
  'TypeScript': 'Write type-safe React and Node code. Prefer TypeScript for all medium-to-large projects.',
  'Redux': 'Experienced with Redux Toolkit and RTK Query for predictable state management in complex apps.',
  'Tailwind': 'Rapid UI development with Tailwind CSS. Custom design systems and responsive utility-first styling.',
  'Docker': 'Containerize apps with Docker & Docker Compose. Multi-stage builds and production-ready images.',
  'JWT': 'Secure authentication flows using JWT, refresh tokens, and role-based access control.',
  'REST API': 'Design and implement well-documented, versioned REST APIs following best practices.',
  'GraphQL': 'Built GraphQL APIs with Apollo Server and client-side integration with Apollo Client.',
  'Jest': 'Unit & integration testing with Jest, React Testing Library, and Supertest for APIs.',
  'AWS': 'Deployed apps on AWS (EC2, S3, Lambda, RDS). Familiar with basic infrastructure setup.',
  'CI/CD': 'Set up GitHub Actions pipelines for testing, building, and deploying to staging/production.'
};

const cloudTags = document.querySelectorAll('.cloud-tag');
const skillDetailEl = document.getElementById('skill-detail');

cloudTags.forEach(tag => {
  tag.addEventListener('click', () => {
    cloudTags.forEach(t => t.classList.remove('active'));
    tag.classList.add('active');
    const skill = tag.getAttribute('data-skill');
    skillDetailEl.innerHTML = `<strong>${skill}</strong> — ${skillDetails[skill] || 'Experienced with this technology.'}`;
  });
});

/* ===== Project Filter ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      const categories = card.getAttribute('data-category');
      if (filter === 'all' || categories.includes(filter)) {
        card.classList.remove('hidden');
        card.style.display = '';
      } else {
        card.classList.add('hidden');
        setTimeout(() => {
          if (card.classList.contains('hidden')) {
            card.style.display = 'none';
          }
        }, 300);
      }
    });
  });
});

/* ===== Contribution Graph ===== */
function generateContribGraph() {
  const grid = document.getElementById('contrib-grid');
  if (!grid) return;
  grid.innerHTML = '';
  // Simulate ~1 year of contributions (53 weeks * 7 days)
  const days = 53 * 7;
  for (let i = 0; i < days; i++) {
    const day = document.createElement('div');
    day.className = 'contrib-day';
    const rand = Math.random();
    let level = 0;
    if (rand > 0.7) level = 1;
    if (rand > 0.85) level = 2;
    if (rand > 0.93) level = 3;
    if (rand > 0.97) level = 4;
    if (level > 0) day.classList.add(`level-${level}`);
    day.title = `${level === 0 ? 'No' : level * 3 + Math.floor(Math.random() * 3)} contributions`;
    grid.appendChild(day);
  }
}
generateContribGraph();

/* ===== Contact Form ===== */
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !subject || !message) {
    formStatus.textContent = 'Please fill in all fields.';
    formStatus.className = 'form-status error';
    return;
  }

  // Simulate sending
  formStatus.textContent = 'Sending...';
  formStatus.className = 'form-status';
  
  setTimeout(() => {
    formStatus.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
    formStatus.className = 'form-status success';
    contactForm.reset();
    setTimeout(() => {
      formStatus.textContent = '';
    }, 4000);
  }, 1200);
});

/* ===== Simple Tilt Effect ===== */
document.querySelectorAll('[data-tilt]').forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  });

  el.addEventListener('mouseleave', () => {
    el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
  });
});

/* ===== Smooth reveal on load ===== */
document.body.style.opacity = '0';
window.addEventListener('load', () => {
  document.body.style.transition = 'opacity 0.5s';
  document.body.style.opacity = '1';
});
