/* ==========================================================================
   KRISH RUPAREL PORTFOLIO — K.R.I.S.H. / LISA CONVERSATIONAL ENGINE
   ========================================================================== */

import { RESUME_DATA } from './resume-data.js';
import { audioVis } from './audio-visualizer.js';
import { Assistant3DAvatar } from './avatar-3d.js';

const API_BASE = window.PORTFOLIO_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:8080' : '');

class ConversationalAssistant {
  constructor() {
    this.container = document.getElementById('assistantView');
    this.speechEl = document.getElementById('assistantSpeech');
    this.choicesEl = document.getElementById('assistantChoices');
    this.progressBar = document.getElementById('assistantProgressBar');
    this.stageEl = document.querySelector('.assistant-stage');
    this.queryInput = document.getElementById('assistantQueryInput');
    this.micBtn = document.getElementById('assistantMicBtn');
    this.sendBtn = document.getElementById('assistantSendBtn');
    
    this.avatar3D = null;
    this.userAnswers = {};
    this.currentStep = 'greeting';
    this.quizIndex = 0;
    this.quizScore = 0;
    this.isListening = false;
    this.speechRecognition = null;

    this.dialogTree = {
      greeting: {
        progress: 15,
        dialogs: [
          "Hi there! I'm <span class='highlight'>K.R.I.S.H.</span> — Krish's Responsive Intelligent Software Host. Ask me anything, or pick an option below to get started!",
          "Welcome! I run Krish's digital portfolio. Whether you're scouting for top AI talent or exploring multimodal RAG, I'm at your service. What shall we explore?",
          "Hello! You've reached Krish Ruparel's interactive hub. Master's in CS @ UT Arlington (3.84 GPA), distributed systems builder, and AI engineer. Where shall we start?"
        ],
        choices: [
          { label: "💼 Hire or Work with Krish", target: "hire-intro", primary: true },
          { label: "⚡ Explore Featured Projects", target: "projects-intro" },
          { label: "🧠 Test Krish's AI Knowledge", target: "quiz-intro" },
          { label: "📜 View Full Resume & Credentials", target: "resume-summary" },
          { label: "📬 Drop a Quick Message", target: "contact-direct" },
          { label: "☕ Casual Banter & Fun Facts", target: "banter-intro" }
        ]
      },

      // --- BRANCH: HIRE / COLLABORATE ---
      "hire-intro": {
        progress: 30,
        dialogs: [
          "Exciting! Krish is actively open for <span class='highlight'>Fall 2026 &amp; Spring 2027</span> AI Engineer, Machine Learning, and Full-Stack roles. What type of opportunity are you looking to discuss?"
        ],
        choices: [
          { label: "Full-Time AI / ML Engineer Role", target: "hire-details", value: "Full-Time AI/ML" },
          { label: "Fall 2026 / Spring 2027 Co-op or Internship", target: "hire-details", value: "Internship/Co-op" },
          { label: "Enterprise AI Consulting / Contract", target: "hire-details", value: "Consulting/Contract" },
          { label: "⬅ Back to start", target: "greeting" }
        ]
      },

      "hire-details": {
        progress: 50,
        dialogs: [
          "Fantastic. Let's make this seamless. What is your name and company/organization?"
        ],
        form: {
          type: "input-pair",
          field1: { name: "name", label: "Your Name", placeholder: "e.g. Alex Morgan" },
          field2: { name: "company", label: "Company / Organization", placeholder: "e.g. Acme AI Labs" },
          buttonLabel: "Continue →",
          next: "hire-message"
        }
      },

      "hire-message": {
        progress: 75,
        dialogs: [
          "Great to meet you! Drop a brief note on what you're building or what role Krish can help champion:"
        ],
        form: {
          type: "textarea-email",
          field1: { name: "message", label: "Project or Role Details", placeholder: "We are scaling our multimodal retrieval infrastructure and need someone with your Qdrant/LlamaIndex experience..." },
          field2: { name: "email", label: "Your Email Address", placeholder: "alex@company.com" },
          buttonLabel: "Send Inquiry & Connect 🚀",
          next: "hire-completion"
        }
      },

      "hire-completion": {
        progress: 100,
        dialogs: [
          "🎉 <span class='highlight'>Inquiry logged!</span> Krish has received your inquiry at <strong>krishruparel.career@gmail.com</strong>. You can also reach him directly at (682)-392-0214."
        ],
        choices: [
          { label: "📄 Open Printable Resume Modal", action: "open-resume-modal", primary: true },
          { label: "⚡ Explore Project Architectures", target: "projects-intro" },
          { label: "🔄 Start over", target: "greeting" }
        ]
      },

      // --- BRANCH: EXPLORE PROJECTS ---
      "projects-intro": {
        progress: 40,
        dialogs: [
          "Krish specializes in high-throughput RAG systems, agent observability, and multimodal models. Which project would you like to inspect?"
        ],
        choices: [
          { label: "1. VisionVault (Multimodal Video RAG)", target: "project-visionvault" },
          { label: "2. OrchestrAI (Agent Observability & Replay)", target: "project-orchestrai" },
          { label: "3. CarWise-AI (Gemini Search Grounding)", target: "project-carwise" },
          { label: "4. IEEE YOLOv8 Nutritional Vision Research", target: "project-yolo" },
          { label: "⬅ Back to start", target: "greeting" }
        ]
      },

      "project-visionvault": {
        progress: 60,
        dialogs: [
          "🎥 <strong>VisionVault</strong>: Combines Whisper transcription + video scene cues into time-aligned vectors in Qdrant/FAISS with cross-encoder reranking and LlamaIndex/Ollama synthesis for instant conversational video QA."
        ],
        choices: [
          { label: "🔬 Try Live RAG Demo in Showcase", action: "switch-to-showcase-demos", primary: true },
          { label: "View OrchestrAI next →", target: "project-orchestrai" },
          { label: "View CarWise-AI next →", target: "project-carwise" },
          { label: "⬅ Back to Projects", target: "projects-intro" }
        ]
      },

      "project-orchestrai": {
        progress: 60,
        dialogs: [
          "⚡ <strong>OrchestrAI</strong>: Local-first agent observability platform built with FastAPI, Postgres, Redis Pub/Sub, WebSockets, and Celery. Features 100% deterministic replay of multi-agent execution steps."
        ],
        choices: [
          { label: "📊 Try Live Agent Replay in Showcase", action: "switch-to-showcase-demos", primary: true },
          { label: "View VisionVault →", target: "project-visionvault" },
          { label: "View YOLOv8 Research →", target: "project-yolo" },
          { label: "⬅ Back to Projects", target: "projects-intro" }
        ]
      },

      "project-carwise": {
        progress: 60,
        dialogs: [
          "🚗 <strong>CarWise-AI</strong>: Uses Google Gemini's native Search Grounding to fetch live, verifiable marketplace listings and generate AI-driven pros, cons, and side-by-side comparison matrices."
        ],
        choices: [
          { label: "🔍 Try Live Comparison Grid in Showcase", action: "switch-to-showcase-demos", primary: true },
          { label: "View VisionVault →", target: "project-visionvault" },
          { label: "⬅ Back to Projects", target: "projects-intro" }
        ]
      },

      "project-yolo": {
        progress: 60,
        dialogs: [
          "📑 <strong>IEEE Research Paper</strong>: Benchmarked YOLOv8 against Faster R-CNN/SSD, created a 1,000-image Indian Food dataset achieving 82% recognition accuracy, and analyzed 3D volume estimation with stereo vision & SfM."
        ],
        choices: [
          { label: "💼 Discuss Research with Krish", target: "hire-intro", primary: true },
          { label: "View other projects →", target: "projects-intro" },
          { label: "⬅ Back to start", target: "greeting" }
        ]
      },

      // --- BRANCH: QUIZ / TEST KNOWLEDGE ---
      "quiz-intro": {
        progress: 40,
        dialogs: [
          "Ready for the technical challenge? Let's test your knowledge on Krish's core architectural domains!"
        ],
        choices: [
          { label: "🔥 Let's Start the 3-Question Quiz", target: "quiz-question", primary: true },
          { label: "⬅ Nevermind, back to start", target: "greeting" }
        ]
      },

      // --- BRANCH: RESUME & CREDENTIALS ---
      "resume-summary": {
        progress: 70,
        dialogs: [
          "🎓 <strong>Academic Highlights</strong>:<br>• <strong>UT Arlington (MS CS)</strong>: 3.84 / 4.0 GPA (Advanced Algorithms, AI, CV, Data Mining)<br>• <strong>Utrecht IT Consulting</strong>: Solace Pub/Sub connectors (+30% throughput)<br>• <strong>Micropro Solutions</strong>: Multimodal RAG with Qdrant & WebSockets"
        ],
        choices: [
          { label: "📄 Open Full Resume Modal", action: "open-resume-modal", primary: true },
          { label: "📋 Copy Email: krishruparel.career@gmail.com", action: "copy-email" },
          { label: "💼 Discuss an Opportunity", target: "hire-intro" },
          { label: "⬅ Back to start", target: "greeting" }
        ]
      },

      // --- BRANCH: DIRECT CONTACT ---
      "contact-direct": {
        progress: 80,
        dialogs: [
          "You can reach Krish instantly through any of the following channels:"
        ],
        choices: [
          { label: "📋 Copy Email: krishruparel.career@gmail.com", action: "copy-email", primary: true },
          { label: "📞 Phone: (682)-392-0214", action: "copy-phone" },
          { label: "💼 Leave a message here", target: "hire-intro" },
          { label: "⬅ Back to start", target: "greeting" }
        ]
      },

      // --- BRANCH: CASUAL BANTER ---
      "banter-intro": {
        progress: 50,
        dialogs: [
          "Fun fact: When Krish isn't benchmarking RAG pipelines or optimizing Solace pub/sub throughput, he's experimenting with computer vision volume estimators and exploring Dallas-Fort Worth. What else would you like to know?"
        ],
        choices: [
          { label: "What's Krish's favorite tech stack?", target: "banter-stack" },
          { label: "What drives Krish's engineering philosophy?", target: "banter-philosophy" },
          { label: "Take me to the Full Showcase", action: "switch-to-showcase", primary: true },
          { label: "⬅ Back to start", target: "greeting" }
        ]
      },

      "banter-stack": {
        progress: 65,
        dialogs: [
          "Python + FastAPI on the backend, Qdrant/FAISS for vector search, Docker + Redis for reliable streaming, and PyTorch / Hugging Face for model pipelines. Clean, decoupled, and built for sub-second scale."
        ],
        choices: [
          { label: "⚡ Explore Projects", target: "projects-intro", primary: true },
          { label: "⬅ Back to start", target: "greeting" }
        ]
      },

      "banter-philosophy": {
        progress: 65,
        dialogs: [
          "\"Build systems that fail gracefully, benchmark relentlessly with real data, and bridge the gap between bleeding-edge research and production reliability.\""
        ],
        choices: [
          { label: "💼 Hire or Work with Krish", target: "hire-intro", primary: true },
          { label: "⬅ Back to start", target: "greeting" }
        ]
      }
    };
  }

