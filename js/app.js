/* ==========================================================================
   KRISH RUPAREL PORTFOLIO — MAIN APPLICATION CONTROLLER
   ========================================================================== */

import { RESUME_DATA } from './resume-data.js';
import { audioVis } from './audio-visualizer.js';
import { assistantEngine } from './assistant.js';
import { initInteractiveDemos } from './demos.js';
import { initTechnicalChallenge, challengeEngine } from './challenge.js';
import { techGalaxy, TECH_GALAXY_DATA } from './tech-galaxy.js';
import { TerminalEngine } from './terminal.js';

let terminalEngine = null;

function boot() {
  try { initPreloader(); } catch (e) { console.error('Preloader error:', e); }
  try { initThemeSwitcher(); } catch (e) { console.error('Theme switcher error:', e); }
  try { initModeSwitcher(); } catch (e) { console.error('Mode switcher error:', e); }
  try { initCustomCursor(); } catch (e) { console.error('Cursor error:', e); }
  try { initHoverShuffle(); } catch (e) { console.error('Hover shuffle error:', e); }
  try { initScrollObserver(); } catch (e) { console.error('Scroll observer error:', e); }
  try { initInteractiveDemos(); } catch (e) { console.error('Demos error:', e); }
  try { initTechnicalChallenge(); } catch (e) { console.error('Challenge error:', e); }
  try { initTechGalaxy(); } catch (e) { console.error('Tech Galaxy error:', e); }
  try { initResumeModal(); } catch (e) { console.error('Resume modal error:', e); }
  try { initTimeDisplay(); } catch (e) { console.error('Time display error:', e); }
  try { initEmailTriggers(); } catch (e) { console.error('Email triggers error:', e); }
  try { terminalEngine = new TerminalEngine(audioVis); } catch (e) { console.error('Terminal error:', e); }
  
  // Expose global helpers
  window.showToast = showToast;
  window.switchMode = switchMode;
  window.openResumeModal = openResumeModal;
  window.challengeEngine = challengeEngine;
  window.techGalaxy = techGalaxy;
  window.TECH_GALAXY_DATA = TECH_GALAXY_DATA;
  window.terminalEngine = terminalEngine;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

// --- Locomotive Preloader ---
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const fill = document.getElementById('preloaderFill');
  const count = document.getElementById('preloaderPercent');

  let progress = 0;
  let finished = false;

  const dismiss = () => {
    if (finished) return;
    finished = true;
    if (preloader) preloader.classList.add('loaded');
    try {
      audioVis.playChime();
    } catch (e) {}
    try {
      assistantEngine.init();
    } catch (e) {
      console.warn('Assistant init warning:', e);
    }
  };

  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 20) + 15;
    if (progress > 100) progress = 100;

    if (fill) fill.style.width = `${progress}%`;
    if (count) count.textContent = `${progress}%`;

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(dismiss, 250);
    }
  }, 30);

  // Absolute fail-safe: Force dismiss after 1.2s if any browser lag occurs
  setTimeout(() => {
    clearInterval(interval);
    dismiss();
  }, 1200);
}

// --- Theme Switcher ---
function initThemeSwitcher() {
  const themeBtns = document.querySelectorAll('.theme-btn');
  const savedTheme = localStorage.getItem('krish_portfolio_theme') || 'light';
  
  setTheme(savedTheme);

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      audioVis.playClick();
      const theme = btn.getAttribute('data-theme-set');
      setTheme(theme);
    });
  });

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('krish_portfolio_theme', theme);

    themeBtns.forEach(b => {
      if (b.getAttribute('data-theme-set') === theme) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    if (assistantEngine && assistantEngine.avatar3D) {
      assistantEngine.avatar3D.updateThemeColors(theme);
    }

    if (typeof techGalaxy !== 'undefined' && techGalaxy && techGalaxy.updateTheme) {
      techGalaxy.updateTheme(theme);
    }
  }

  window.setPortfolioTheme = setTheme;
}

