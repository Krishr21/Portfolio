/* ==========================================================================
   KRISH RUPAREL PORTFOLIO — ⌘K INTERACTIVE TERMINAL HUD (CLI ENGINE)
   ========================================================================== */

import { RESUME_DATA } from './resume-data.js';

export class TerminalEngine {
  constructor(audioVisualizer = null) {
    this.audioVis = audioVisualizer;
    this.isOpen = false;
    this.history = [];
    this.historyIndex = -1;
    this.isStreaming = false;

    this.commands = [
      'help',
      'skills',
      'rag',
      'trace',
      'resume',
      'contact',
      'theme',
      'goto',
      'matrix',
      'clear',
      'exit'
    ];

    this.initDOM();
  }

  initDOM() {
    this.backdrop = document.getElementById('terminalBackdrop');
    this.body = document.getElementById('terminalBody');
    this.input = document.getElementById('terminalInput');
    this.closeBtn = document.getElementById('closeTerminalBtn');
    this.triggerBtn = document.getElementById('headerCliBtn') || document.getElementById('floatingCliTrigger');
    this.matrixCanvas = document.getElementById('matrixCanvasOverlay');

    if (!this.backdrop || !this.input) return;

    // Trigger button
    if (this.triggerBtn) {
      this.triggerBtn.addEventListener('click', () => this.toggle());
    }

    // Close button
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    // Backdrop click outside window
    this.backdrop.addEventListener('click', (e) => {
      if (e.target === this.backdrop) this.close();
    });

    // Global keyboard shortcuts: ⌘K, Ctrl+K, or ` (tilde/backtick)
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        this.toggle();
      } else if (e.key === '`' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        this.toggle();
      } else if (e.key === 'Escape' && this.isOpen) {
        e.preventDefault();
        this.close();
      }
    });

    // Input handlers
    this.input.addEventListener('keydown', (e) => this.handleInputKey(e));

    // Quick suggestion chips
    document.querySelectorAll('.term-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const cmd = chip.getAttribute('data-cmd') || chip.textContent.trim();
        this.executeCommand(cmd);
      });
    });

    // Initial banner
    this.printBanner();
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    this.backdrop.classList.add('active');
    this.input.focus();
    if (this.audioVis) this.audioVis.playChime();
  }

  close() {
    this.isOpen = false;
    this.backdrop.classList.remove('active');
    if (this.audioVis) this.audioVis.playClick();
  }

  handleInputKey(e) {
    if (e.key === 'Enter') {
      const raw = this.input.value.trim();
      if (!raw) return;
      this.history.push(raw);
      this.historyIndex = this.history.length;
      this.input.value = '';
      this.executeCommand(raw);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.history.length > 0 && this.historyIndex > 0) {
        this.historyIndex--;
        this.input.value = this.history[this.historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.input.value = this.history[this.historyIndex];
      } else {
        this.historyIndex = this.history.length;
        this.input.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const current = this.input.value.toLowerCase().trim();
      const match = this.commands.find(c => c.startsWith(current));
      if (match) {
        this.input.value = match + ' ';
      }
    }
  }

  print(text, type = 'output-info') {
    const line = document.createElement('div');
    line.className = `terminal-line ${type}`;
    line.innerHTML = text;
    this.body.appendChild(line);
    this.body.scrollTop = this.body.scrollHeight;
  }

  printBanner() {
    const banner = `
<div class="terminal-card" style="border-left: 3px solid #38bdf8;">
  <div style="font-weight: 700; color: #38bdf8; font-size: 0.95rem;">⚡ KRISH RUPAREL // DISTRIBUTED AI & OBSERVABILITY CLI [v5.0]</div>
  <div style="font-size: 0.8rem;">Type <span class="output-success">help</span> or click any suggestion chip below to run interactive telemetry diagnostics.</div>
</div>`;
    this.print(banner, 'output-info');
  }

  executeCommand(rawCmd) {
    if (this.isStreaming) return;

    this.print(`krish@portfolio:~$ <span style="font-weight:700; color: #38bdf8;">${rawCmd}</span>`, 'output-cmd');
    if (this.audioVis) this.audioVis.playClick();

    const parts = rawCmd.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    switch (cmd) {
      case 'help':
        this.cmdHelp();
        break;

      case 'skills':
        this.cmdSkills(args);
        break;

      case 'rag':
        this.cmdRAG(args);
        break;

      case 'trace':
        this.cmdTrace(args);
        break;

      case 'resume':
        this.cmdResume();
        break;

      case 'contact':
        this.cmdContact();
        break;

      case 'theme':
        this.cmdTheme(args);
        break;

      case 'goto':
        this.cmdGoto(args);
        break;

      case 'matrix':
        this.cmdMatrix();
        break;

      case 'clear':
        this.body.innerHTML = '';
        this.printBanner();
        break;

      case 'exit':
      case 'quit':
        this.close();
        break;

      default:
        this.print(`Command not recognized: <strong>${cmd}</strong>. Type <span class="output-success">help</span> for all valid commands.`, 'output-accent');
        break;
    }
  }

  cmdHelp() {
    const helpHtml = `
<div class="terminal-card">
  <div class="terminal-card-title">📖 AVAILABLE CLI COMMANDS & TELEMETRY DIAGNOSTICS</div>
  
  <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.84rem;">
    <div><span class="output-cmd" style="display:inline-block; width:180px;">rag [--query="..."]</span> Simulate multimodal video RAG retrieval & Qdrant vector search</div>
    <div><span class="output-cmd" style="display:inline-block; width:180px;">trace [orchestrai]</span> Stream live microservice telemetry trace (FastAPI ➔ Celery)</div>
    <div><span class="output-cmd" style="display:inline-block; width:180px;">skills [--cat=ai|sys]</span> Render interactive capability matrix with proficiency scores</div>
    <div><span class="output-cmd" style="display:inline-block; width:180px;">resume</span> Output verified MS CS education (3.84 GPA) & industry track record</div>
    <div><span class="output-cmd" style="display:inline-block; width:180px;">contact</span> Display direct email, phone, LinkedIn & GitHub profiles</div>
    <div><span class="output-cmd" style="display:inline-block; width:180px;">theme &lt;light|dark|cyber&gt;</span> Switch visual theme in real-time from the terminal</div>
    <div><span class="output-cmd" style="display:inline-block; width:180px;">goto &lt;section&gt;</span> Jump viewport to (projects, lab, experience, skills, contact)</div>
    <div><span class="output-cmd" style="display:inline-block; width:180px;">matrix</span> Trigger 6-second Cyber Green/Cyan Digital Rain animation</div>
    <div><span class="output-cmd" style="display:inline-block; width:180px;">clear</span> Wipe terminal scrollback buffer</div>
    <div><span class="output-cmd" style="display:inline-block; width:180px;">exit</span> Close the CLI HUD overlay [or press Esc]</div>
  </div>
</div>`;
    this.print(helpHtml, 'output-info');
  }

  cmdSkills(args) {
    const cat = args.toLowerCase();
    let skillsHtml = `
<div class="terminal-card">
  <div class="terminal-card-title">🛠️ TECHNICAL CAPABILITY MATRIX & PROFICIENCY SCORES</div>
  <div class="terminal-grid">`;

    if (cat.includes('ai') || cat === '') {
      skillsHtml += `
    <div style="background:rgba(255,255,255,0.03); padding:0.65rem; border-radius:6px; border:1px solid rgba(255,255,255,0.08);">
      <div style="font-weight:700; color:#06b6d4; margin-bottom:0.35rem;">🤖 AI & VECTOR RETRIEVAL</div>
      <div class="terminal-skill-item"><span>Multimodal RAG</span><span class="terminal-badge-pill">95%</span></div>
      <div class="terminal-skill-item"><span>Qdrant & FAISS HNSW</span><span class="terminal-badge-pill">92%</span></div>
      <div class="terminal-skill-item"><span>Cross-Encoder Rerank</span><span class="terminal-badge-pill">90%</span></div>
      <div class="terminal-skill-item"><span>YOLOv8 3D Volume</span><span class="terminal-badge-pill">90%</span></div>
      <div class="terminal-skill-item"><span>LlamaIndex & Ollama</span><span class="terminal-badge-pill">93%</span></div>
    </div>`;
    }

    if (cat.includes('sys') || cat === '') {
      skillsHtml += `
    <div style="background:rgba(255,255,255,0.03); padding:0.65rem; border-radius:6px; border:1px solid rgba(255,255,255,0.08);">
      <div style="font-weight:700; color:#10b981; margin-bottom:0.35rem;">⚡ DISTRIBUTED SYSTEMS</div>
      <div class="terminal-skill-item"><span>Solace PubSub+ Mesh</span><span class="terminal-badge-pill">94%</span></div>
      <div class="terminal-skill-item"><span>FastAPI Async REST</span><span class="terminal-badge-pill">94%</span></div>
      <div class="terminal-skill-item"><span>Redis Pub/Sub & Queues</span><span class="terminal-badge-pill">94%</span></div>
      <div class="terminal-skill-item"><span>OpenTelemetry & Docker</span><span class="terminal-badge-pill">90%</span></div>
      <div class="terminal-skill-item"><span>Celery Background Tasks</span><span class="terminal-badge-pill">90%</span></div>
    </div>`;
    }

    if (cat.includes('lang') || cat.includes('data') || cat === '') {
      skillsHtml += `
    <div style="background:rgba(255,255,255,0.03); padding:0.65rem; border-radius:6px; border:1px solid rgba(255,255,255,0.08);">
      <div style="font-weight:700; color:#f59e0b; margin-bottom:0.35rem;">💻 LANGUAGES & DATA</div>
      <div class="terminal-skill-item"><span>Python 3.11+ (AsyncIO)</span><span class="terminal-badge-pill">96%</span></div>
      <div class="terminal-skill-item"><span>PostgreSQL & SQL</span><span class="terminal-badge-pill">93%</span></div>
      <div class="terminal-skill-item"><span>DuckDB & PySpark</span><span class="terminal-badge-pill">90%</span></div>
      <div class="terminal-skill-item"><span>TypeScript & JavaScript</span><span class="terminal-badge-pill">91%</span></div>
      <div class="terminal-skill-item"><span>C / C++ (Memory/DSA)</span><span class="terminal-badge-pill">88%</span></div>
    </div>`;
    }

    skillsHtml += `
  </div>
</div>`;
    this.print(skillsHtml, 'output-info');
  }

  cmdRAG(args) {
    const query = args.replace(/^--query=|^query=/, '').replace(/"/g, '') || "Find segment where car tire pressure sensor triggers";
    this.isStreaming = true;

    this.print(`🚀 <strong>Initiating Multimodal RAG Pipeline</strong> for: <em>"${query}"</em>...`, 'output-info');

    const steps = [
      `[+0.002s] 🎤 Ingesting audio frames ➔ Whisper large-v3 tokenized into time-stamped text chunks...`,
      `[+0.006s] 📐 Generating 1536-dim dense embeddings via OpenAI text-embedding-3-large...`,
      `[+0.011s] ⚡ Querying Qdrant Vector DB with HNSW indexing across 24,000 video slice vectors...`,
      `[+0.015s] 🔍 Top-5 Cosine Similarity candidates retrieved: [0.942, 0.918, 0.891, 0.840, 0.792]`,
      `[+0.019s] 🔄 Running Cross-Encoder (ms-marco-MiniLM) reranking pass... Final relevance: <strong>0.984</strong>`,
      `[+0.024s] 🎯 Frame match pinpointed at timestamp <strong>[04:18.25]</strong>. Synthesizing natural answer...`,
      `[+0.035s] 💬 <strong>Synthesized Response:</strong> "The telemetry alarm logged a pressure drop to 24 PSI on the front-right tire at timestamp 04:18."`
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        this.print(steps[i], i === steps.length - 1 ? 'output-success' : 'output-info');
        if (this.audioVis) this.audioVis.playClick();
        i++;
      } else {
        clearInterval(interval);
        this.isStreaming = false;
        this.print(`✨ RAG search cycle completed in <strong>35ms</strong> with 0 telemetry drops.`, 'output-cmd');
      }
    }, 180);
  }

  cmdTrace(args) {
    this.isStreaming = true;
    this.print(`📡 <strong>Streaming OrchestrAI Agent Telemetry Trace (Run #8491)</strong>...`, 'output-info');

    const traceSteps = [
      `[00:00.000] 🟢 Agent Run Initialized (Worker ID: celery@worker-node-04)`,
      `[00:00.008] 📦 Step 01: Client WebSocket connected ➔ Redis Pub/Sub channel created`,
      `[00:00.014] 🗄️ Step 02: PostgreSQL session opened (Alembic Schema v2.4) ➔ Run state saved`,
      `[00:00.022] ⚙️ Step 03: Distributed task dispatched to Celery worker (Latency: <strong>2.4ms</strong>)`,
      `[00:00.045] 📊 Step 04: OpenTelemetry Span #span-991 export ➔ Prometheus metric recorded`,
      `[00:00.058] ✅ Step 05: Deterministic replay payload snapshot created (Size: 14.2 KB)`
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < traceSteps.length) {
        this.print(traceSteps[i], i === traceSteps.length - 1 ? 'output-success' : 'output-info');
        if (this.audioVis) this.audioVis.playClick();
        i++;
      } else {
        clearInterval(interval);
        this.isStreaming = false;
        this.print(`🎯 Trace status: <span class="output-success">200 OK</span> • Deterministic Replay Ready.`, 'output-cmd');
      }
    }, 160);
  }

  cmdResume() {
    const resumeHtml = `
<div class="terminal-card">
  <div class="terminal-card-title">🎓 ACADEMIC FOUNDATION & DEGREES</div>
  <div style="margin-bottom: 0.35rem;">
    <strong style="color:#38bdf8;">University of Texas at Arlington</strong> — Master of Science in Computer Science (MS CS)
    <div style="font-size: 0.8rem; color:var(--text-secondary);">Aug 2025 – May 2027 &bull; GPA: <strong style="color:#34d399;">3.84 / 4.0 (Honors)</strong></div>
    <div style="font-size: 0.78rem; color:var(--text-muted);">Coursework: Advanced Algorithms, Data Mining, Artificial Intelligence, Computer Vision</div>
  </div>
</div>

<div class="terminal-card">
  <div class="terminal-card-title">💼 VERIFIED INDUSTRY TRACK RECORD</div>
  
  <div style="margin-bottom: 0.5rem;">
    <strong style="color:#38bdf8;">Utrecht IT Consulting (Netherlands)</strong> — AI & Event Mesh Engineer
    <div style="font-size: 0.8rem; color:var(--text-secondary);">Dec 2024 – May 2025</div>
    <div style="font-size: 0.82rem; margin-top: 0.15rem;">• Designed event-driven middleware with <strong>Solace PubSub+</strong>, boosting message throughput by <strong>+30%</strong>.</div>
    <div style="font-size: 0.82rem;">• Streamlined distributed processing workflows across real-time feeds with zero message drops.</div>
  </div>

  <div style="margin-bottom: 0.35rem; padding-top: 0.4rem; border-top: 1px dashed rgba(255,255,255,0.08);">
    <strong style="color:#38bdf8;">Micropro Solutions (India)</strong> — Software Engineer
    <div style="font-size: 0.8rem; color:var(--text-secondary);">Jun 2023 – Dec 2023</div>
    <div style="font-size: 0.82rem; margin-top: 0.15rem;">• Built full-stack enterprise data services in Python/SQL with zero downtime.</div>
    <div style="font-size: 0.82rem;">• Automated database migration testing and accelerated API response times.</div>
  </div>
</div>

<div class="terminal-card">
  <div class="terminal-card-title">📄 PEER-REVIEWED RESEARCH PUBLICATION</div>
  <div style="font-size: 0.84rem;">
    <strong>Reviewing Advances in Food Image Recognition & Nutritional Assessment: Focus on YOLOv8</strong>
    <div style="font-size: 0.8rem; color:#34d399; margin-top: 0.2rem;">Oral Presentation in IEEE Journal &bull; 82% Benchmark Accuracy</div>
  </div>
</div>`;
    this.print(resumeHtml, 'output-info');
  }

  cmdContact() {
    const contactHtml = `
<div class="terminal-card">
  <div class="terminal-card-title">📬 GET IN TOUCH WITH KRISH RUPAREL</div>
  
  <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.86rem;">
    <div>📧 <strong>Email:</strong> <a href="mailto:krishruparel.career@gmail.com" class="terminal-link">krishruparel.career@gmail.com ↗</a></div>
    <div>📞 <strong>Phone:</strong> <strong>(682)-392-0214</strong></div>
    <div>📍 <strong>Location:</strong> Arlington, Texas (Open for Fall 2026 & Spring 2027 Roles)</div>
    <div>💼 <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/krishruparel21/" target="_blank" class="terminal-link">linkedin.com/in/krishruparel21 ↗</a></div>
    <div>🐙 <strong>GitHub:</strong> <a href="https://github.com/Krishr21" target="_blank" class="terminal-link">github.com/Krishr21 ↗</a></div>
  </div>
</div>`;
    this.print(contactHtml, 'output-info');
  }

  cmdTheme(themeName) {
    const target = themeName.trim().toLowerCase();
    if (['light', 'dark', 'cyber'].includes(target)) {
      if (window.setPortfolioTheme) {
        window.setPortfolioTheme(target);
      } else {
        document.documentElement.setAttribute('data-theme', target);
      }
      this.print(`🎨 Portfolio theme successfully updated to: <strong class="output-success">${target.toUpperCase()}</strong>`, 'output-cmd');
    } else {
      this.print(`Invalid theme: '${themeName}'. Options are: <span class="output-success">light</span>, <span class="output-success">dark</span>, <span class="output-success">cyber</span>`, 'output-warning');
    }
  }

  cmdGoto(sectionName) {
    const sec = sectionName.trim().toLowerCase();
    const map = {
      'projects': '#projects',
      'work': '#projects',
      'works': '#projects',
      'lab': '#interactive-lab',
      'interactive': '#interactive-lab',
      'experience': '#experience',
      'career': '#experience',
      'skills': '#skills',
      'galaxy': '#skills',
      'matrix': '#skills',
      'education': '#education',
      'contact': '#contact'
    };

    if (map[sec]) {
      const el = document.querySelector(map[sec]);
      if (el) {
        this.close();
        el.scrollIntoView({ behavior: 'smooth' });
        this.print(`Navigating viewport to <strong>${sec}</strong>...`, 'output-success');
      }
    } else {
      this.print(`Section '${sectionName}' not recognized. Options: projects, lab, experience, skills, education, contact.`, 'output-warning');
    }
  }

  cmdMatrix() {
    if (!this.matrixCanvas) return;
    this.print(`⚡ Initiating Cyber Digital Rain Simulation for 6 seconds...`, 'output-cmd');
    
    this.matrixCanvas.classList.add('active');
    const ctx = this.matrixCanvas.getContext('2d');
    this.matrixCanvas.width = window.innerWidth;
    this.matrixCanvas.height = window.innerHeight;

    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソタチツテト';
    const fontSize = 14;
    const columns = Math.floor(this.matrixCanvas.width / fontSize);
    const drops = Array(columns).fill(1);

    let animationId;
    const renderMatrix = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.fillRect(0, 0, this.matrixCanvas.width, this.matrixCanvas.height);

      ctx.fillStyle = '#00f5ff';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > this.matrixCanvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationId = requestAnimationFrame(renderMatrix);
    };

    renderMatrix();

    setTimeout(() => {
      cancelAnimationFrame(animationId);
      this.matrixCanvas.classList.remove('active');
      ctx.clearRect(0, 0, this.matrixCanvas.width, this.matrixCanvas.height);
      this.print(`✨ Digital rain sequence ended.`, 'output-info');
    }, 6000);
  }
}
