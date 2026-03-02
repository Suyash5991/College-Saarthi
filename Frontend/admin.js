/* =============================================
   COLLEGESARTHI — admin.js
   Handles: Stats, Chart, User Table, Search
   ============================================= */

'use strict';

/* ── Fake Data ─────────────────────────────── */
const FAKE_USERS = [
  { name: 'Arjun Mehta',       email: 'arjun.mehta@gmail.com',   rank: 4218,   category: 'GEN',   plan: 'Pro',     joined: '14 Jun 2024', revenue: '₹99' },
  { name: 'Priya Sharma',      email: 'priya.s@yahoo.com',        rank: 12480,  category: 'OBC',   plan: 'Premium', joined: '13 Jun 2024', revenue: '₹249' },
  { name: 'Rohit Verma',       email: 'rohit.v2024@gmail.com',    rank: 7950,   category: 'GEN',   plan: 'Pro',     joined: '12 Jun 2024', revenue: '₹99' },
  { name: 'Sneha Patel',       email: 'sneha.patel@outlook.com',  rank: 22100,  category: 'EWS',   plan: 'Free',    joined: '11 Jun 2024', revenue: '₹0' },
  { name: 'Kiran Reddy',       email: 'kiran.r@gmail.com',        rank: 3400,   category: 'GEN',   plan: 'Premium', joined: '10 Jun 2024', revenue: '₹249' },
  { name: 'Ananya Singh',      email: 'ananya.s@proton.me',       rank: 18700,  category: 'SC',    plan: 'Pro',     joined: '09 Jun 2024', revenue: '₹99' },
  { name: 'Dev Agarwal',       email: 'dev.ag@gmail.com',         rank: 9200,   category: 'GEN',   plan: 'Pro',     joined: '08 Jun 2024', revenue: '₹99' },
  { name: 'Meera Joshi',       email: 'meera.j@gmail.com',        rank: 31000,  category: 'ST',    plan: 'Free',    joined: '07 Jun 2024', revenue: '₹0' },
  { name: 'Vivek Nair',        email: 'vivek.nair@icloud.com',    rank: 5700,   category: 'GEN',   plan: 'Pro',     joined: '06 Jun 2024', revenue: '₹99' },
  { name: 'Pooja Chauhan',     email: 'pooja.c@gmail.com',        rank: 14200,  category: 'OBC',   plan: 'Free',    joined: '05 Jun 2024', revenue: '₹0' },
  { name: 'Siddharth Rao',     email: 'sid.rao@gmail.com',        rank: 2100,   category: 'GEN',   plan: 'Premium', joined: '04 Jun 2024', revenue: '₹249' },
  { name: 'Lakshmi Iyer',      email: 'lakshmi.i@yahoo.com',      rank: 8900,   category: 'GEN',   plan: 'Pro',     joined: '03 Jun 2024', revenue: '₹99' },
  { name: 'Rahul Gupta',       email: 'rahul.g99@gmail.com',      rank: 19800,  category: 'EWS',   plan: 'Free',    joined: '02 Jun 2024', revenue: '₹0' },
  { name: 'Tanya Malhotra',    email: 'tanya.m@gmail.com',        rank: 6500,   category: 'GEN',   plan: 'Pro',     joined: '01 Jun 2024', revenue: '₹99' },
  { name: 'Nikhil Bansal',     email: 'nikhil.b@outlook.com',     rank: 11400,  category: 'OBC',   plan: 'Pro',     joined: '31 May 2024', revenue: '₹99' },
  { name: 'Aisha Khan',        email: 'aisha.khan@gmail.com',     rank: 4900,   category: 'GEN',   plan: 'Premium', joined: '30 May 2024', revenue: '₹249' },
  { name: 'Harshit Jain',      email: 'harshit.j@gmail.com',      rank: 25400,  category: 'SC',    plan: 'Free',    joined: '29 May 2024', revenue: '₹0' },
  { name: 'Swati Kulkarni',    email: 'swati.k@gmail.com',        rank: 16200,  category: 'OBC',   plan: 'Pro',     joined: '28 May 2024', revenue: '₹99' },
  { name: 'Manish Tripathi',   email: 'manish.t@proton.me',       rank: 3800,   category: 'GEN',   plan: 'Pro',     joined: '27 May 2024', revenue: '₹99' },
  { name: 'Divya Pandey',      email: 'divya.p@gmail.com',        rank: 42000,  category: 'ST',    plan: 'Free',    joined: '26 May 2024', revenue: '₹0' },
];

const MONTHLY_DATA = [
  { month: 'Jan', users: 620 },
  { month: 'Feb', users: 890 },
  { month: 'Mar', users: 1240 },
  { month: 'Apr', users: 1800 },
  { month: 'May', users: 2600 },
  { month: 'Jun', users: 3697 },
];