  init() {
    this.quizIndex = 0;
    this.quizScore = 0;

    // Initialize 3D Avatar
    try {
      this.avatar3D = new Assistant3DAvatar('assistant3dContainer');
    } catch (e) {
      console.warn('3D Avatar initialization error:', e);
    }

    // Initialize Voice Recognition & Chat Input
    this.initSpeechRecognition();
    this.initChatInput();

    this.renderStep('greeting');
    window.assistantEngine = this;
    window.assistant = this;
  }

  speakCurrentDialogue() {
    if (this.speechEl) {
      const plain = this.speechEl.innerText || this.speechEl.textContent;
      if (plain) this.speakText(plain);
    }
  }

  // --- Neural Studio High-Fidelity Female Voice Synthesizer ---
  // --- Exclusive Speechmatics Studio Neural Female Voice Synthesizer ---
  // --- Realistic Human Voice Synthesizer (Speechmatics Neural Voice "sarah") ---
  speakText(plainText, onComplete = null) {
    if (!plainText) {
      if (onComplete) onComplete();
      return;
    }

    // Clean text of HTML, entities, and markdown symbols
    const cleanText = plainText
      .replace(/<[^>]*>/g, ' ')
      .replace(/&bull;/g, ', ')
      .replace(/&amp;/g, ' and ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&[a-z]+;/g, ' ')
      .replace(/[*_#`~[\]()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      if (onComplete) onComplete();
      return;
    }

    // Stop any currently playing audio
    this.stopAllSpeech();

    // Fallback: Web Speech Synthesis (natural browser voice)
    const fallbackWebSpeech = () => {
      if (!('speechSynthesis' in window)) {
        this._isSpeakingQueue = false;
        if (this.avatar3D) this.avatar3D.stopSpeaking();
        audioVis.setSpeaking(false);
        if (onComplete) onComplete();
        return;
      }
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.02;
        utterance.pitch = 1.04;

        // Select the most natural female/English voice available
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => 
          (v.name.includes('Samantha') || v.name.includes('Victoria') || v.name.includes('Karen') || v.name.includes('Google US English') || v.name.includes('Zira') || v.name.includes('Natural') || v.name.includes('Female')) && v.lang.startsWith('en')
        ) || voices.find(v => v.lang.startsWith('en'));
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onstart = () => {
          if (this.avatar3D) this.avatar3D.startSpeaking();
          audioVis.setSpeaking(true);
        };
        utterance.onend = () => {
          this._isSpeakingQueue = false;
          if (this.avatar3D) this.avatar3D.stopSpeaking();
          audioVis.setSpeaking(false);
          if (onComplete) onComplete();
        };
        utterance.onerror = () => {
          this._isSpeakingQueue = false;
          if (this.avatar3D) this.avatar3D.stopSpeaking();
          audioVis.setSpeaking(false);
          if (onComplete) onComplete();
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('SpeechSynthesis error:', err);
        this._isSpeakingQueue = false;
        if (this.avatar3D) this.avatar3D.stopSpeaking();
        audioVis.setSpeaking(false);
        if (onComplete) onComplete();
      }
    };

    // Split text into natural sentence chunks (max 130 chars each) for Speechmatics
    const rawChunks = cleanText.match(/[^.!?]+[.!?]+|\S+/g) || [cleanText];
    const sentenceChunks = [];
    let currentChunk = "";

    for (const chunk of rawChunks) {
      if ((currentChunk + " " + chunk).length < 130) {
        currentChunk = currentChunk ? (currentChunk + " " + chunk) : chunk;
      } else {
        if (currentChunk) sentenceChunks.push(currentChunk.trim());
        currentChunk = chunk;
      }
    }
    if (currentChunk) sentenceChunks.push(currentChunk.trim());

    if (sentenceChunks.length === 0) {
      if (onComplete) onComplete();
      return;
    }

    // Realistic Speechmatics Neural Voice Audio Queue
    let currentIdx = 0;
    this._isSpeakingQueue = true;

    const playNextChunk = () => {
      if (!this._isSpeakingQueue || currentIdx >= sentenceChunks.length) {
        this._isSpeakingQueue = false;
        if (this.avatar3D) this.avatar3D.stopSpeaking();
        audioVis.setSpeaking(false);
        this._currentAudio = null;
        if (onComplete) onComplete();
        return;
      }

      const chunkText = sentenceChunks[currentIdx];
      currentIdx++;

      try {
        const speechmaticsUrl = `${API_BASE}/api/tts?voice=sarah&text=${encodeURIComponent(chunkText)}`;
        const audio = new Audio(speechmaticsUrl);
        this._currentAudio = audio;

        // Preload next chunk in background for seamless zero-gap playback
        if (currentIdx < sentenceChunks.length) {
          const nextSmUrl = `${API_BASE}/api/tts?voice=sarah&text=${encodeURIComponent(sentenceChunks[currentIdx])}`;
          const preloadAudio = new Audio(nextSmUrl);
          preloadAudio.preload = 'auto';
        }

        audio.onplay = () => {
          if (this.avatar3D) this.avatar3D.startSpeaking();
          audioVis.setSpeaking(true);
        };

        audio.onended = () => {
          playNextChunk();
        };

        audio.onerror = () => {
          // If Speechmatics fails, fallback to natural Web Speech API
          this._isSpeakingQueue = false;
          fallbackWebSpeech();
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            this._isSpeakingQueue = false;
            fallbackWebSpeech();
          });
        }
      } catch (e) {
        this._isSpeakingQueue = false;
        fallbackWebSpeech();
      }
    };

