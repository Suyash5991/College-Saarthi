/* =============================================
   COLLEGESARTHI — script.js
   Handles: Navbar, Scroll animations,
   Predictor logic, Login logic, Contact form
   ============================================== */

'use strict';

/* ── Utility ──────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ══════════════════════════════════════════════
   NAVBAR — scroll & hamburger
══════════════════════════════════════════════ */
function initNavbar() {
  const navbar = $('#navbar');
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobileMenu');

  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });

    $$('a', mobileMenu).forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }
}

/* ══════════════════════════════════════════════
   SCROLL REVEAL ANIMATIONS
══════════════════════════════════════════════ */
function initScrollReveal() {
  const reveals = $$('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════
   SMOOTH SCROLL
══════════════════════════════════════════════ */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = $(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ══════════════════════════════════════════════
   BUILD CARD
══════════════════════════════════════════════ */
function buildCollegeCard(college) {
  const tier = college.prediction?.toLowerCase() || 'target';
  const tagClass = `tag-${tier}`;
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);

  const card = document.createElement('div');
  card.className = "result-college-card";
  card.innerHTML = `
    <span class="tag ${tagClass}">${tierLabel}</span>
    <div class="result-college-name">${college.institute}</div>
    <div class="result-college-branch">${college.program}</div>
    <div class="result-rank-info">
      <span class="result-rank-label">Closing Rank</span>
      <span class="result-rank-value">${college.closingRank?.toLocaleString('en-IN')}</span>
    </div>
  `;
  return card;
}

/* ══════════════════════════════════════════════
   PREDICTOR FORM
══════════════════════════════════════════════ */
function initPredictor() {
  const form = $('#predictorForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const rank = parseInt($('#rank').value);
    const quota = $('#quota').value;
    const seatType = $('#seatType').value;
    const gender = $('#gender').value;
    const round = parseInt($('#round').value);
    const year = parseInt($('#year').value);

    if (!rank || !quota || !seatType || !gender || !round || !year) {
      alert("Please fill all fields correctly.");
      return;
    }

    runPrediction({ rank, quota, seatType, gender, round, year });
  });
}

/* ══════════════════════════════════════════════
   BACKEND CONNECTED PREDICTION
══════════════════════════════════════════════ */
async function runPrediction(filters) {
  const btn = $('#predictBtn');
  const resultsSection = $('#resultsSection');
  const resultsGrid = $('#resultsGrid');
  const resultsSummary = $('#resultsSummary');

  btn.textContent = '⏳ Fetching real data...';
  btn.disabled = true;

  try {

    const response = await fetch("http://localhost:5000/api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(filters)
    });

    const data = await response.json();

    resultsGrid.innerHTML = '';

    if (!data.length) {
      resultsGrid.innerHTML = "<p>No colleges found for selected filters.</p>";
    } else {
      data.slice(0, 6).forEach(college => {
        resultsGrid.appendChild(buildCollegeCard(college));
      });
    }

    resultsSummary.textContent =
      `Showing results for Rank ${filters.rank.toLocaleString('en-IN')} 
       | ${filters.seatType} | ${filters.quota} | Round ${filters.round}`;

    resultsSection.classList.add('visible');
    resultsSection.scrollIntoView({ behavior: 'smooth' });

  } catch (error) {
    resultsGrid.innerHTML = "<p>Server error. Check backend.</p>";
    console.error(error);
  }

  btn.textContent = '🔍 Predict My Colleges';
  btn.disabled = false;
}
/* ── LOGIN ───────────────────── */
function initLogin() {
  const form = $('#loginForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    alert("Login system ready for backend integration.");
  });
}

/* ── CONTACT ─────────────────── */
function initContact() {
  const form = $('#contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    alert("Contact form ready for backend integration.");
  });
}

/* ── PRICING ─────────────────── */
function initPricing() {
  const buyBtn = $('#buyProBtn');
  if (!buyBtn) return;

  buyBtn.addEventListener('click', e => {
    e.preventDefault();
    alert("Payment gateway integration required.");
  });
}

/* ══════════════════════════════════════════════
   INIT
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initSmoothScroll();
  initPredictor();
  initLogin();
  initContact();
  initPricing();
});