// --- Dual-Mode Switcher (Showcase vs Assistant) ---
function initModeSwitcher() {
  const modeBtns = document.querySelectorAll('.mode-btn');

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      audioVis.playClick();
      const targetMode = btn.getAttribute('data-mode');
      switchMode(targetMode);
    });
  });
}

function switchMode(targetMode) {
  const modeBtns = document.querySelectorAll('.mode-btn');
  const showcaseView = document.getElementById('showcaseView');
  const assistantView = document.getElementById('assistantView');

  modeBtns.forEach(b => {
    if (b.getAttribute('data-mode') === targetMode) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });

  if (targetMode === 'assistant') {
    if (showcaseView) showcaseView.classList.add('hidden');
    if (assistantView) assistantView.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    if (assistantView) assistantView.classList.add('hidden');
    if (showcaseView) showcaseView.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// --- Locomotive Signature Hover Text Shuffle ---
function initHoverShuffle() {
  const shuffleElements = document.querySelectorAll('[data-hover-shuffle]');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  shuffleElements.forEach(el => {
    const originalText = el.getAttribute('data-original-text') || el.textContent.trim();
    el.setAttribute('data-original-text', originalText);

    let animationFrame = null;
    let iteration = 0;

    const stopAndReset = () => {
      if (animationFrame) clearInterval(animationFrame);
      el.textContent = originalText;
    };

    el.addEventListener('mouseenter', () => {
      audioVis.playClick();
      iteration = 0;
      clearInterval(animationFrame);

      animationFrame = setInterval(() => {
        el.textContent = originalText
          .split('')
          .map((char, index) => {
            if (char === ' ' || char === '\n' || char === '→' || char === '↓' || char === '↗' || char === '✦' || char === '🎯' || char === '⚡' || char === '📄') return char;
            if (index < iteration) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');

        if (iteration >= originalText.length) {
          clearInterval(animationFrame);
          el.textContent = originalText;
        }
        iteration += 1;
      }, 30);
    });

    el.addEventListener('mouseleave', stopAndReset);
  });
}

// --- Custom Magnetic Cursor ---
function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  const follower = document.getElementById('customCursorFollower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    requestAnimationFrame(renderFollower);
  }
  requestAnimationFrame(renderFollower);

  const hoverTargets = document.querySelectorAll('a, button, input, textarea, .assistant-choice-btn, .project-card, .skill-badge, .serif-accent');
  hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => {
      cursor.classList.add('hovering');
      follower.classList.add('hovering');
    });
    target.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovering');
      follower.classList.remove('hovering');
    });
  });
}

