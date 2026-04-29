// --- 1. Mobile Side Nav Logic ---
const openBtn = document.getElementById("open-menu-btn");
const closeBtn = document.getElementById("close-menu-btn");
const sideMenu = document.getElementById("side-menu");
const overlay = document.getElementById("menu-overlay");

function openMenu() {
  overlay.classList.remove("hidden");
  // Small delay to allow display block to apply before changing opacity
  setTimeout(() => {
    overlay.classList.remove("opacity-0");
    sideMenu.classList.remove("translate-x-full");
  }, 10);
  document.body.style.overflow = "hidden"; // Stop background scrolling
}

function closeMenu() {
  sideMenu.classList.add("translate-x-full");
  overlay.classList.add("opacity-0");
  setTimeout(() => {
    overlay.classList.add("hidden");
  }, 300); // Wait for transition to finish
  document.body.style.overflow = "auto"; // Restore scrolling
}

openBtn.addEventListener("click", openMenu);
closeBtn.addEventListener("click", closeMenu);
overlay.addEventListener("click", closeMenu); // Close on clicking outside

// --- 2. Spider Web Canvas Animation inside Nav ---
const canvas = document.getElementById("nav-spider-web");
const ctx = canvas.getContext("2d");
let width, height, particles;

function initNavCanvas() {
  // Match canvas size to the header size
  width = canvas.width = canvas.offsetWidth;
  height = canvas.height = canvas.offsetHeight;
  particles = [];

  // Adjust particle count based on screen width
  const particleCount = window.innerWidth < 768 ? 30 : 60;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 1.5 + 0.5,
    });
  }
}

function animateNavCanvas() {
  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;

    // Bounce off edges of the navbar
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;

    // Draw Particle (Red)
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 31, 75, 0.7)";
    ctx.fill();

    // Connect particles to create the web effect
    for (let j = i + 1; j < particles.length; j++) {
      let p2 = particles[j];
      let dist = Math.hypot(p.x - p2.x, p.y - p2.y);

      // Connection distance
      if (dist < 80) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(255, 31, 75, ${0.3 - dist / 260})`; // Fading red lines
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateNavCanvas);
}

// Initialize and handle resize
window.addEventListener("resize", initNavCanvas);
// Add a small timeout on load to ensure fonts/layout are rendered before getting dimensions
window.addEventListener("load", () => {
  initNavCanvas();
  animateNavCanvas();
});



// --- 3. Booking Modal Open / Close ---
function openModal(serviceName = '') {
  const modal = document.getElementById('booking-modal');
  if (!modal) return;

  const nameEl = document.getElementById('selected-service-name');
  const inputEl = document.getElementById('service-input');
  if (nameEl) nameEl.textContent = serviceName;
  if (inputEl) inputEl.value = serviceName;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('booking-modal');
  if (!modal) return;

  modal.classList.remove('flex');
  modal.classList.add('hidden');
  document.body.style.overflow = 'auto';
}

// Hook header / side / hero Book buttons (if present)
document.addEventListener('DOMContentLoaded', () => {
  const headerBtn = document.getElementById('header-book-btn');
  const sideBtn = document.getElementById('side-book-btn');
  const heroBtn = document.getElementById('hero-book-btn');

  if (headerBtn) headerBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(''); });
  if (sideBtn) sideBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(''); });
  if (heroBtn) heroBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(''); });

  // Close modal on Escape key
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') closeModal();
  });

  // WhatsApp form submit handler
  const waForm = document.getElementById('whatsapp-form');
  if (waForm) {
    waForm.addEventListener('submit', (ev) => {
      ev.preventDefault();

      const service = document.getElementById('service-input')?.value || '';
      const name = document.getElementById('user-name')?.value || '';
      const phone = document.getElementById('phone-number')?.value || '';
      const location = document.getElementById('location')?.value || '';
      const brahmin = document.getElementById('brahmin-pref')?.value || '';
      const rituals = document.getElementById('rituals')?.value || '';
      const date = document.getElementById('ritual-date')?.value || '';

      // Basic validation
      if (!name || !phone || !location || !date) {
        alert('Please fill Name, Phone, Location and Date.');
        return;
      }

const rawMessage = `*New Booking Request | Spider Rituals*

*👤 Customer Details*
*Name:* ${name}
*Phone:* ${phone}
*Location:* ${location}

*🕉️ Booking Details*
*Service:* ${service}
*Rituals:* ${rituals}
*Brahmin Preference:* ${brahmin}
*Selected Date:* ${date}

Please confirm the booking.`;
      // Replace with your WhatsApp number (country code, no +). Using footer number by default.
      const waNumber = '919348148310';
      const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(rawMessage)}`;

      // Open WhatsApp (web or app)
      window.open(url, '_blank');
      closeModal();

      // Reset form fields and displayed service name after sending
      waForm.reset();
      const selectedNameEl = document.getElementById('selected-service-name');
      if (selectedNameEl) selectedNameEl.textContent = '';
      const serviceInputEl = document.getElementById('service-input');
      if (serviceInputEl) serviceInputEl.value = '';
    });
  }
});



