/* ==========================================================================
   KRISH RUPAREL PORTFOLIO — AUDIO SYNTHESIZER & AMBIENT PARTICLES
   ========================================================================== */

class AudioVisualizerEngine {
  constructor() {
    this.soundEnabled = false;
    this.audioCtx = null;
    this.canvas = document.getElementById('visualizerCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    
    this.isSpeaking = false;
    this.speechEnergy = 0;
    this.targetSpeechEnergy = 0;
    
    this.particles = [];
    this.initCanvas();
    this.initListeners();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initCanvas() {
    if (!this.canvas) return;
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    // Generate subtle floating ambient atmosphere particles
    this.particles = [];
    const count = 35;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.8,
        alpha: Math.random() * 0.25 + 0.05
      });
    }
  }

  resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initListeners() {
    const toggleBtn = document.getElementById('soundToggleBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleSound());
    }
  }

  initAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleSound() {
    this.initAudioContext();
    this.soundEnabled = !this.soundEnabled;
    const toggleBtn = document.getElementById('soundToggleBtn');
    const label = document.getElementById('soundToggleLabel');
    
    if (toggleBtn) {
      if (this.soundEnabled) {
        toggleBtn.classList.add('sound-on');
        if (label) label.textContent = 'Audio: ON';
        this.playChime();
        window.showToast?.('🔊 Voice & Audio Enabled');
        if (window.assistantEngine) {
          window.assistantEngine.speakCurrentDialogue();
        }
      } else {
        toggleBtn.classList.remove('sound-on');
        if (label) label.textContent = 'Audio: OFF';
        if (window.assistantEngine && window.assistantEngine._currentAudio) {
          try {
            window.assistantEngine._currentAudio.pause();
            window.assistantEngine._currentAudio = null;
          } catch (e) {}
        }
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        if (window.assistantEngine && window.assistantEngine.avatar3D) {
          window.assistantEngine.avatar3D.stopSpeaking();
        }
      }
    }
  }

  // --- Web Audio API Synthesizers ---
  playClick() {
    if (!this.soundEnabled || !this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.audioCtx.currentTime + 0.04);
      
      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.04);
    } catch (e) {}
  }

  playChime() {
    if (!this.soundEnabled || !this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        
        gain.gain.setValueAtTime(0.05, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.3);
        
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.3);
      });
    } catch (e) {}
  }

  playBeep() {
    if (!this.soundEnabled || !this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, this.audioCtx.currentTime);
      
      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);
      
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch (e) {}
  }

  setSpeaking(active) {
    this.isSpeaking = active;
    this.targetSpeechEnergy = active ? 1.0 : 0.0;
  }

  // --- Render Loop ---
  animate(timestamp) {
    if (!this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw subtle, elegant ambient atmosphere particles (No orbital rings)
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(180, 180, 180, ${p.alpha})`;
      this.ctx.fill();
    });

    requestAnimationFrame(this.animate);
  }
}

export const audioVis = new AudioVisualizerEngine();
