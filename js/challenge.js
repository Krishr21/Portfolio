/**
 * ============================================================================
 * TECHNICAL INTERVIEW CHALLENGE MODE (K.R.I.S.H. 3D AI HOST)
 * ============================================================================
 * An interactive mini-game where the 3D Host quizzes recruiters/engineers on
 * system design trade-offs (Cross-Encoder latency, Solace Pub/Sub, YOLOv8 3D volume,
 * and Agent Observability replay) with live scoring, sound FX, randomized options,
 * and certified badges.
 */

class TechnicalChallenge {
  constructor() {
    this.questions = [
      {
        id: 1,
        topic: "Multimodal Video RAG",
        question: "In VisionVault's video retrieval pipeline, why is 2-stage retrieval (Bi-Encoder embeddings + Cross-Encoder reranking) essential instead of running a Cross-Encoder directly over the whole dataset?",
        options: [
          {
            text: "Cross-Encoders compute all-to-all query-document cross-attention which is O(N) and too slow for large vector stores; Bi-Encoders enable fast sub-millisecond approximate nearest neighbor retrieval.",
            correct: true,
            explanation: "Spot on! Bi-encoders compute independent embeddings allowing sub-linear ANN index lookups (Qdrant/FAISS). Cross-encoders perform full joint cross-attention with higher semantic precision, so they are applied only to the top 20 candidates."
          },
          {
            text: "Bi-Encoders provide higher accuracy than Cross-Encoders on complex multimodal queries.",
            correct: false,
            explanation: "Incorrect. Cross-encoders have higher accuracy because tokens in the query directly attend to all tokens in the document, but they cannot be pre-indexed into vector stores."
          },
          {
            text: "Cross-Encoders cannot process multimodal audio-visual text embeddings.",
            correct: false,
            explanation: "Incorrect. Multimodal cross-encoders (like CLIP or ViLT) can process multi-modal tokens, but computing joint attention across millions of video frames is computationally prohibitive in real time."
          },
          {
            text: "Bi-Encoders completely remove the need for vector databases.",
            correct: false,
            explanation: "Incorrect. Bi-encoders are specifically what enables vector databases (Qdrant, Milvus, FAISS) to index standalone dense embeddings."
          }
        ],
        voicePrompt: "Question 1: In VisionVault's multimodal RAG architecture, why do we use a two-stage retrieval pipeline with bi-encoders and cross-encoder reranking?",
        correctVoice: "Excellent system design insight! That is exactly how VisionVault achieves sub-second video retrieval at scale.",
        incorrectVoice: "Good effort, but cross-attention over millions of video frames would create massive latency bottlenecks."
      },
      {
        id: 2,
        topic: "High-Throughput Distributed Pub/Sub",
        question: "At Utrecht IT Consulting, how did migrating to Solace Pub/Sub event brokers achieve a +30% throughput increase across microservices?",
        options: [
          {
            text: "By shifting from synchronous request-reply polling to asynchronous event-driven topic hierarchies with hardware-accelerated routing and zero-copy direct messaging.",
            correct: true,
            explanation: "Exactly! Replacing synchronous HTTP polling with Solace's topic hierarchy and pub/sub decoupled microservices, reduced network roundtrips, and eliminated connection overhead."
          },
          {
            text: "By eliminating data serialization and schema validation completely.",
            correct: false,
            explanation: "Incorrect. Data serialization and schema contracts are still essential for microservice integrity; throughput was gained via asynchronous event streaming."
          },
          {
            text: "By writing every transient broadcast message to relational disk before forwarding.",
            correct: false,
            explanation: "Incorrect. Direct messaging in Solace avoids disk persistence for ultra-low microsecond throughput."
          },
          {
            text: "By switching to single-threaded sequential socket processing.",
            correct: false,
            explanation: "Incorrect. Solace leverages multi-core asynchronous I/O and hardware-assisted message routing."
          }
        ],
        voicePrompt: "Question 2: In distributed event systems, how did Krish's Solace pub-sub architecture boost microservice throughput by thirty percent at Utrecht IT Consulting?",
        correctVoice: "Spot on! Asynchronous topic hierarchies eliminated blocking request-reply bottlenecks.",
        incorrectVoice: "Not quite. The gain comes from decoupling synchronous polling into event-driven pub-sub streaming."
      },
      {
        id: 3,
        topic: "Computer Vision & IEEE Research",
        question: "In Krish's peer-reviewed IEEE research paper on YOLOv8 dietary assessment, how was 3D food volume estimated from standard 2D smartphone images?",
        options: [
          {
            text: "By fusing YOLOv8 instance segmentation masks with reference coin scale calibration and geometric ellipsoid/voxel height projection.",
            correct: true,
            explanation: "Precisely! Standard 2D cameras lack direct depth. By detecting a known reference object (e.g. coin) for pixel-to-metric ratio and projecting segmented contours into geometric shape primitives, 3D volume was estimated with 82% benchmark accuracy."
          },
          {
            text: "By requiring expensive hardware LiDAR time-of-flight depth sensors on every user phone.",
            correct: false,
            explanation: "Incorrect. The core novelty was making dietary volume estimation accessible on any standard smartphone camera without requiring LiDAR."
          },
          {
            text: "By asking a generative LLM to guess the weight from the image title.",
            correct: false,
            explanation: "Incorrect. The research used rigorous YOLOv8 segmentation and calibrated mathematical voxel projections."
          },
          {
            text: "By calculating pure 2D bounding box area without pixel scale or height modeling.",
            correct: false,
            explanation: "Incorrect. 2D bounding boxes do not capture depth or irregular food contours."
          }
        ],
        voicePrompt: "Question 3: In Krish's IEEE research paper on YOLOv8, how was three-dimensional food volume calculated from standard two-dimensional smartphone photos?",
        correctVoice: "Brilliant! Segmenting contours and calibrating metric scale primitives enabled 82% benchmark accuracy.",
        incorrectVoice: "Actually, 3D volume estimation required reference scale calibration and geometric voxel projections without needing LiDAR."
      },
      {
        id: 4,
        topic: "Agent Observability & Determinism",
        question: "Why is deterministic execution replay critical when debugging multi-agent LLM systems in OrchestrAI?",
        options: [
          {
            text: "Non-deterministic LLM tool calls and asynchronous WebSocket message interleaving create transient race conditions that require event-sourced trace captures to reproduce and diagnose.",
            correct: true,
            explanation: "Spot on! In distributed multi-agent systems, agents call external tools and exchange messages asynchronously. Capturing serialized event streams allows deterministic replay to pinpoint exact failure points."
          },
          {
            text: "Replay completely removes all API costs during live production calls.",
            correct: false,
            explanation: "Incorrect. Replay is a diagnostic and observability feature, not a live runtime caching layer."
          },
          {
            text: "LLM agents cannot use Redis Pub/Sub without replay enabled.",
            correct: false,
            explanation: "Incorrect. Redis Pub/Sub operates independently; OrchestrAI leverages it for real-time telemetry streaming."
          },
          {
            text: "Deterministic replay is required by Python's asyncio event loop.",
            correct: false,
            explanation: "Incorrect. Asyncio operates normally without replay; replay is a specialized observability architecture designed by Krish."
          }
        ],
        voicePrompt: "Final Question: In multi-agent LLM systems like OrchestrAI, why is deterministic execution replay vital for production debugging?",
        correctVoice: "Outstanding! You have mastered the principles of distributed AI agent observability.",
        incorrectVoice: "Actually, event-sourced replay is essential to reproduce asynchronous race conditions in multi-agent tool calling."
      }
    ];

    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.userAnswers = [];
    this.isActive = false;
    this.activeQuestions = [];
  }

