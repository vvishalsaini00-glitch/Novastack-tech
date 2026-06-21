const body = document.body;
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const loader = document.querySelector('.loader');
const cursorGlow = document.querySelector('.cursor-glow');
const dropdown = document.querySelector('.dropdown');
const dropdownToggle = document.querySelector('.dropdown-toggle');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');
const revealItems = document.querySelectorAll('.reveal');
const appointmentForm = document.querySelector('#appointmentForm');
const formStatus = document.querySelector('.form-status');

function applyTheme(theme) {
  const isLight = theme === 'light';
  body.classList.toggle('light-theme', isLight);
  themeIcon.textContent = isLight ? '🌙' : '☀';
}

const storedTheme = localStorage.getItem('novastuck-theme');
applyTheme(storedTheme || 'dark');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = body.classList.contains('light-theme') ? 'dark' : 'light';
    applyTheme(nextTheme);
    localStorage.setItem('novastuck-theme', nextTheme);
  });
}

window.addEventListener('load', () => {
  setTimeout(() => loader.classList.add('hidden'), 900);
});

window.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = `${e.clientX}px`;
  cursorGlow.style.top = `${e.clientY}px`;
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => observer.observe(item));

if (dropdown && dropdownToggle) {
  dropdownToggle.addEventListener('click', (e) => {
    e.preventDefault();
    dropdown.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  });
}

if (mobileMenuToggle && navLinks) {
  mobileMenuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
    });
  });
}

if (appointmentForm && formStatus) {
  appointmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitButton = appointmentForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    formStatus.textContent = 'Sending your appointment request...';
    formStatus.className = 'form-status';

    try {
      const formData = new FormData(appointmentForm);
      const response = await fetch(appointmentForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        formStatus.textContent = 'Your appointment request has been submitted.';
        formStatus.className = 'form-status success';
        appointmentForm.reset();
      } else {
        formStatus.textContent = 'Something went wrong. Please try again later.';
        formStatus.className = 'form-status error';
      }
    } catch (error) {
      formStatus.textContent = 'Something went wrong. Please try again later.';
      formStatus.className = 'form-status error';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
}

const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles() {
  particles = [];
  const count = Math.min(70, Math.floor(window.innerWidth / 18));
  for (let i = 0; i < count; i += 1) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.2 + 0.8,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.6 + 0.2,
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(drawParticles);
}

window.addEventListener('resize', () => {
  resizeCanvas();
  createParticles();
});

resizeCanvas();
createParticles();
drawParticles();

const threeCanvas = document.getElementById('three-scene');
let renderer;
let scene;
let camera;
let group;
let isThreeReady = false;

function initThreeScene() {
  if (!threeCanvas || typeof THREE === 'undefined') return;

  renderer = new THREE.WebGLRenderer({
    canvas: threeCanvas,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 9);

  group = new THREE.Group();
  scene.add(group);

  const geometry = new THREE.IcosahedronGeometry(1.8, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 0x2a6df4,
    emissive: 0x102a69,
    metalness: 0.6,
    roughness: 0.2,
    transparent: true,
    opacity: 0.78,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = 0.5;
  group.add(mesh);

  const ringGeometry = new THREE.TorusGeometry(2.7, 0.06, 16, 100);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xff7a1a,
    transparent: true,
    opacity: 0.2,
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI / 2.2;
  group.add(ring);

  const pointLight = new THREE.PointLight(0x84a9ff, 2.5, 18);
  pointLight.position.set(0, 0, 6);
  scene.add(pointLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
  scene.add(ambientLight);

  isThreeReady = true;
  resizeThreeScene();
}

function resizeThreeScene() {
  if (!renderer || !camera) return;
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  threeCanvas.style.width = `${width}px`;
  threeCanvas.style.height = `${height}px`;
}

function animateThreeScene() {
  if (!isThreeReady || !group) return;
  group.rotation.y += 0.002;
  group.rotation.x += 0.001;
  renderer.render(scene, camera);
  requestAnimationFrame(animateThreeScene);
}

window.addEventListener('resize', () => {
  resizeCanvas();
  createParticles();
  if (renderer) resizeThreeScene();
});

initThreeScene();
if (isThreeReady) animateThreeScene();
