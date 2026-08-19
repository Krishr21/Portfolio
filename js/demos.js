/* ==========================================================================
   KRISH RUPAREL PORTFOLIO — INTERACTIVE SYSTEMS LAB / LIVE PROJECT DEMOS
   ========================================================================== */

import { audioVis } from './audio-visualizer.js';

export function initInteractiveDemos() {
  initTabs();
  initVisionVaultDemo();
  initOrchestrAIDemo();
  initCarWiseDemo();
}

// --- Tab Switching Logic ---
function initTabs() {
  const tabBtns = document.querySelectorAll('.demo-tab-btn');
  const tabPanels = document.querySelectorAll('.demo-tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      audioVis.playClick();
      const targetId = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });
}

// --- VisionVault RAG Simulator ---
function initVisionVaultDemo() {
  const input = document.getElementById('ragQueryInput');
  const runBtn = document.getElementById('ragRunBtn');
  const chips = document.querySelectorAll('.rag-preset-chip');
  const resultsContainer = document.getElementById('ragResultsContainer');

  const corpus = [
    {
      queryKeyword: "vector",
      whisperChunk: "[02:14 - 02:45] '...we benchmarked Qdrant against FAISS for vector indexing. By tuning HNSW m and ef_construct params, we achieved sub-15ms retrieval with 98.4% recall...'",
      visionCue: "Frame 4120: Architecture slide with vector space dimensionality & Qdrant cluster",
      rawScore: "0.812 Cosine",
      rerankScore: "0.964 Cross-Encoder",
      latency: "14.2 ms"
    },
    {
      queryKeyword: "cross-encoder",
      whisperChunk: "[05:10 - 05:32] '...standard bi-encoder embeddings can miss fine-grained semantic subtleties. Integrating a cross-encoder reranker on the top-50 candidates bumped NDCG@10 by 24%...'",
      visionCue: "Frame 9300: Confusion matrix & precision-recall curve comparing bi-encoder vs cross-encoder",
      rawScore: "0.789 Cosine",
      rerankScore: "0.982 Cross-Encoder",
      latency: "28.5 ms"
    },
    {
      queryKeyword: "synthesis",
      whisperChunk: "[08:40 - 09:12] '...LlamaIndex indexes these temporal chunks, and feeds them into local Ollama LLM for localized synthesis without sending sensitive video data off-premises...'",
      visionCue: "Frame 15600: Code snippet showing LlamaIndex VectorStoreIndex + Ollama pipeline",
      rawScore: "0.764 Cosine",
      rerankScore: "0.941 Cross-Encoder",
      latency: "18.9 ms"
    }
  ];

  function executeQuery(queryText) {
    if (!queryText) queryText = "vector similarity search trade-offs";
    audioVis.playBeep();
    
    if (resultsContainer) {
      resultsContainer.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 2rem; font-family: var(--font-mono); color: var(--text-muted);">⚡ Running Dense Vector Search (Qdrant) & Cross-Encoder Reranking...</div>`;
    }

    setTimeout(() => {
      audioVis.playChime();
      const matched = corpus.find(c => queryText.toLowerCase().includes(c.queryKeyword)) || corpus[0];

      if (resultsContainer) {
        resultsContainer.innerHTML = `
          <div class="rag-result-col">
            <span class="rag-col-label">1. Whisper Temporal Audio Chunk</span>
            <div class="rag-result-card">
              <div class="rag-card-meta">
                <span>Timestamp Aligned</span>
                <span class="score-badge">Initial: ${matched.rawScore}</span>
              </div>
              <p>${matched.whisperChunk}</p>
            </div>
          </div>

          <div class="rag-result-col">
            <span class="rag-col-label">2. Cross-Encoder Reranked Synthesis</span>
            <div class="rag-result-card" style="border-left: 3px solid var(--accent-secondary);">
              <div class="rag-card-meta">
                <span>Precision Reranked (Latency: ${matched.latency})</span>
                <span class="score-badge" style="color: var(--accent-secondary);">${matched.rerankScore}</span>
              </div>
              <p><strong>Vision Context:</strong> ${matched.visionCue}</p>
              <div style="margin-top: 0.5rem; font-size: 0.78rem; color: var(--text-muted); font-family: var(--font-mono);">
                LlamaIndex synthesis ready → Streamed to Ollama local LLM
              </div>
            </div>
          </div>
        `;
      }
    }, 400);
  }

  if (runBtn && input) {
    runBtn.addEventListener('click', () => executeQuery(input.value));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') executeQuery(input.value);
    });
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      if (input) {
        input.value = chip.getAttribute('data-query');
        executeQuery(input.value);
      }
    });
  });
}