  shuffleOptions(options) {
    const arr = options.map(opt => ({ ...opt }));
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  init() {
    this.bindEvents();
    this.bindKeyboard();
  }

  bindKeyboard() {
    // Enable Enter, Space, and Right Arrow keys to advance to next question
    document.addEventListener('keydown', (e) => {
      if (!this.isActive) return;
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
        const nextBtn = document.getElementById('btnNextQuestion');
        if (nextBtn) {
          e.preventDefault();
          this.goToNext();
        }
      }
    });
  }

  bindEvents() {
    // Universal Event Delegation for challenge interactions
    document.addEventListener('click', (e) => {
      // 1. Trigger Challenge
      const triggerBtn = e.target.closest('.trigger-challenge-btn');
      if (triggerBtn) {
        e.preventDefault();
        this.startChallenge();
        return;
      }

      // 2. Next Question Button OR clicking feedback area when answered
      const nextBtn = e.target.closest('#btnNextQuestion, .challenge-next-btn, .challenge-feedback-banner, .challenge-explanation-box');
      if (nextBtn && this.isActive && this.hasAnsweredCurrent) {
        e.preventDefault();
        this.goToNext();
        return;
      }

      // 3. Clicking any locked card after answering also advances
      const cardAfterAnswer = e.target.closest('.challenge-option-card');
      if (cardAfterAnswer && this.isActive && this.hasAnsweredCurrent) {
        e.preventDefault();
        this.goToNext();
        return;
      }

      // 4. Exit Challenge Button
      const exitBtn = e.target.closest('#btnExitChallenge, .challenge-exit-btn');
      if (exitBtn && this.isActive) {
        e.preventDefault();
        this.exitChallenge();
        return;
      }

      // 5. Retake Challenge Button
      const restartBtn = e.target.closest('#btnRestartChallenge, .restart-btn');
      if (restartBtn && this.isActive) {
        e.preventDefault();
        this.startChallenge();
        return;
      }

      // 6. Return to Assistant Button
      const returnBtn = e.target.closest('#btnReturnAssistant, .return-btn');
      if (returnBtn && this.isActive) {
        e.preventDefault();
        this.exitChallenge();
        return;
      }
    });
  }