// --- Scroll Intersection Observer for Reveals ---
function initScrollObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.editorial-section, .project-card, .skill-category-card, .timeline-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.215, 0.61, 0.355, 1), transform 0.6s cubic-bezier(0.215, 0.61, 0.355, 1)';
    observer.observe(el);
  });

  // Inject in-view class CSS
  const style = document.createElement('style');
  style.innerHTML = `
    .in-view {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
}

// --- Live Time in Dallas / Arlington, TX ---
function initTimeDisplay() {
  const timeEl = document.getElementById('localTimeDallas');
  if (!timeEl) return;

  function update() {
    try {
      const now = new Date();
      const options = { timeZone: 'America/Chicago', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
      timeEl.textContent = `${now.toLocaleTimeString('en-US', options)} CST (Arlington, TX)`;
    } catch (e) {
      timeEl.textContent = 'Arlington, TX';
    }
  }
  update();
  setInterval(update, 1000);
}

// --- Email Copy Triggers & Toast ---
function initEmailTriggers() {
  const copyButtons = document.querySelectorAll('.copy-email-trigger');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(RESUME_DATA.email).then(() => {
        showToast(`Copied ${RESUME_DATA.email} to clipboard!`);
        audioVis.playChime();
      });
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('siteToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'siteToast';
    toast.className = 'toast-notification';
    toast.innerHTML = `<span class="toast-icon">✓</span> <span id="toastMsg"></span>`;
    document.body.appendChild(toast);
  }

  const msgEl = document.getElementById('toastMsg');
  if (msgEl) msgEl.textContent = message;

  toast.classList.add('active');
  setTimeout(() => {
    toast.classList.remove('active');
  }, 3500);
}

// --- Resume Modal Controller ---
function initResumeModal() {
  const modal = document.getElementById('resumeModal');
  const openBtns = document.querySelectorAll('.open-resume-trigger');
  const closeBtn = document.getElementById('closeResumeModal');
  const printBtn = document.getElementById('printResumeBtn');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openResumeModal();
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      audioVis.playClick();
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      audioVis.playClick();
      printResume();
    });
  }
}

function printResume() {
  const paper = document.getElementById('resumePaper');
  if (!paper) {
    window.print();
    return;
  }

  // Create or reuse hidden clean iframe
  let iframe = document.getElementById('resumeIsolatedPrintFrame');
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = 'resumeIsolatedPrintFrame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    document.body.appendChild(iframe);
  }

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Krish_Ruparel_Resume</title>
      <style>
        @page {
          size: letter portrait;
          margin: 0.32in 0.38in 0.32in 0.38in;
        }
        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        body {
          font-family: 'Times New Roman', Times, 'Nimbus Roman No9 L', serif;
          font-size: 8.6pt;
          line-height: 1.22;
          color: #000000;
          background: #ffffff;
          width: 100%;
        }
        .resume-paper {
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
        }
        .resume-header-block {
          text-align: center;
          margin-bottom: 3pt;
        }
        .resume-name {
          font-family: 'Times New Roman', Times, 'Nimbus Roman No9 L', serif;
          font-size: 15.5pt;
          font-weight: 700;
          letter-spacing: 0;
          color: #000000;
          margin-bottom: 1.5pt;
        }
        .resume-contact-line {
          font-size: 8.2pt;
          color: #000000;
          text-align: center;
          margin-bottom: 4pt;
        }
        .resume-contact-line a, .resume-link {
          color: #0000ee;
          text-decoration: underline;
        }
        .resume-contact-line .sep {
          margin: 0 2pt;
        }
        .resume-section {
          margin-top: 4.5pt;
          page-break-inside: avoid;
        }
        .resume-section-title {
          font-family: 'Times New Roman', Times, 'Nimbus Roman No9 L', serif;
          font-size: 9.8pt;
          font-weight: 700;
          color: #000000;
          border-bottom: 0.75pt solid #000000;
          padding-bottom: 0.5pt;
          margin-bottom: 2pt;
          text-transform: none;
        }
        .resume-entry {
          margin-bottom: 2.5pt;
        }
        .resume-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          width: 100%;
          font-size: 8.6pt;
        }
        .resume-row-bold {
          font-weight: 700;
          color: #000000;
        }
        .resume-row-italic, .resume-italic {
          font-style: italic;
          color: #000000;
        }
        .resume-row-sub {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          width: 100%;
          font-size: 8.4pt;
          margin-bottom: 1pt;
        }
        .resume-date {
          font-weight: 700;
          white-space: nowrap;
        }
        .resume-coursework, .resume-sub-line {
          font-size: 8.2pt;
          color: #000000;
          margin-top: 0.5pt;
        }
        .resume-bullets, .resume-skills-list, .resume-cert-list {
          padding-left: 11pt;
          margin-top: 1pt;
          list-style-type: disc;
        }
        .resume-bullets li, .resume-skills-list li, .resume-cert-list li {
          font-size: 8.2pt;
          line-height: 1.18;
          color: #000000;
          margin-bottom: 1.2pt;
        }
      </style>
    </head>
    <body>
      ${paper.outerHTML}
    </body>
    </html>
  `);
  doc.close();

  setTimeout(() => {
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch (e) {
      window.print();
    }
  }, 250);
}

function openResumeModal() {
  const modal = document.getElementById('resumeModal');
  if (modal) {
    modal.classList.add('active');
    audioVis.playChime();
  }
}