    playNextChunk();
  }

  stopAudio() {
    this.stopAllSpeech();
  }

  resetAssistant() {
    this.stopAudio();
    this.renderStep('greeting');
    if (this.avatar3D) this.avatar3D.playWave();
  }

  stopAllSpeech() {
    this._isSpeakingQueue = false;
    if (this._currentAudio) {
      try {
        this._currentAudio.pause();
        this._currentAudio.currentTime = 0;
      } catch (e) {}
      this._currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    if (this.avatar3D) this.avatar3D.stopSpeaking();
    audioVis.setSpeaking(false);
  }

  // --- Real-Time Live Voice Assistant Engine (Duplex & Streaming) ---
  // --- Real-Time Live Voice Assistant Engine (Instantaneous Zero-Latency Streaming) ---
  initSpeechRecognition() {
    this.isLiveVoiceMode = false;
    this.speechSilenceTimer = null;
    this.micAudioContext = null;
    this.micAnalyser = null;
    this.micStream = null;
    this.micAnimFrame = null;

    const hud = document.getElementById('liveVoiceHud');
    const hudStatus = document.getElementById('liveVoiceStatusText');
    const hudVu = document.getElementById('liveVoiceVu');

    const updateHud = (state, text) => {
      if (!hud) return;
      if (state === 'hidden') {
        hud.style.display = 'none';
        if (hudVu) hudVu.classList.remove('active');
        return;
      }
      hud.style.display = 'flex';
      if (hudStatus && text) hudStatus.textContent = text;
      if (hudVu) {
        if (state === 'listening' || state === 'speaking') {
          hudVu.classList.add('active');
        } else {
          hudVu.classList.remove('active');
        }
      }
    };

    // Real-time audio VU meter connected to microphone input
    const startMicAnalyser = (stream) => {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        if (this.micAudioContext) {
          try { this.micAudioContext.close(); } catch (e) {}
        }
        this.micAudioContext = new AudioContextClass();
        const source = this.micAudioContext.createMediaStreamSource(stream);
        this.micAnalyser = this.micAudioContext.createAnalyser();
        this.micAnalyser.fftSize = 64;
        this.micAnalyser.smoothingTimeConstant = 0.4;
        source.connect(this.micAnalyser);

        const vuBars = document.querySelectorAll('.live-voice-bars span');
        const dataArray = new Uint8Array(this.micAnalyser.frequencyBinCount);

        const renderVu = () => {
          if (!this.isListening || !this.micAnalyser) return;
          this.micAnalyser.getByteFrequencyData(dataArray);
          if (vuBars && vuBars.length > 0) {
            vuBars.forEach((bar, idx) => {
              const val = dataArray[idx % dataArray.length] || 0;
              const h = Math.min(24, Math.max(4, (val / 255) * 26));
              bar.style.height = `${h}px`;
            });
          }
          this.micAnimFrame = requestAnimationFrame(renderVu);
        };
        renderVu();
      } catch (err) {
        console.warn('Microphone VU visualizer error:', err);
      }
    };

    const stopMicAnalyser = () => {
      if (this.micAnimFrame) {
        cancelAnimationFrame(this.micAnimFrame);
        this.micAnimFrame = null;
      }
      if (this.micAudioContext) {
        try { this.micAudioContext.close(); } catch (e) {}
        this.micAudioContext = null;
      }
      this.micAnalyser = null;
      const vuBars = document.querySelectorAll('.live-voice-bars span');
      if (vuBars) {
        vuBars.forEach(b => b.style.height = '');
      }
    };

    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;

    const setupRecognition = () => {
      if (!SpeechRecognitionClass) return null;
      try {
        const sr = new SpeechRecognitionClass();
        sr.continuous = true;
        sr.interimResults = true;
        sr.lang = 'en-US';

        sr.onstart = () => {
          this.isListening = true;
          if (this.micBtn) {
            this.micBtn.classList.add('recording');
            this.micBtn.title = 'Live Voice Mode: Active (Click to stop)';
          }
          if (this.queryInput) {
            this.queryInput.placeholder = '🎙️ Listening... Speak naturally';
          }
          updateHud('listening', '🎙️ Live Voice: Listening in Real-Time...');
          audioVis.playChime();
        };

        sr.onresult = (event) => {
          // Barge-in: immediately cancel speech if user starts talking
          this.stopAllSpeech();

          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = 0; i < event.results.length; ++i) {
            const res = event.results[i];
            if (res.isFinal) {
              finalTranscript += res[0].transcript + ' ';
            } else {
              interimTranscript += res[0].transcript;
            }
          }

          const currentText = (finalTranscript + interimTranscript).trim();
          if (currentText && this.queryInput) {
            this.queryInput.value = currentText;
          }

          // Real-time silence detector (750ms natural pause triggers immediate answer)
          if (this.speechSilenceTimer) clearTimeout(this.speechSilenceTimer);
          if (currentText.length > 2) {
            this.speechSilenceTimer = setTimeout(() => {
              const fullQuery = (this.queryInput ? this.queryInput.value : currentText).trim();
              if (fullQuery.length > 1) {
                updateHud('thinking', '🧠 K.R.I.S.H. Synthesizing Answer...');
                try { sr.stop(); } catch (e) {}
                stopMicAnalyser();
                this.handleUserQuestion(fullQuery, () => {
                  // After speaking answer, if still in Live Voice mode, seamlessly resume listening
                  if (this.isLiveVoiceMode) {
                    if (this.queryInput) this.queryInput.value = '';
                    try {
                      sr.start();
                      if (this.micStream) startMicAnalyser(this.micStream);
                    } catch (e) {}
                  }
                });
              }
            }, 750);
          }
        };

        sr.onerror = (e) => {
          console.warn('Speech recognition error:', e.error);
          if (e.error === 'no-speech' || e.error === 'aborted') {
            return;
          }
          this.isListening = false;
          stopMicAnalyser();
          if (this.micBtn) this.micBtn.classList.remove('recording');
          if (this.queryInput) {
            this.queryInput.placeholder = 'Ask me anything: RAG stack, GPA, IEEE paper, hiring...';
          }

          if (e.error === 'not-allowed') {
            updateHud('error', '⚠️ Microphone access blocked. Please allow mic in browser URL bar.');
            window.showToast?.('⚠️ Microphone access blocked. Please allow microphone in browser URL bar.');
          }
        };

        sr.onend = () => {
          this.isListening = false;
          stopMicAnalyser();
          if (!this.isLiveVoiceMode) {
            if (this.micBtn) this.micBtn.classList.remove('recording');
            if (this.queryInput) {
              this.queryInput.placeholder = 'Ask me anything: RAG stack, GPA, IEEE paper, hiring...';
            }
            updateHud('hidden');
          }
        };

        return sr;
      } catch (err) {
        console.warn('Speech recognition creation error:', err);
        return null;
      }
    };

    this.speechRecognition = setupRecognition();

    if (this.micBtn) {
      this.micBtn.addEventListener('click', async () => {
        // Auto-enable audio visualizer & voice
        if (!audioVis.soundEnabled) {
          audioVis.toggleSound();
        }

        if (this.isListening || this.isLiveVoiceMode) {
          // Toggle off
          this.isLiveVoiceMode = false;
          this.isListening = false;
          if (this.speechSilenceTimer) clearTimeout(this.speechSilenceTimer);
          if (this.micBtn) this.micBtn.classList.remove('recording');
          if (this.speechRecognition) {
            try { this.speechRecognition.stop(); } catch (e) {}
          }
          stopMicAnalyser();
          if (this.micStream) {
            try {
              this.micStream.getTracks().forEach(t => t.stop());
              this.micStream = null;
            } catch (e) {}
          }
          updateHud('hidden');
          window.showToast?.('⏹️ Live Voice Mode Stopped');
        } else {
          // Toggle on: Stop any playing audio to prevent acoustic feedback
          this.stopAllSpeech();
          this.isLiveVoiceMode = true;
          if (this.micBtn) this.micBtn.classList.add('recording');
          updateHud('listening', '🎙️ Live Voice: Listening in Real-Time...');

          // 1. Proactively request hardware microphone permission
          try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
              this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
              startMicAnalyser(this.micStream);
            }
          } catch (permErr) {
            console.warn('Microphone permission blocked:', permErr);
            this.isLiveVoiceMode = false;
            if (this.micBtn) this.micBtn.classList.remove('recording');
            updateHud('error', '⚠️ Microphone blocked. Click URL lock icon to allow.');
            window.showToast?.('⚠️ Microphone access blocked. Please allow microphone permission in browser URL bar.');
            return;
          }

          // 2. Start streaming recognition immediately (0ms delay)
          if (!this.speechRecognition) {
            this.speechRecognition = setupRecognition();
          }

          if (this.speechRecognition) {
            if (this.queryInput) this.queryInput.value = '';
            try {
              this.speechRecognition.start();
            } catch (e) {
              console.warn('Speech recognition start error:', e);
              try {
                this.speechRecognition.stop();
                setTimeout(() => {
                  if (this.speechRecognition) this.speechRecognition.start();
                }, 50);
              } catch (retryErr) {}
            }
          } else {
            this.isLiveVoiceMode = false;
            if (this.micBtn) this.micBtn.classList.remove('recording');
            updateHud('error', '🎙️ Speech recognition not supported. Try Chrome or Safari.');
            window.showToast?.('💡 Speech recognition works best in Chrome or Safari. You can also click any prompt below!');
          }
        }
      });
    }
  }

  // --- LiveKit WebRTC Real-Time Full-Duplex Voice Agent Client ---
  async connectLiveKit(updateHud) {
    if (!window.LivekitClient) return false;
    try {
      // 1. Proactively request hardware microphone permission
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const testStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          testStream.getTracks().forEach(t => t.stop());
        }
      } catch (permErr) {
        console.warn('Microphone permission blocked:', permErr);
        if (updateHud) updateHud('error', '⚠️ Microphone blocked. Click browser lock to allow.');
        window.showToast?.('⚠️ Microphone access blocked. Please allow mic access in your browser.');
        return false;
      }

      // 2. Fetch fresh LiveKit participant token
      const res = await fetch(`${API_BASE}/api/token`, { signal: AbortSignal.timeout(2000) });
      if (!res.ok) return false;
      const data = await res.json();

      // 3. Clean up previous room if open
      if (this.livekitRoom) {
        try { await this.livekitRoom.disconnect(); } catch (e) {}
        this.livekitRoom = null;
      }

      this.livekitRoom = new window.LivekitClient.Room({
        adaptiveStream: true,
        dynacast: true,
        audioCaptureDefaults: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

      this.livekitRoom.on(window.LivekitClient.RoomEvent.TrackSubscribed, (track) => {
        if (track.kind === window.LivekitClient.Track.Kind.Audio) {
          const audioElement = track.attach();
          audioElement.autoplay = true;
          audioElement.onplay = () => {
            if (this.avatar3D) this.avatar3D.startSpeaking();
            audioVis.setSpeaking(true);
            if (updateHud) updateHud('speaking', '🔊 K.R.I.S.H. Speaking (Speechmatics Sarah)');
          };
          audioElement.onended = () => {
            if (this.avatar3D) this.avatar3D.stopSpeaking();
            audioVis.setSpeaking(false);
            if (updateHud) updateHud('listening', '🔴 Real-Time WebRTC Active... Speak naturally');
          };
        }
      });

      this.livekitRoom.on(window.LivekitClient.RoomEvent.Disconnected, () => {
        this.isLiveKitConnected = false;
        if (this.micBtn) this.micBtn.classList.remove('recording');
        if (this.queryInput) this.queryInput.placeholder = 'Ask me anything: RAG stack, GPA, IEEE paper, hiring...';
        if (updateHud) updateHud('hidden');
      });

      await this.livekitRoom.connect(data.url, data.token);
      await this.livekitRoom.localParticipant.setMicrophoneEnabled(true);
      this.isLiveKitConnected = true;
      return true;
    } catch (e) {
      console.warn('LiveKit connection error:', e);
      return false;
    }
  }

  // --- Freeform AI Question Input Bar & Emotes ---
  initChatInput() {
    if (this.sendBtn && this.queryInput) {
      this.sendBtn.addEventListener('click', () => {
        const query = this.queryInput.value.trim();
        if (query) this.handleUserQuestion(query);
      });

      this.queryInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const query = this.queryInput.value.trim();
          if (query) this.handleUserQuestion(query);
        }
      });
    }

    // Prompt pills click handlers
    document.querySelectorAll('.assistant-prompt-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const query = pill.getAttribute('data-prompt');
        if (this.queryInput) this.queryInput.value = query;
        this.handleUserQuestion(query);
      });
    });

    // Natural Animation Emote Buttons
    const btnWave = document.getElementById('btnWave');
    if (btnWave) btnWave.addEventListener('click', () => {
      if (this.avatar3D) this.avatar3D.playWave();
    });

    const btnSalute = document.getElementById('btnSalute');
    if (btnSalute) btnSalute.addEventListener('click', () => {
      if (this.avatar3D) this.avatar3D.playSalute();
    });

    const btnCheer = document.getElementById('btnCheer');
    if (btnCheer) btnCheer.addEventListener('click', () => {
      if (this.avatar3D) this.avatar3D.playCheer();
    });

    // Interactive 3D AI Host badge click
    const hostBadge = document.querySelector('.assistant-badge');
    if (hostBadge) {
      hostBadge.addEventListener('click', () => {
        audioVis.playChime();
        if (this.avatar3D) this.avatar3D.playWave();
        if (this.queryInput) this.queryInput.focus();
        window.showToast?.('🤖 K.R.I.S.H. 3D AI Host is ready! Type or click any prompt.');
      });
    }
  }

  // --- Intelligent Knowledge Base & AI NLP Conversational Engine ---
  handleUserQuestion(queryText, onSpoken = null) {
    if (!queryText) return;
    const rawQ = queryText.trim();
    const q = rawQ.toLowerCase();
    audioVis.playBeep();

    let answerHtml = "";
    let plainSpeech = "";
    let followUpChoices = [];
    let gesture = null;

    // Helper: Checks if query contains any of the words/phrases
    const has = (...keywords) => keywords.some(k => q.includes(k));

    // 1. IDENTITY & PERSONA ("Who are you", "What is KRISH", "What can you do")
    if (has('who are you', 'what are you', 'your name', 'introduce yourself', 'what is k.r.i.s.h', 'what is krish host', 'are you a bot', 'are you real', 'who made you', 'who built you', 'what can you do', 'help', 'capabilities')) {
      gesture = 'wave';
      answerHtml = `🤖 <strong>I am K.R.I.S.H.</strong> — Krish's <em>Responsive Intelligent Software Host</em>!<br><br>I'm an interactive 3D AI assistant built to guide you through Krish's engineering portfolio. You can ask me anything about his <strong>multimodal RAG systems, 3.84 MS CS GPA at UT Arlington, Solace event streaming experience, published IEEE research</strong>, or ask me to perform robot gestures (wave, salute, cheer)!`;
      plainSpeech = `I am K.R.I.S.H., Krish's Responsive Intelligent Software Host. I'm an interactive 3D AI assistant built to guide you through Krish's portfolio. You can ask me anything about his multimodal RAG systems, his MS CS GPA at UT Arlington, his Solace streaming experience, or his IEEE research.`;
      followUpChoices = [
        { label: "⚡ Explore Featured Projects", target: "projects-intro", primary: true },
        { label: "💼 Why Hire Krish?", target: "hire-intro" },
        { label: "📜 View Full Resume", action: "open-resume-modal" }
      ];
    }

    // 2. ABOUT KRISH ("Who is Krish", "Tell me about yourself", "Background", "Bio")
    else if (has('who is krish', 'tell me about krish', 'about krish', 'bio', 'background', 'overview', 'summary', 'about yourself', 'tell me about yourself', 'introduction')) {
      gesture = 'salute';
      answerHtml = `👨‍💻 <strong>Krish Ruparel</strong> is an <strong>AI Engineer &amp; Distributed Systems Architect</strong> pursuing his Master of Science in Computer Science at <strong>UT Arlington (3.84 GPA)</strong>.<br><br>He has deployed production multimodal RAG pipelines over Qdrant &amp; FAISS, boosted event throughput by <strong>+30% using Solace pub/sub</strong> at Utrecht IT Consulting, and co-authored a published <strong>IEEE research paper</strong> on YOLOv8 computer vision.`;
      plainSpeech = `Krish Ruparel is an AI Engineer and Distributed Systems Architect pursuing his Master of Science in Computer Science at UT Arlington with a three point eight four GPA. He specializes in multimodal RAG pipelines, agent observability, and distributed systems.`;
      followUpChoices = [
        { label: "⚡ View Featured Projects", target: "projects-intro", primary: true },
        { label: "💼 Inquire to Hire Krish", target: "hire-intro" },
        { label: "📄 Open Full Resume", action: "open-resume-modal" }
      ];
    }

    // 3. WHY HIRE KRISH / STRENGTHS ("Why should we hire you", "Strengths", "Standout")
    else if (has('why hire', 'why should i hire', 'why should we hire', 'strengths', 'unique', 'standout', 'greatest achievement', 'value', 'why you', 'why him')) {
      gesture = 'cheer';
      answerHtml = `🌟 <strong>Top 3 Reasons to Hire Krish Ruparel</strong>:<br><br>1. 🚀 <strong>Proven Production Impact</strong>: Engineered custom Solace pub/sub connectors boosting event throughput by 30% at Utrecht IT Consulting.<br>2. 🧠 <strong>Deep Multimodal AI &amp; Systems Rigor</strong>: Built VisionVault (video RAG) and OrchestrAI (agent tracing with sub-10ms latency).<br>3. 📚 <strong>Academic &amp; Research Excellence</strong>: 3.84 MS CS GPA at UT Arlington and published IEEE computer vision research.`;
      plainSpeech = `Here is why you should hire Krish: First, proven production impact with a thirty percent event throughput boost using Solace pub/sub. Second, deep hands-on expertise building multimodal RAG and agent observability systems. And third, academic excellence with a three point eight four MS CS GPA and published IEEE research.`;
      followUpChoices = [
        { label: "💼 Start Hiring Conversation", target: "hire-intro", primary: true },
        { label: "⚡ Explore Featured Projects", target: "projects-intro" },
        { label: "📋 Copy Krish's Email", action: "copy-email" }
      ];
    }

    // 4. VISIONVAULT / MULTIMODAL VIDEO RAG
    else if (has('visionvault', 'video rag', 'multimodal rag', 'video search', 'whisper', 'frame captioning', 'qdrant', 'cross-encoder')) {
      gesture = 'salute';
      answerHtml = `🎥 <strong>VisionVault</strong> is Krish's multimodal video RAG pipeline &amp; semantic search engine!<br><br>• Transcribes video audio using <strong>Whisper</strong> and captions keyframes.<br>• Aligns multimodal cues into searchable vector chunks indexed in <strong>Qdrant &amp; FAISS</strong>.<br>• Applies <strong>cross-encoder reranking</strong> to achieve sub-second retrieval precision for conversational video QA.`;
      plainSpeech = `VisionVault is Krish's multimodal video RAG pipeline. It transcribes audio using Whisper and captions frames, indexing time-aligned vectors in Qdrant and FAISS with cross-encoder reranking for sub-second conversational video search.`;
      followUpChoices = [
        { label: "🔬 Try Live Video RAG Demo", action: "switch-to-showcase-demos", primary: true },
        { label: "View OrchestrAI project", target: "project-orchestrai" },
        { label: "💼 Hire Krish", target: "hire-intro" }
      ];
    }

    // 5. ORCHESTRAI / AGENT OBSERVABILITY & DETERMINISTIC REPLAY
    else if (has('orchestrai', 'observability', 'replay', 'deterministic', 'agent trace', 'tracing', 'telemetry', 'redis pub', 'opentelemetry')) {
      gesture = 'salute';
      answerHtml = `⚡ <strong>OrchestrAI</strong> is an agent observability platform Krish built using <strong>FastAPI, Postgres, Redis Pub/Sub, WebSockets, and Celery</strong>.<br><br>• Streams live AI agent runs with <strong>sub-10ms latency</strong>.<br>• Enables <strong>100% deterministic offline replay</strong> and regression evaluation.<br>• Fully instrumented with OpenTelemetry and containerized via Docker Compose.`;
      plainSpeech = `OrchestrAI is Krish's agent observability platform built with FastAPI, Postgres, Redis Pub/Sub, and WebSockets. It records agent execution steps with sub-ten millisecond latency and enables deterministic replay.`;
      followUpChoices = [
        { label: "📊 Try Live Agent Replay Demo", action: "switch-to-showcase-demos", primary: true },
        { label: "View CarWise-AI", target: "project-carwise" },
        { label: "💼 Hire Krish", target: "hire-intro" }
      ];
    }

    // 6. CARWISE-AI / GEMINI SEARCH GROUNDING
    else if (has('carwise', 'car', 'gemini', 'grounding', 'search grounding', 'hallucination', 'pros and cons')) {
      gesture = 'salute';
      answerHtml = `🚗 <strong>CarWise-AI</strong> is an automotive discovery assistant powered by <strong>Google Gemini API with native Search Grounding</strong>.<br><br>• Fetches real-time, verified vehicle marketplace listings directly from live web sources to eliminate hallucinations.<br>• Auto-generates AI pros, cons, and side-by-side spec comparison matrices.`;
      plainSpeech = `CarWise-AI uses Google Gemini's native Search Grounding to eliminate hallucinations and stream verified real-time car listings with pros and cons.`;
      followUpChoices = [
        { label: "🔍 View Comparison Grid", action: "switch-to-showcase-demos", primary: true },
        { label: "⚡ Explore All Projects", target: "projects-intro" }
      ];
    }

    // 7. IEEE RESEARCH PAPER / YOLOV8 / COMPUTER VISION
    else if (has('ieee', 'paper', 'research', 'yolo', 'yolov8', 'food', 'volume', '3d volume', 'publication', 'journal')) {
      gesture = 'salute';
      answerHtml = `📑 <strong>IEEE Research Publication</strong>:<br><em>"Reviewing Advances in Food Image Recognition and Nutritional Assessment: Focus on YOLOv8"</em><br><br>• Co-authored a peer-reviewed research paper benchmarked in an <strong>IEEE Journal</strong>.<br>• Built a custom 1,000-image Indian Food dataset achieving <strong>82% recognition accuracy</strong>.<br>• Analyzed 3D volume estimation using stereo vision and Structure from Motion (SfM).`;
      plainSpeech = `Krish co-authored a peer-reviewed IEEE research paper benchmarking YOLOv8 on food recognition and 3D volume estimation, creating a custom one thousand image benchmark with eighty-two percent accuracy.`;
      followUpChoices = [
        { label: "💼 Discuss Research with Krish", target: "hire-intro", primary: true },
        { label: "📜 Open Full Resume", action: "open-resume-modal" }
      ];
    }

    // 8. WORK EXPERIENCE (UTRECHT IT CONSULTING & MICROPRO SOLUTIONS)
    else if (has('experience', 'work', 'job history', 'career', 'utrecht', 'netherlands', 'micropro', 'solace', 'workato', 'internship')) {
      gesture = 'salute';
      answerHtml = `💼 <strong>Professional Work Experience</strong>:<br><br>• 🇳🇱 <strong>Utrecht IT Consulting (Netherlands)</strong>: Automation &amp; Integration Consultant (2024–2025). Engineered Solace pub/sub SDK connectors (+30% throughput), built Workato AI agents, and deployed 3 mission-critical pipelines.<br>• 🇮🇳 <strong>Micropro Solutions (India)</strong>: AI Engineering Intern (2024). Deployed multimodal video RAG with Qdrant/FAISS, cross-encoders, and OpenTelemetry.`;
      plainSpeech = `Krish worked as an Automation and Integration Consultant at Utrecht IT Consulting in the Netherlands, boosting event throughput by thirty percent using Solace pub/sub, and as an AI intern at Micropro Solutions building multimodal RAG with Qdrant.`;
      followUpChoices = [
        { label: "💼 Inquire for Fall 2026 / Spring 2027", target: "hire-intro", primary: true },
        { label: "📜 View Experience in Showcase", action: "switch-to-showcase" }
      ];
    }

    // 9. EDUCATION, GPA & UNIVERSITY
    else if (has('gpa', 'education', 'university', 'college', 'uta', 'arlington', 'pune', 'degree', 'masters', 'bachelors', 'academics', 'grades', 'coursework')) {
      gesture = 'salute';
      answerHtml = `🎓 <strong>Academic Credentials</strong>:<br><br>• 🇺🇸 <strong>University of Texas at Arlington</strong>: Master of Science in Computer Science (GPA: <strong>3.84 / 4.0</strong>, Aug 2025 – May 2027)<br><em>Coursework:</em> Advanced Algorithms, Data Mining, Artificial Intelligence, Computer Vision.<br><br>• 🇮🇳 <strong>University of Pune</strong>: Bachelor of Engineering in Computer Engineering (GPA: <strong>3.4 / 4.0</strong>, 2021 – 2025)`;
      plainSpeech = `Krish is pursuing his Master of Science in Computer Science at UT Arlington with a three point eight four GPA, and earned his Bachelor's in Computer Engineering from University of Pune with a three point four GPA.`;
      followUpChoices = [
        { label: "📄 Open Full Resume", action: "open-resume-modal", primary: true },
        { label: "💼 Hire Krish", target: "hire-intro" }
      ];
    }

    // 10. LOCATION & RELOCATION ("Where are you located", "Where does Krish live", "Relocate")
    else if (has('location', 'where is krish', 'where are you', 'where do you live', 'relocate', 'relocation', 'dallas', 'texas', 'remote', 'hybrid', 'on-site', 'city')) {
      gesture = 'salute';
      answerHtml = `📍 <strong>Location &amp; Mobility</strong>:<br><br>Krish is currently based in <strong>Arlington, Texas (Dallas–Fort Worth area)</strong>.<br><br>✈️ He is <strong>100% open to relocate anywhere across the United States</strong> for on-site, hybrid, or remote positions!`;
      plainSpeech = `Krish is currently based in Arlington, Texas in the Dallas Fort Worth area, and is fully open to relocate across the United States for on-site, hybrid, or remote roles.`;
      followUpChoices = [
        { label: "💼 Discuss Roles with Krish", target: "hire-intro", primary: true },
        { label: "📋 Copy Krish's Email", action: "copy-email" }
      ];
    }

    // 11. HIRING, ROLES & AVAILABILITY ("Are you available", "Visa status", "Internship")
    else if (has('hire', 'available', 'availability', 'fall 2026', 'spring 2027', 'roles', 'open to', 'visa', 'sponsorship', 'interview', 'start date', 'full time', 'intern', 'coop', 'co-op')) {
      gesture = 'cheer';
      answerHtml = `🚀 <strong>Hiring &amp; Availability Status</strong>:<br><br>Krish is <strong>actively interviewing for Fall 2026 and Spring 2027 roles</strong>!<br><br>• <strong>Target Roles:</strong> AI Engineer, Machine Learning Engineer, Backend / Distributed Systems Engineer, Full-Stack AI Engineer.<br>• <strong>Location:</strong> Open to On-site (US Relocation), Hybrid, or Remote.<br>• <strong>Ready to interview immediately!</strong>`;
      plainSpeech = `Krish is actively open and available for Fall 2026 and Spring 2027 roles across AI engineering, machine learning, and distributed systems, and is ready to interview immediately.`;
      followUpChoices = [
        { label: "💼 Submit Hiring Inquiry", target: "hire-intro", primary: true },
        { label: "📋 Copy Email", action: "copy-email" },
        { label: "📜 View Full Resume", action: "open-resume-modal" }
      ];
    }

    // 12. CONTACT INFO ("How do I reach Krish", "Email", "Phone", "LinkedIn", "GitHub")
    else if (has('contact', 'email', 'phone', 'reach', 'linkedin', 'github', 'call', 'connect', 'message', 'address')) {
      gesture = 'wave';
      answerHtml = `📬 <strong>Get in Touch with Krish Ruparel</strong>:<br><br>• 📧 Email: <a href='mailto:krishruparel.career@gmail.com' class='highlight'>krishruparel.career@gmail.com</a><br>• 📞 Phone: <strong>(682)-392-0214</strong><br>• 📍 Location: Arlington, Texas (Open to Relocate)<br>• 💼 LinkedIn: <a href='https://www.linkedin.com/in/krishruparel21/' target='_blank' class='highlight'>linkedin.com/in/krishruparel21 ↗</a><br>• 🐙 GitHub: <a href='https://github.com/Krishr21' target='_blank' class='highlight'>github.com/Krishr21 ↗</a>`;
      plainSpeech = `You can reach Krish directly by email at krishruparel dot career at gmail dot com, or connect on LinkedIn at linkedin dot com slash in slash krishruparel21 and GitHub at github dot com slash Krishr21.`;
      followUpChoices = [
        { label: "📋 Copy Email", action: "copy-email", primary: true },
        { label: "📞 Copy Phone", action: "copy-phone" },
        { label: "💼 Submit Inquiry Form", target: "hire-intro" }
      ];
    }

    // 13. FULL TECH STACK & SKILLS
    else if (has('skill', 'tech stack', 'technology', 'tools', 'languages', 'frameworks', 'programming', 'stack')) {
      gesture = 'salute';
      answerHtml = `🛠 <strong>Technical Skills Matrix</strong>:<br><br>• <strong>Languages:</strong> Python, C++, JavaScript (ES6+), SQL, Java, R<br>• <strong>AI &amp; ML:</strong> Multimodal RAG, Qdrant, FAISS, PyTorch, LlamaIndex, LangChain, YOLOv8, OpenCV<br>• <strong>Backend &amp; Cloud:</strong> FastAPI, Docker, Redis Pub/Sub, WebSockets, Celery, AWS, GCP, Solace<br>• <strong>Databases:</strong> PostgreSQL, MongoDB, DynamoDB, Apache Spark`;
      plainSpeech = `Krish's core technical stack spans Python, FastAPI, PyTorch, Qdrant, Docker, Redis Pub/Sub, PostgreSQL, and distributed streaming with Solace and Celery.`;
      followUpChoices = [
        { label: "⚡ Explore Projects", target: "projects-intro", primary: true },
        { label: "📜 View Skills in Showcase", action: "switch-to-showcase" }
      ];
    }

    // 14. SPECIFIC TECH INQUIRIES (Python, PyTorch, Docker, Redis, C++, SQL, React, etc.)
    else if (has('python', 'pytorch', 'docker', 'redis', 'fastapi', 'c++', 'sql', 'spark', 'aws', 'gcp', 'celery', 'solace', 'mongodb', 'postgres', 'langchain', 'llamaindex')) {
      gesture = 'salute';
      let matchingSkills = [];
      if (has('python')) matchingSkills.push("<strong>Python</strong>: Krish's primary production language for FastAPI backends, asynchronous RAG pipelines, and PyTorch models.");
      if (has('pytorch')) matchingSkills.push("<strong>PyTorch</strong>: Used for deep learning model training, computer vision embeddings, and YOLOv8 fine-tuning.");
      if (has('docker')) matchingSkills.push("<strong>Docker &amp; Compose</strong>: Production containerization across VisionVault and OrchestrAI with multi-stage builds.");
      if (has('redis')) matchingSkills.push("<strong>Redis Pub/Sub</strong>: High-throughput real-time message brokering and live WebSocket streaming in OrchestrAI.");
      if (has('fastapi')) matchingSkills.push("<strong>FastAPI</strong>: High-performance asynchronous REST and WebSocket API architecture.");
      if (has('c++')) matchingSkills.push("<strong>C++</strong>: High-efficiency algorithmic systems, data structures, and computer vision preprocessing.");
      if (has('sql', 'postgres')) matchingSkills.push("<strong>PostgreSQL &amp; SQL</strong>: Relational schema design, index optimization, and Alembic database migrations.");
      if (has('solace')) matchingSkills.push("<strong>Solace Messaging</strong>: Engineered custom pub/sub SDK connectors boosting throughput by +30% at Utrecht IT Consulting.");

      answerHtml = `💡 <strong>Krish's Hands-on Technology Experience</strong>:<br><br>` + matchingSkills.join('<br><br>');
      plainSpeech = `Yes! Krish has extensive production experience with those technologies across his projects and work at Utrecht IT Consulting and Micropro Solutions.`;
      followUpChoices = [
        { label: "⚡ Explore Projects", target: "projects-intro", primary: true },
        { label: "📜 Open Full Resume", action: "open-resume-modal" }
      ];
    }

    // 15. ROBOT GESTURE COMMANDS ("Wave", "Salute", "Cheer", "Dance")
    else if (has('wave', 'salute', 'cheer', 'celebrate', 'dance', 'arms', 'move')) {
      if (has('wave')) {
        gesture = 'wave';
        answerHtml = `👋 *Waving back at you!* I have full dual-arm articulation with independent shoulder and elbow kinematics!`;
        plainSpeech = `Waving back at you! My 3D skeleton features independent shoulder and elbow kinematics.`;
      } else if (has('salute')) {
        gesture = 'salute';
        answerHtml = `🫡 *Saluting on command!* Ready to assist you with Krish's engineering credentials and project demos.`;
        plainSpeech = `Saluting on command! Ready to assist you with Krish's engineering credentials.`;
      } else {
        gesture = 'cheer';
        answerHtml = `✨ *Two-handed celebration cheer!* Both arms pumping high with rhythmic body bouncing!`;
        plainSpeech = `Two-handed celebration cheer! Both arms pumping high in the air.`;
      }
      followUpChoices = [
        { label: "⚡ Explore Featured Projects", target: "projects-intro", primary: true },
        { label: "💼 Inquire to Hire Krish", target: "hire-intro" }
      ];
    }

    // 16. CHITCHAT & BANTER ("Hello", "Hi", "How are you", "Joke", "Thanks")
    else if (has('hello', 'hi', 'hey', 'good morning', 'good evening', 'howdy', 'sup', 'yo')) {
      gesture = 'wave';
      answerHtml = `👋 <strong>Hello there!</strong> Wonderful to meet you! I'm K.R.I.S.H., your 3D host. What would you like to explore about Krish's background today?`;
      plainSpeech = `Hello there! Wonderful to meet you! What would you like to explore about Krish's background today?`;
      followUpChoices = [
        { label: "⚡ Explore Featured Projects", target: "projects-intro", primary: true },
        { label: "💼 Why Hire Krish?", target: "hire-intro" },
        { label: "📜 View Full Resume", action: "open-resume-modal" }
      ];
    } else if (has('how are you', 'how do you feel', 'whats up', "what's up")) {
      gesture = 'cheer';
      answerHtml = `⚡ <strong>All systems optimal and neural weights fully calibrated!</strong> Ready to showcase Krish's projects, RAG architectures, and resume credentials.`;
      plainSpeech = `All systems optimal and neural weights fully calibrated! Ready to showcase Krish's projects and resume.`;
      followUpChoices = [
        { label: "⚡ Explore Featured Projects", target: "projects-intro", primary: true },
        { label: "🧠 Test Krish's AI Knowledge", action: "start-quiz" }
      ];
    } else if (has('joke', 'funny', 'humor', 'laugh')) {
      gesture = 'cheer';
      answerHtml = `😄 <em>Why do programmers prefer dark mode?</em><br>...Because light attracts bugs! 🐛<br><br><em>And why did the AI robot go to school?</em><br>...To improve its classification! 🤖`;
      plainSpeech = `Why do programmers prefer dark mode? Because light attracts bugs! And why did the AI robot go to school? To improve its classification!`;
      followUpChoices = [
        { label: "🧠 Test Krish's AI Knowledge (Quiz)", action: "start-quiz", primary: true },
        { label: "⚡ Explore Featured Projects", target: "projects-intro" }
      ];
    } else if (has('thank', 'thanks', 'appreciate', 'good job', 'awesome', 'cool', 'great', 'nice')) {
      gesture = 'cheer';
      answerHtml = `✨ <strong>You're very welcome!</strong> It's my pleasure assisting you. Feel free to explore Krish's projects or reach out directly to him!`;
      plainSpeech = `You're very welcome! Feel free to explore Krish's projects or reach out directly to him.`;
      followUpChoices = [
        { label: "💼 Hire Krish", target: "hire-intro", primary: true },
        { label: "⚡ Explore Projects", target: "projects-intro" }
      ];
    }

    // 17. INTELLIGENT FALLBACK SYNTHESIZER
    else {
      gesture = 'salute';
      answerHtml = `💡 <em>"${rawQ}"</em><br><br>Krish Ruparel is an <strong>AI Engineer &amp; Distributed Systems Architect</strong> pursuing his MS CS at <strong>UT Arlington (3.84 GPA)</strong>. He specializes in <strong>multimodal RAG pipelines (VisionVault)</strong>, <strong>agent observability (OrchestrAI)</strong>, <strong>Solace event streaming (+30% throughput)</strong>, and published <strong>IEEE computer vision research</strong>.<br><br>What specific topic would you like to explore?`;
      plainSpeech = `Regarding ${rawQ}: Krish Ruparel specializes in multimodal RAG pipelines, agent observability, high-throughput distributed systems, and published IEEE computer vision research. Here are some key areas to explore.`;
      followUpChoices = [
        { label: "⚡ Explore Featured Projects", target: "projects-intro", primary: true },
        { label: "💼 Why Hire Krish?", target: "hire-intro" },
        { label: "📜 View Full Resume", action: "open-resume-modal" },
        { label: "⬅ Back to Start", target: "greeting" }
      ];
    }

    // Trigger gesture
    if (gesture === 'wave' && this.avatar3D) this.avatar3D.playWave();
    else if (gesture === 'salute' && this.avatar3D) this.avatar3D.playSalute();
    else if (gesture === 'cheer' && this.avatar3D) this.avatar3D.playCheer();

    // Render Answer and Speak
    this.typewrite(answerHtml, () => {
      this.renderChoices(followUpChoices);
    });

    if (audioVis.soundEnabled) {
      this.speakText(plainSpeech, onSpoken);
    } else {
      if (onSpoken) onSpoken();
    }
  }

  renderStep(stepKey, extraData = {}) {
    this.currentStep = stepKey;
    audioVis.playClick();

    if (stepKey === 'quiz-question') {
      this.renderQuizQuestion();
      return;
    }

    const step = this.dialogTree[stepKey];
    if (!step) return;

    if (this.progressBar) {
      this.progressBar.style.width = `${step.progress}%`;
    }

    const dialogText = Array.isArray(step.dialogs)
      ? step.dialogs[Math.floor(Math.random() * step.dialogs.length)]
      : step.dialogs;

    this.typewrite(dialogText, () => {
      this.renderChoices(step.choices, step.form);
    });

    // Voice vocalization if audio enabled
    if (audioVis.soundEnabled) {
      const plain = dialogText.replace(/<[^>]*>?/gm, '');
      this.speakText(plain);
    }
  }

  typewrite(htmlContent, callback) {
    if (!this.speechEl) return;
    
    audioVis.setSpeaking(true);
    if (this.avatar3D) this.avatar3D.startSpeaking();

    if (this.choicesEl) {
      this.choicesEl.innerHTML = '';
      this.choicesEl.style.opacity = '0';
    }

    // Automatically parse any markdown bold or italic tokens into proper semantic HTML
    const formattedHtml = (htmlContent || '')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');

    this.speechEl.style.opacity = '0';
    setTimeout(() => {
      this.speechEl.innerHTML = formattedHtml;
      this.speechEl.style.opacity = '1';
      
      if (!audioVis.soundEnabled) {
        audioVis.setSpeaking(false);
        if (this.avatar3D) this.avatar3D.stopSpeaking();
      }
      
      audioVis.playBeep();
      if (callback) callback();
    }, 200);
  }

  renderChoices(choices, formConfig) {
    if (!this.choicesEl) return;
    this.choicesEl.innerHTML = '';

    if (formConfig) {
      this.renderForm(formConfig);
    } else if (choices && choices.length > 0) {
      choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = `assistant-choice-btn ${choice.primary ? 'primary' : ''}`;
        btn.innerHTML = `<span>${choice.label}</span> <span class="choice-arrow">→</span>`;
        
        btn.addEventListener('click', () => {
          if (choice.action) {
            this.handleAction(choice.action, choice.payload);
          } else if (choice.target) {
            this.renderStep(choice.target);
          }
        });

        this.choicesEl.appendChild(btn);
      });
    }

    this.choicesEl.style.opacity = '1';
  }

  renderForm(formConfig) {
    const formWrapper = document.createElement('div');
    formWrapper.className = 'assistant-form-container';

    if (formConfig.type === 'input-pair') {
      formWrapper.innerHTML = `
        <div class="assistant-input-group">
          <label class="assistant-input-label">${formConfig.field1.label}</label>
          <input type="text" id="formField1" class="assistant-input-field" placeholder="${formConfig.field1.placeholder}" required />
        </div>
        <div class="assistant-input-group">
          <label class="assistant-input-label">${formConfig.field2.label}</label>
          <input type="text" id="formField2" class="assistant-input-field" placeholder="${formConfig.field2.placeholder}" required />
        </div>
        <div class="assistant-form-actions">
          <button type="button" class="assistant-choice-btn" id="formBackBtn">← Back</button>
          <button type="button" class="assistant-choice-btn primary" id="formSubmitBtn">${formConfig.buttonLabel}</button>
        </div>
      `;

      this.choicesEl.appendChild(formWrapper);

      document.getElementById('formBackBtn').addEventListener('click', () => this.renderStep('hire-intro'));
      document.getElementById('formSubmitBtn').addEventListener('click', () => {
        const val1 = document.getElementById('formField1').value.trim();
        const val2 = document.getElementById('formField2').value.trim();
        if (!val1) {
          document.getElementById('formField1').focus();
          return;
        }
        this.userAnswers.name = val1;
        this.userAnswers.company = val2 || 'Independent';
        this.renderStep(formConfig.next);
      });
    } else if (formConfig.type === 'textarea-email') {
      formWrapper.innerHTML = `
        <div class="assistant-input-group">
          <label class="assistant-input-label">${formConfig.field1.label}</label>
          <textarea id="formFieldMsg" class="assistant-input-field assistant-textarea" placeholder="${formConfig.field1.placeholder}"></textarea>
        </div>
        <div class="assistant-input-group">
          <label class="assistant-input-label">${formConfig.field2.label}</label>
          <input type="email" id="formFieldEmail" class="assistant-input-field" placeholder="${formConfig.field2.placeholder}" required />
        </div>
        <div class="assistant-form-actions">
          <button type="button" class="assistant-choice-btn" id="formBackBtn">← Back</button>
          <button type="button" class="assistant-choice-btn primary" id="formSubmitBtn">${formConfig.buttonLabel}</button>
        </div>
      `;

      this.choicesEl.appendChild(formWrapper);

      document.getElementById('formBackBtn').addEventListener('click', () => this.renderStep('hire-details'));
      document.getElementById('formSubmitBtn').addEventListener('click', () => {
        const msg = document.getElementById('formFieldMsg').value.trim();
        const email = document.getElementById('formFieldEmail').value.trim();
        if (!email) {
          document.getElementById('formFieldEmail').focus();
          return;
        }
        this.userAnswers.message = msg;
        this.userAnswers.email = email;
        audioVis.playChime();
        this.renderStep(formConfig.next);
      });
    }
  }

  renderQuizQuestion() {
    const questions = RESUME_DATA.quizQuestions;
    if (this.quizIndex >= questions.length) {
      if (this.progressBar) this.progressBar.style.width = '100%';
      const resultText = `🏆 <strong>Quiz Complete!</strong> You scored <span class='highlight'>${this.quizScore} / ${questions.length}</span>! You clearly understand high-performance AI architectures.`;
      
      this.typewrite(resultText, () => {
        this.renderChoices([
          { label: "💼 Hire Krish Now", target: "hire-intro", primary: true },
          { label: "🔄 Retake Quiz", target: "quiz-intro" },
          { label: "⚡ Explore Projects", target: "projects-intro" },
          { label: "⬅ Back to start", target: "greeting" }
        ]);
      });
      return;
    }

    const currentQ = questions[this.quizIndex];
    if (this.progressBar) {
      this.progressBar.style.width = `${40 + (this.quizIndex + 1) * 18}%`;
    }

    const questionHtml = `Question ${this.quizIndex + 1} of ${questions.length}:<br><strong>${currentQ.question}</strong>`;
    
    this.typewrite(questionHtml, () => {
      if (!this.choicesEl) return;
      this.choicesEl.innerHTML = '';

      currentQ.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'assistant-choice-btn';
        btn.innerHTML = `<span>${opt}</span>`;
        
        btn.addEventListener('click', () => {
          if (idx === currentQ.answerIndex) {
            this.quizScore++;
            audioVis.playChime();
            this.typewrite(`✅ <span class='highlight'>Correct!</span> ${currentQ.explanation}`, () => {
              this.quizIndex++;
              setTimeout(() => this.renderQuizQuestion(), 1600);
            });
          } else {
            audioVis.playClick();
            this.typewrite(`❌ <strong>Not quite.</strong> ${currentQ.explanation}`, () => {
              this.quizIndex++;
              setTimeout(() => this.renderQuizQuestion(), 1800);
            });
          }
        });

        this.choicesEl.appendChild(btn);
      });
      this.choicesEl.style.opacity = '1';
    });
  }

  handleAction(actionName, payload) {
    if (actionName === 'copy-email') {
      navigator.clipboard.writeText(RESUME_DATA.email).then(() => {
        window.showToast?.('Email copied to clipboard: ' + RESUME_DATA.email);
        audioVis.playChime();
      });
    } else if (actionName === 'copy-phone') {
      navigator.clipboard.writeText(RESUME_DATA.phone).then(() => {
        window.showToast?.('Phone copied to clipboard: ' + RESUME_DATA.phone);
        audioVis.playChime();
      });
    } else if (actionName === 'open-resume-modal') {
      window.openResumeModal?.();
      audioVis.playChime();
    } else if (actionName === 'switch-to-showcase') {
      window.switchMode?.('showcase');
      audioVis.playChime();
    } else if (actionName === 'switch-to-showcase-demos') {
      window.switchMode?.('showcase');
      const demoSection = document.getElementById('interactive-lab');
      if (demoSection) {
        demoSection.scrollIntoView({ behavior: 'smooth' });
      }
      audioVis.playChime();
    }
  }
}

export const assistantEngine = new ConversationalAssistant();