// --- OrchestrAI Agent Telemetry Replay ---
function initOrchestrAIDemo() {
  const terminalBody = document.getElementById('orchestrTerminalBody');
  const playBtn = document.getElementById('termPlayBtn');
  const stepBtn = document.getElementById('termStepBtn');
  const resetBtn = document.getElementById('termResetBtn');

  const traceSteps = [
    { time: "00:00.012", tag: "INIT", text: "Agent session spawned: ID #agy-892f-worker1", highlight: true },
    { time: "00:00.045", tag: "REDIS", text: "Subscribed to channel 'agent.runs.stream.892f' via WebSockets" },
    { time: "00:00.120", tag: "TOOL_CALL", text: "Executing tool 'query_vector_db' with args: { collection: 'docs_v2' }" },
    { time: "00:00.315", tag: "POSTGRES", text: "Recorded state snapshot to PostgreSQL (Migration schema: v4_traces)" },
    { time: "00:00.580", tag: "CELERY", text: "Dispatched async offline evaluation job to Celery broker (Task ID #cel-994)" },
    { time: "00:00.820", tag: "OPENTELEMETRY", text: "Emitted trace span [latency: 240ms, memory: 42MB, status: 200 OK]", highlight: true },
    { time: "00:01.050", tag: "SUCCESS", text: "Agent run completed deterministically. Replay verification passed 100%.", highlight: true }
  ];

  let currentStepIdx = 0;
  let isPlaying = false;
  let playInterval = null;

  function renderStep(step) {
    if (!terminalBody) return;
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = `
      <span class="timestamp">[${step.time}]</span>
      <span class="event-tag">&lt;${step.tag}&gt;</span>
      <span class="${step.highlight ? 'highlight' : ''}">${step.text}</span>
    `;
    terminalBody.appendChild(line);
    terminalBody.scrollTop = terminalBody.scrollHeight;
    audioVis.playBeep();
  }

  function nextStep() {
    if (currentStepIdx < traceSteps.length) {
      renderStep(traceSteps[currentStepIdx]);
      currentStepIdx++;
    } else {
      pause();
    }
  }

  function play() {
    isPlaying = true;
    if (playBtn) playBtn.textContent = '⏸ Pause Replay';
    playInterval = setInterval(() => {
      if (currentStepIdx >= traceSteps.length) {
        pause();
      } else {
        nextStep();
      }
    }, 600);
  }

  function pause() {
    isPlaying = false;
    if (playBtn) playBtn.textContent = '▶ Play Live Replay';
    if (playInterval) clearInterval(playInterval);
  }

  function reset() {
    pause();
    currentStepIdx = 0;
    if (terminalBody) terminalBody.innerHTML = '';
    audioVis.playClick();
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (isPlaying) pause();
      else play();
    });
  }

  if (stepBtn) {
    stepBtn.addEventListener('click', () => {
      pause();
      nextStep();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', reset);
  }
}

// --- CarWise-AI Gemini Comparison Grid ---
function initCarWiseDemo() {
  const toggleBtn = document.getElementById('carwiseModeToggle');
  const container = document.getElementById('carwiseGridContainer');

  const groundedVehicles = [
    {
      title: "2023 Tesla Model 3 Long Range",
      price: "$28,990",
      mileage: "24,500 mi",
      source: "Verified Dealer • Dallas, TX",
      pros: "330mi real EPA range, verified clean title, AMD Ryzen MCU",
      cons: "Minor cosmetic rim rash reported in inspection",
      grounded: true
    },
    {
      title: "2022 BMW 330i xDrive",
      price: "$31,450",
      mileage: "19,800 mi",
      source: "Certified Pre-Owned • Fort Worth, TX",
      pros: "Complete dealer service history, M-Sport package, Apple CarPlay",
      cons: "Firm suspension over rough pavement",
      grounded: true
    },
    {
      title: "2024 Honda Civic Touring",
      price: "$26,700",
      mileage: "8,200 mi",
      source: "Private Seller • Arlington, TX",
      pros: "Bose sound system, 38 MPG highway, low maintenance costs",
      cons: "CVT transmission responsiveness under heavy load",
      grounded: true
    }
  ];

  function renderGrid() {
    if (!container) return;
    container.innerHTML = '';

    groundedVehicles.forEach(car => {
      const card = document.createElement('div');
      card.className = 'carwise-card';
      card.innerHTML = `
        <div class="carwise-title">${car.title}</div>
        <div class="carwise-price">${car.price}</div>
        <div style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-secondary);">
          ${car.mileage} • ${car.source}
        </div>
        <span class="carwise-grounded-badge">⚡ Google Gemini Search Grounded</span>
        <div style="font-size: 0.85rem; line-height: 1.45; margin-top: 0.5rem;">
          <div style="color: var(--accent-green);"><strong>✓ Pros:</strong> ${car.pros}</div>
          <div style="color: var(--accent-secondary); margin-top: 0.35rem;"><strong>✗ Cons:</strong> ${car.cons}</div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  renderGrid();
}