// --- 3D Tech Stack Galaxy Controller ---
function initTechGalaxy() {
  const container = document.getElementById('techGalaxyContainer');
  const badgesOverlay = document.getElementById('galaxyBadgesOverlay');
  if (!container) return;

  const inspector = document.getElementById('galaxyHoverInspector');
  const inspectorDomain = document.getElementById('inspectorDomain');
  const inspectorTitle = document.getElementById('inspectorTitle');
  const inspectorDesc = document.getElementById('inspectorDesc');
  const inspectorUsedText = document.getElementById('inspectorUsedText');
  const skillBarsRow = document.getElementById('galaxySkillBarsRow');

  let lastChimeTime = 0;

  const renderSkillBars = (filter = 'all') => {
    if (!skillBarsRow) return;
    const filteredNodes = filter === 'all' 
      ? TECH_GALAXY_DATA.slice(0, 4) 
      : TECH_GALAXY_DATA.filter(n => n.category === filter).slice(0, 4);

    skillBarsRow.innerHTML = filteredNodes.map(node => `
      <div class="galaxy-skill-card" data-skill-id="${node.id}" style="--c-accent: ${node.hex};">
        <div class="galaxy-skill-card-head">
          <span class="galaxy-skill-name">${node.icon} ${node.name}</span>
          <span class="galaxy-skill-pct">${node.level}%</span>
        </div>
        <div class="galaxy-skill-track">
          <div class="galaxy-skill-fill" style="width: ${node.level}%; background: ${node.hex};"></div>
        </div>
      </div>
    `).join('');

    // Hover on skill card spotlights node in 3D Galaxy
    skillBarsRow.querySelectorAll('.galaxy-skill-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        const skillId = card.getAttribute('data-skill-id');
        techGalaxy.setHoveredNode(skillId);
        audioVis.playClick();
      });
      card.addEventListener('mouseleave', () => {
        techGalaxy.clearHoveredNode();
      });
    });
  };

  const handleNodeHover = (nodeData) => {
    if (!nodeData) return;

    if (inspectorDomain) {
      inspectorDomain.textContent = nodeData.tag ? `⚡ ${nodeData.tag.toUpperCase()}` : '⚡ CORE ARCHITECTURE';
      if (nodeData.hex) {
        inspectorDomain.style.color = nodeData.hex;
      }
    }
    if (inspectorTitle) inspectorTitle.textContent = `${nodeData.icon ? nodeData.icon + ' ' : ''}${nodeData.name || 'Core System'}`;
    if (inspectorDesc) inspectorDesc.textContent = nodeData.desc || 'High-throughput system component.';
    if (inspectorUsedText) inspectorUsedText.textContent = nodeData.usedIn || 'Production Stack';

    if (inspector && nodeData.hex) {
      inspector.style.borderColor = nodeData.hex;
    }

    // Highlight active skill card in the bottom row if present
    if (skillBarsRow) {
      skillBarsRow.querySelectorAll('.galaxy-skill-card').forEach(card => {
        if (card.getAttribute('data-skill-id') === nodeData.id) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });
    }

    // Play subtle chime on node hover with throttle
    const now = Date.now();
    if (now - lastChimeTime > 180) {
      try {
        audioVis.playClick();
      } catch (e) {}
      lastChimeTime = now;
    }
  };

  try {
    techGalaxy.init('techGalaxyContainer', 'galaxyBadgesOverlay', handleNodeHover);
    const activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
    techGalaxy.updateTheme(activeTheme);
  } catch (err) {
    console.warn('Tech Galaxy initialization note:', err);
  }

  // Initial skill bars render
  renderSkillBars('all');

  // Category Filter Tabs
  const filterBtns = document.querySelectorAll('.galaxy-tab-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const constellation = btn.getAttribute('data-constellation') || 'all';
      techGalaxy.setFilter(constellation);
      renderSkillBars(constellation);
      audioVis.playClick();
    });
  });
}