/* ── Count-Up Animation ─────────────────────── */
function countUp(el, target, duration = 1800, prefix = '', suffix = '') {
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = prefix + current.toLocaleString('en-IN') + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ── Inject Stats ───────────────────────────── */
function injectStats() {
  const totalUsers = 12847;
  const paidUsers = 3241;
  const convRate = ((paidUsers / totalUsers) * 100).toFixed(1);
  const revenue = paidUsers * 99 + 320 * 249; // rough mix

  const elTotal = document.getElementById('statTotalUsers');
  const elPaid = document.getElementById('statPaidUsers');
  const elConv = document.getElementById('statConversion');
  const elRev = document.getElementById('statRevenue');

  if (elTotal) countUp(elTotal, totalUsers);
  if (elPaid) countUp(elPaid, paidUsers);
  if (elConv) {
    setTimeout(() => { elConv.textContent = convRate + '%'; }, 1800);
  }
  if (elRev) {
    setTimeout(() => {
      countUp(elRev, revenue, 1800, '₹');
    }, 200);
  }
}

/* ── Bar Chart ──────────────────────────────── */
function buildChart() {
  const container = document.getElementById('chartBars');
  if (!container) return;

  const maxUsers = Math.max(...MONTHLY_DATA.map(d => d.users));

  MONTHLY_DATA.forEach((data, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'chart-bar-wrap';

    const bar = document.createElement('div');
    bar.className = 'chart-bar';
    bar.style.height = '0';
    bar.title = `${data.month}: ${data.users.toLocaleString('en-IN')} signups`;

    // Value label above bar
    const valLabel = document.createElement('div');
    valLabel.className = 'chart-label';
    valLabel.textContent = data.users >= 1000 ? (data.users / 1000).toFixed(1) + 'k' : data.users;
    valLabel.style.color = 'var(--slate-700)';
    valLabel.style.fontWeight = '700';
    valLabel.style.fontSize = '11px';
    valLabel.style.fontFamily = 'var(--font-display)';
    valLabel.style.marginBottom = '4px';

    const label = document.createElement('div');
    label.className = 'chart-label';
    label.textContent = data.month;

    wrap.appendChild(valLabel);
    wrap.appendChild(bar);
    wrap.appendChild(label);
    container.appendChild(wrap);

    // Animate bar height
    setTimeout(() => {
      const pct = (data.users / maxUsers) * 160;
      bar.style.height = pct + 'px';
      bar.style.minHeight = '8px';
    }, 100 + i * 100);
  });
}

/* ── Revenue Breakdown ──────────────────────── */
function buildRevenueBreakdown() {
  const container = document.getElementById('revenueBreakdown');
  if (!container) return;

  const items = [
    { label: 'Pro Plan (₹99)', amount: '₹2,10,474', pct: 70, color: 'var(--blue-500)' },
    { label: 'Premium Plan (₹249)', amount: '₹79,680', pct: 26, color: '#7c3aed' },
    { label: 'Coupons / Discount', amount: '-₹8,200', pct: 4, color: 'var(--red-500)' },
  ];

  items.forEach(item => {
    const row = document.createElement('div');
    row.style.cssText = 'margin-bottom: 18px;';
    row.innerHTML = `
      <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px;">
        <span style="color: var(--slate-600); font-weight: 500;">${item.label}</span>
        <span style="font-family: var(--font-display); font-weight: 700; color: var(--slate-900);">${item.amount}</span>
      </div>
      <div style="height: 6px; background: var(--slate-100); border-radius: 100px; overflow: hidden;">
        <div style="height: 100%; width: 0; background: ${item.color}; border-radius: 100px; transition: width 1s cubic-bezier(.4,0,.2,1);"></div>
      </div>
    `;
    container.appendChild(row);
    setTimeout(() => {
      row.querySelector('div > div').style.width = item.pct + '%';
    }, 300);
  });

  const total = document.createElement('div');
  total.style.cssText = 'border-top: 1px solid var(--slate-200); padding-top: 16px; margin-top: 8px; display: flex; justify-content: space-between;';
  total.innerHTML = `
    <span style="font-family: var(--font-display); font-weight: 700; color: var(--slate-900);">Net Revenue</span>
    <span style="font-family: var(--font-display); font-size: 20px; font-weight: 800; color: var(--blue-600);">₹2,81,954</span>
  `;
  container.appendChild(total);
}

/* ── User Table ─────────────────────────────── */
let allUsers = [...FAKE_USERS];

function renderTable(users) {
  const tbody = document.getElementById('usersTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--slate-400); padding: 32px;">No users found.</td></tr>';
    return;
  }

  users.forEach(u => {
    const tr = document.createElement('tr');
    const badgeClass = u.plan === 'Free' ? 'badge-free' : 'badge-paid';
    tr.innerHTML = `
      <td style="font-weight: 600; color: var(--slate-900);">${u.name}</td>
      <td>${u.email}</td>
      <td style="font-family: var(--font-display); font-weight: 700;">${u.rank.toLocaleString('en-IN')}</td>
      <td>${u.category}</td>
      <td><span class="${badgeClass}">${u.plan}</span></td>
      <td>${u.joined}</td>
      <td style="font-family: var(--font-display); font-weight: 700; color: ${u.revenue !== '₹0' ? 'var(--green-500)' : 'var(--slate-400)'};">${u.revenue}</td>
    `;
    tbody.appendChild(tr);
  });
}

function initTableSearch() {
  const search = document.getElementById('userSearch');
  if (!search) return;

  search.addEventListener('input', () => {
    const q = search.value.toLowerCase().trim();
    if (!q) {
      renderTable(allUsers);
      return;
    }
    const filtered = allUsers.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.category.toLowerCase().includes(q) ||
      u.plan.toLowerCase().includes(q)
    );
    renderTable(filtered);
  });
}

/* ── Sidebar Nav Active State ──────────────── */
function initSidebarNav() {
  const navItems = document.querySelectorAll('.admin-nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

/* ══════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  injectStats();
  buildChart();
  buildRevenueBreakdown();
  renderTable(allUsers);
  initTableSearch();
  initSidebarNav();
});