  startChallenge() {
    this.isActive = true;
    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.userAnswers = [];

    // Shuffle options for all questions so the correct answer is randomized (A, B, C, or D)
    this.activeQuestions = this.questions.map(q => ({
      ...q,
      options: this.shuffleOptions(q.options)
    }));

    // Switch to Assistant view & enable challenge-active-mode layout
    const assistantView = document.getElementById('assistantView');
    const showcaseView = document.getElementById('showcaseView');

    if (typeof window.switchMode === 'function') {
      window.switchMode('assistant');
    } else {
      if (showcaseView) showcaseView.classList.add('hidden');
      if (assistantView) assistantView.classList.remove('hidden');
    }

    if (assistantView) {
      assistantView.classList.add('challenge-active-mode');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    const ast = window.assistantEngine || window.assistant;
    if (ast && ast.avatar3D) {
      ast.avatar3D.playWave();
    }

    this.renderQuestion();
  }

  renderQuestion() {
    this.hasAnsweredCurrent = false;
    if (!this.activeQuestions || !this.activeQuestions[this.currentIndex]) return;
    const q = this.activeQuestions[this.currentIndex];
    const choicesContainer = document.getElementById('assistantChoices');
    const speechEl = document.getElementById('assistantSpeech');
    if (!choicesContainer || !speechEl) return;

    const ast = window.assistantEngine || window.assistant;

    // Speak Question Voice Prompt via Speechmatics Sarah
    if (ast && typeof ast.speakText === 'function') {
      ast.speakText(q.voicePrompt);
    }

    // Update Speech Header with Question & Progress
    speechEl.innerHTML = `
      <div class="challenge-header-meta">
        <span class="challenge-progress-tag">CHALLENGE: Q${this.currentIndex + 1} OF ${this.activeQuestions.length}</span>
        <span class="challenge-topic-tag">${q.topic}</span>
        <span class="challenge-score-pill">🔥 Score: ${this.score} PTS</span>
      </div>
      <div class="challenge-question-text">${q.question}</div>
    `;

    // Render 4 Interactive Choice Cards with randomized positions
    let html = `<div class="challenge-options-grid" id="challengeOptionsGrid">`;
    const optionLabels = ['A', 'B', 'C', 'D'];

    q.options.forEach((opt, idx) => {
      html += `
        <button class="challenge-option-card" data-idx="${idx}" id="optCard_${idx}">
          <div class="challenge-option-badge">${optionLabels[idx]}</div>
          <div class="challenge-option-text">${opt.text}</div>
        </button>
      `;
    });
    html += `</div>`;

    // Explanation & Next Button Container (Revealed after selecting answer)
    html += `<div id="challengeFeedbackArea" style="width: 100%; max-width: 680px;"></div>`;

    // Exit / Skip Button
    html += `
      <div class="challenge-footer-controls">
        <button class="challenge-exit-btn" id="btnExitChallenge">← Exit Challenge</button>
        <span class="challenge-hint">💡 Select an architectural trade-off</span>
      </div>
    `;

    choicesContainer.innerHTML = html;

    // Attach Option Click Handlers
    choicesContainer.querySelectorAll('.challenge-option-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const selectedIdx = parseInt(btn.getAttribute('data-idx'));
        this.handleAnswer(selectedIdx);
      });
    });
  }

  handleAnswer(selectedIdx) {
    if (this.hasAnsweredCurrent) return;
    this.hasAnsweredCurrent = true;

    const q = this.activeQuestions[this.currentIndex];
    const selectedOpt = q.options[selectedIdx];
    const isCorrect = selectedOpt ? selectedOpt.correct : false;
    const ast = window.assistantEngine || window.assistant;

    // Disable all option cards immediately to prevent duplicate selection
    const allCards = document.querySelectorAll('.challenge-option-card');
    allCards.forEach(card => {
      card.disabled = true;
    });

    // Highlight clicked card
    const clickedCard = document.getElementById(`optCard_${selectedIdx}`);
    if (clickedCard) {
      clickedCard.classList.add(isCorrect ? 'selected-correct' : 'selected-wrong');
    }

    // If incorrect, highlight the true correct option card in dashed green
    if (!isCorrect) {
      q.options.forEach((opt, idx) => {
        if (opt.correct) {
          const correctCard = document.getElementById(`optCard_${idx}`);
          if (correctCard) correctCard.classList.add('highlight-correct');
        }
      });
    }

    this.userAnswers.push({
      question: q.question,
      selected: selectedOpt ? selectedOpt.text : '',
      correct: isCorrect,
      explanation: selectedOpt ? selectedOpt.explanation : ''
    });

    if (isCorrect) {
      this.score += 100;
      this.streak++;
      if (window.audioVis) window.audioVis.playChime();
      if (ast) {
        if (ast.avatar3D) ast.avatar3D.playCheer();
        if (typeof ast.speakText === 'function') ast.speakText(q.correctVoice);
      }
    } else {
      this.streak = 0;
      if (ast) {
        if (ast.avatar3D) ast.avatar3D.playNod();
        if (typeof ast.speakText === 'function') ast.speakText(q.incorrectVoice);
      }
    }

    // Render Answer Review & Next Question Button
    const feedbackArea = document.getElementById('challengeFeedbackArea');
    if (feedbackArea) {
      const isLast = this.currentIndex === this.activeQuestions.length - 1;
      feedbackArea.innerHTML = `
        <div class="challenge-feedback-banner ${isCorrect ? 'correct' : 'incorrect'}" style="margin-top: 0.75rem;">
          <span class="feedback-icon">${isCorrect ? '✅ CORRECT (+100 PTS)' : '❌ NOT QUITE — SEE BREAKDOWN'}</span>
          <span class="feedback-streak">${this.streak > 1 ? `🔥 ${this.streak} In a Row!` : ''}</span>
        </div>
        <div class="challenge-explanation-box">
          <strong>Architectural Breakdown:</strong>
          <p>${selectedOpt ? selectedOpt.explanation : ''}</p>
        </div>
        <div class="challenge-next-row" style="margin-top: 0.85rem;">
          <button class="challenge-next-btn" id="btnNextQuestion">
            ${isLast ? '🏆 View Final Score & Certified Badge →' : 'Next Architectural Question →'}
          </button>
        </div>
      `;

      const btnNext = document.getElementById('btnNextQuestion');
      if (btnNext) {
        btnNext.addEventListener('click', (e) => {
          e.preventDefault();
          this.goToNext();
        });
        btnNext.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }

  goToNext() {
    this.hasAnsweredCurrent = false;
    this.currentIndex++;
    if (this.currentIndex < this.activeQuestions.length) {
      this.renderQuestion();
    } else {
      this.renderCompletionScreen();
    }
  }

  renderCompletionScreen() {
    const choicesContainer = document.getElementById('assistantChoices');
    const speechEl = document.getElementById('assistantSpeech');
    if (!choicesContainer || !speechEl) return;

    const maxScore = this.activeQuestions.length * 100;
    const percentage = Math.round((this.score / maxScore) * 100);
    const ast = window.assistantEngine || window.assistant;

    let badgeTitle = "🏆 Principal Systems Architect";
    let badgeDesc = "Flawless mastery of Multimodal RAG, Distributed Solace Pub/Sub, and Computer Vision pipelines.";
    let badgeClass = "gold";

    if (percentage >= 75) {
      badgeTitle = "🎖️ Senior AI Systems Specialist";
      badgeDesc = "High-level understanding of high-throughput streaming and LLM observability.";
      badgeClass = "silver";
    } else if (percentage >= 50) {
      badgeTitle = "💡 Distributed Systems Engineer";
      badgeDesc = "Solid foundation in modern RAG and microservice architecture trade-offs.";
      badgeClass = "bronze";
    } else {
      badgeTitle = "🚀 Systems Explorer";
      badgeDesc = "Great curiosity exploring Krish's architectural and research portfolio.";
      badgeClass = "starter";
    }

    if (ast) {
      if (ast.avatar3D) ast.avatar3D.playCheer();
      if (typeof ast.speakText === 'function') {
        ast.speakText(`Challenge complete! You scored ${this.score} points and earned the ${badgeTitle} award. Thank you for testing your system design skills with me!`);
      }
    }

    speechEl.innerHTML = `
      <div class="challenge-badge-card ${badgeClass}">
        <div class="badge-header">
          <span class="badge-award-label">OFFICIAL INTERACTIVE VERIFICATION</span>
          <h2 class="badge-title">${badgeTitle}</h2>
        </div>
        <div class="badge-score-row">
          <div class="badge-stat">
            <span class="stat-num">${this.score}/${maxScore}</span>
            <span class="stat-lbl">Final Score</span>
          </div>
          <div class="badge-stat">
            <span class="stat-num">${percentage}%</span>
            <span class="stat-lbl">Accuracy</span>
          </div>
          <div class="badge-stat">
            <span class="stat-num">4 / 4</span>
            <span class="stat-lbl">Evaluations</span>
          </div>
        </div>
        <p class="badge-desc">${badgeDesc}</p>
      </div>
    `;

    choicesContainer.innerHTML = `
      <div class="challenge-finish-actions">
        <a href="Krish_Ruparel_Resume_2026.pdf" download="Krish_Ruparel_Resume_2026.pdf" class="challenge-cta-btn resume-btn">
          📄 Download Krish's Full Resume (PDF)
        </a>
        <a href="https://www.linkedin.com/in/krishruparel21/" target="_blank" rel="noopener noreferrer" class="challenge-cta-btn linkedin-btn">
          💼 Connect on LinkedIn ↗
        </a>
        <a href="https://github.com/Krishr21" target="_blank" rel="noopener noreferrer" class="challenge-cta-btn" style="background: var(--bg-surface); border: 1px solid var(--border-medium); color: var(--text-primary);">
          🐙 View GitHub (@Krishr21) ↗
        </a>
        <button class="challenge-cta-btn restart-btn" id="btnRestartChallenge">
          🔄 Retake Challenge
        </button>
        <button class="challenge-cta-btn return-btn" id="btnReturnAssistant">
          💬 Return to Voice AI Host
        </button>
      </div>
    `;
  }

  exitChallenge() {
    this.isActive = false;
    const assistantView = document.getElementById('assistantView');
    if (assistantView) {
      assistantView.classList.remove('challenge-active-mode');
    }

    const ast = window.assistantEngine || window.assistant;
    if (ast && typeof ast.resetAssistant === 'function') {
      ast.resetAssistant();
    } else if (ast && typeof ast.renderStep === 'function') {
      if (typeof ast.stopAudio === 'function') ast.stopAudio();
      ast.renderStep('greeting');
    }
  }
}

// Global instance & ES module exports
export const challengeEngine = new TechnicalChallenge();
window.challenge = challengeEngine;

export function initTechnicalChallenge() {
  challengeEngine.init();
}
