/* ==========================================================================
   KRISH RUPAREL PORTFOLIO — 3D ORANGE ROBOT (DUAL-ARM ARTICULATED SKELETON)
   ========================================================================== */

export class Assistant3DAvatar {
  constructor(containerId = 'assistant3dContainer') {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.mouse = { x: 0, y: 0 };
    this.targetHeadRotation = { x: 0, y: 0, z: 0 };
    this.currentHeadRotation = { x: 0, y: 0, z: 0 };
    this.velocity = { x: 0, y: 0, z: 0 };
    this.dragRotation = { x: 0, y: 0 };
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    
    this.isSpeaking = false;
    this.speechPhase = 0;
    this.blinkTimer = 0;
    this.currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    
    // Animation State Machine (Idle, Wave, Salute, Cheer)
    this.currentAction = null;
    this.actionTime = 0;
    this.actionDuration = 0;
    this.currentEmotion = 'happy';

    // Autonomous Natural Interaction Idle Timer (Random animations every 8-15s)
    this.idleActionTimer = 0;
    this.nextIdleActionTime = 7.0 + Math.random() * 6.0;

    // Real Topological Joint Nodes for Both Arms
    this.robotRoot = null;
    this.torsoGroup = null;
    this.neckJoint = null;
    
    // Right Arm Hierarchy
    this.shoulderJoint = null;
    this.elbowJoint = null;

    // Left Arm Hierarchy
    this.leftShoulderJoint = null;
    this.leftElbowJoint = null;

    this.materials = null;
    this.faceCanvas = null;
    this.faceCtx = null;
    this.faceTexture = null;
    this.faceScreenMaterial = null;

    this.init();
  }

  init() {
    if (typeof THREE !== 'undefined') {
      try {
        this.initThreeJS();
        return;
      } catch (err) {
        console.warn('Three.js setup error, using Native 3D engine:', err);
      }
    }

    this.initNative3D();
  }

  // =========================================================================
  // 1. THREE.JS STUDIO ORANGE ROBOT (DUAL-ARM ARTICULATED SKELETON)
  // =========================================================================
  initThreeJS() {
    const width = this.container.clientWidth || 480;
    const height = this.container.clientHeight || 480;

    this.scene = new THREE.Scene();
    
    // Balanced Perspective Camera framing Full Upper-Body Character comfortably
    this.camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    this.camera.position.set(0, -0.05, 3.6);

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // Warm Studio Portrait Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5ee, 1.25);
    this.scene.add(ambientLight);

    const keyLightFront = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLightFront.position.set(1, 3, 5);
    this.scene.add(keyLightFront);

    const leftFillLight = new THREE.DirectionalLight(0xffeedd, 1.5);
    leftFillLight.position.set(-4, 2, 3);
    this.scene.add(leftFillLight);

    const rightRimLight = new THREE.DirectionalLight(0xff5500, 3.0);
    rightRimLight.position.set(4, 3, -3);
    this.scene.add(rightRimLight);

    const topRimLight = new THREE.DirectionalLight(0xffffff, 1.8);
    topRimLight.position.set(0, 5, -3);
    this.scene.add(topRimLight);

    const bottomBounce = new THREE.DirectionalLight(0xff8833, 1.1);
    bottomBounce.position.set(0, -3, 2);
    this.scene.add(bottomBounce);

    // Build Master Dual-Arm Joint Hierarchy
    this.buildTopologicalJointHierarchy();

    // Setup Dynamic Face Canvas Texture
    this.setupFaceCanvas();

    // Create Solid PBR Materials Suite
    this.setupMaterials();

    // Load Flawless 6-Part Topological Joint Models
    this.loadTopologicalJointModels();

    // Interaction Listeners
    this.initInteractionListeners();

    // Initial warm welcome wave on load
    setTimeout(() => {
      this.playWave();
    }, 700);

    // Animation Loop
    const animateThree = (timestamp) => {
      requestAnimationFrame(animateThree);
      const time = timestamp * 0.001;
      const dt = 0.016;

      // 1. Autonomous Random Interaction Loop
      this.idleActionTimer += dt;
      if (this.idleActionTimer > this.nextIdleActionTime) {
        this.idleActionTimer = 0;
        this.nextIdleActionTime = 8.0 + Math.random() * 7.0;

        if (!this.currentAction && !this.isDragging) {
          const rand = Math.random();
          if (rand < 0.40) {
            this.playWave();
          } else if (rand < 0.70) {
            this.playSalute();
          } else {
            this.playCheer();
          }
        }
      }

      // 2. Active Action Joint Animation States
      let rShoulderRot = { x: 0, y: 0, z: 0 };
      let rElbowRot = { x: 0, y: 0, z: 0 };
      let lShoulderRot = { x: 0, y: 0, z: 0 };
      let lElbowRot = { x: 0, y: 0, z: 0 };
      let neckAnimRot = { x: 0, y: 0, z: 0 };
      let torsoAnimRot = { x: 0, y: 0, z: 0 };
      let bodyBobY = 0;
      let torsoScaleY = 1.0;

      if (this.currentAction) {
        this.actionTime += dt;
        const progress = Math.min(this.actionTime / this.actionDuration, 1.0);

        if (this.currentAction === 'wave') {
          // 👋 PROMINENT HIGH WIDE RIGHT-HAND WAVE BESIDE HEAD (OUTWARD ARC — NEVER CLIPS HEAD)
          let liftEnvelope = 0;
          if (progress < 0.16) {
            const t = progress / 0.16;
            liftEnvelope = 1 - Math.pow(1 - t, 3);
          } else if (progress < 0.80) {
            liftEnvelope = 1.0;
          } else {
            const t = (progress - 0.80) / 0.20;
            liftEnvelope = 1 - Math.pow(t, 2);
          }

          const wavePhase = this.actionTime * 10.0;
          const waveCycle = Math.sin(wavePhase);

          // Right Shoulder lifts upper arm forward and wide out to the side
          rShoulderRot.x = (-0.60 + waveCycle * 0.04) * liftEnvelope;
          rShoulderRot.y = (-0.20 - waveCycle * 0.04) * liftEnvelope;
          rShoulderRot.z = (0.90 + waveCycle * 0.06) * liftEnvelope;

          // Elbow flexes forearm upright and waves hand strictly OUTWARD beside the head
          rElbowRot.x = -0.80 * liftEnvelope;
          rElbowRot.y = (0.40 + waveCycle * 0.35) * liftEnvelope;
          rElbowRot.z = (0.50 + waveCycle * 0.25) * liftEnvelope;

          // Left Arm has subtle natural stabilization counter-sway
          lShoulderRot.z = -0.08 * liftEnvelope;
          lElbowRot.z = -0.05 * liftEnvelope;

          // Head bobs rhythmically and tilts playfully with the wave
          neckAnimRot.z = Math.sin(wavePhase * 0.5) * 0.08 * liftEnvelope;
          neckAnimRot.y = -0.10 * liftEnvelope;
          neckAnimRot.x = -Math.abs(Math.sin(wavePhase * 0.5)) * 0.04 * liftEnvelope;
          bodyBobY = Math.sin(wavePhase * 0.5) * 0.03 * liftEnvelope;

        } else if (this.currentAction === 'salute') {
          // 🫡 PRECISE TEMPLE SALUTE (SNAPS CLEANLY TO FRONT OF TEMPLE / BROW)
          if (progress < 0.18) {
            const t = progress / 0.18;
            const ease = 1 - Math.pow(1 - t, 4); // Fast snap
            rShoulderRot.x = -0.20 * ease;
            rShoulderRot.y = -0.80 * ease;
            rShoulderRot.z = 1.20 * ease;
            rElbowRot.x = 0.0;
            rElbowRot.y = 0.90 * ease;
            rElbowRot.z = 1.60 * ease;
            lShoulderRot.z = -0.06 * ease;
            neckAnimRot.x = -0.07 * ease;
            bodyBobY = 0.03 * ease;
            torsoScaleY = 1.0 + 0.02 * ease;
          } else if (progress < 0.78) {
            const holdT = (progress - 0.18) / 0.60;
            const microPulse = Math.sin(holdT * Math.PI * 4) * 0.005;
            rShoulderRot.x = -0.20 + microPulse;
            rShoulderRot.y = -0.80;
            rShoulderRot.z = 1.20;
            rElbowRot.x = 0.0;
            rElbowRot.y = 0.90;
            rElbowRot.z = 1.60;
            lShoulderRot.z = -0.06;
            neckAnimRot.x = -0.07;
            bodyBobY = 0.03;
            torsoScaleY = 1.02;
          } else {
            const t = (progress - 0.78) / 0.22;
            const ease = Math.pow(t, 2);
            rShoulderRot.x = -0.20 * (1 - ease);
            rShoulderRot.y = -0.80 * (1 - ease);
            rShoulderRot.z = 1.20 * (1 - ease);
            rElbowRot.x = 0.0;
            rElbowRot.y = 0.90 * (1 - ease);
            rElbowRot.z = 1.60 * (1 - ease);
            lShoulderRot.z = -0.06 * (1 - ease);
            neckAnimRot.x = -0.07 * (1 - ease);
            bodyBobY = 0.03 * (1 - ease);
            torsoScaleY = 1.0 + 0.02 * (1 - ease);
          }

        } else if (this.currentAction === 'cheer') {
          // ✨ TWO-HANDED CELEBRATION DUAL FIST PUMP & BOUNCE
          const cheerPhase = this.actionTime * 12.0;
          const envelope = Math.sin(progress * Math.PI);
          const pumpCycle = Math.sin(cheerPhase);

          // Right Arm pumps high and wide
          rShoulderRot.x = (-0.55 + pumpCycle * 0.15) * envelope;
          rShoulderRot.y = (-0.20 - pumpCycle * 0.05) * envelope;
          rShoulderRot.z = (0.85 + pumpCycle * 0.20) * envelope;
          rElbowRot.x = (-0.75 + pumpCycle * 0.15) * envelope;
          rElbowRot.y = 0.40 * envelope;
          rElbowRot.z = (0.75 + pumpCycle * 0.25) * envelope;

          // Left Arm pumps simultaneously in celebratory harmony
          lShoulderRot.x = (-0.55 + pumpCycle * 0.15) * envelope;
          lShoulderRot.y = (0.20 + pumpCycle * 0.05) * envelope;
          lShoulderRot.z = (-0.85 - pumpCycle * 0.20) * envelope;
          lElbowRot.x = (-0.75 + pumpCycle * 0.15) * envelope;
          lElbowRot.y = -0.40 * envelope;
          lElbowRot.z = (-0.75 - pumpCycle * 0.25) * envelope;

          // Full body celebratory bounce & nod
          bodyBobY = Math.abs(Math.sin(cheerPhase)) * 0.06 * envelope;
          neckAnimRot.x = Math.sin(cheerPhase) * 0.08 * envelope;
          torsoScaleY = 1.0 + Math.abs(Math.sin(cheerPhase)) * 0.03 * envelope;
        }

        if (progress >= 1.0) {
          this.currentAction = null;
          this.currentEmotion = 'happy';
        }
      }

      // 3. Smooth Neck Joint Tracking with Harmonic Spring Easing
      if (!this.isDragging) {
        const spring = 0.055;
        const damping = 0.82;

        const forceX = (this.targetHeadRotation.x - this.currentHeadRotation.x) * spring;
        const forceY = (this.targetHeadRotation.y - this.currentHeadRotation.y) * spring;
        const forceZ = (this.targetHeadRotation.z - this.currentHeadRotation.z) * spring;

        this.velocity.x = (this.velocity.x + forceX) * damping;
        this.velocity.y = (this.velocity.y + forceY) * damping;
        this.velocity.z = (this.velocity.z + forceZ) * damping;

        this.currentHeadRotation.x += this.velocity.x;
        this.currentHeadRotation.y += this.velocity.y;
        this.currentHeadRotation.z += this.velocity.z;
      }

      // Idle Natural Multi-Axis Breathing
      const breathFloatY = Math.sin(time * 2.2) * 0.04;
      const breathNodX = Math.sin(time * 1.8) * 0.025;
      const breathSwayY = Math.cos(time * 1.2) * 0.02;
      const breathChestScale = 1.0 + Math.sin(time * 2.2) * 0.008;

      // Apply Articulated Joint Rotations:
      if (this.robotRoot) {
        this.robotRoot.position.y = 0.28 + breathFloatY + bodyBobY;
      }

      // Neck Joint: Head Turns & Tilts independently to look at cursor
      if (this.neckJoint) {
        this.neckJoint.rotation.x = this.currentHeadRotation.x + this.dragRotation.x + breathNodX + neckAnimRot.x;
        this.neckJoint.rotation.y = this.currentHeadRotation.y + this.dragRotation.y + breathSwayY + neckAnimRot.y;
        this.neckJoint.rotation.z = this.currentHeadRotation.z + (-this.currentHeadRotation.y * 0.12) + neckAnimRot.z;
      }

      // Torso Joint: Grounded Body with Subtle Breathing Drag
      if (this.torsoGroup) {
        this.torsoGroup.rotation.y = (this.currentHeadRotation.y + this.dragRotation.y) * 0.20 + torsoAnimRot.y;
        this.torsoGroup.rotation.x = this.currentHeadRotation.x * 0.12;
        this.torsoGroup.scale.set(1.0, torsoScaleY * breathChestScale, 1.0);
      }

      // Right Arm Joints
      if (this.shoulderJoint) {
        this.shoulderJoint.rotation.x = rShoulderRot.x;
        this.shoulderJoint.rotation.y = rShoulderRot.y;
        this.shoulderJoint.rotation.z = rShoulderRot.z;
      }
      if (this.elbowJoint) {
        this.elbowJoint.rotation.x = rElbowRot.x;
        this.elbowJoint.rotation.y = rElbowRot.y;
        this.elbowJoint.rotation.z = rElbowRot.z;
      }

      // Left Arm Joints
      if (this.leftShoulderJoint) {
        this.leftShoulderJoint.rotation.x = lShoulderRot.x;
        this.leftShoulderJoint.rotation.y = lShoulderRot.y;
        this.leftShoulderJoint.rotation.z = lShoulderRot.z;
      }
      if (this.leftElbowJoint) {
        this.leftElbowJoint.rotation.x = lElbowRot.x;
        this.leftElbowJoint.rotation.y = lElbowRot.y;
        this.leftElbowJoint.rotation.z = lElbowRot.z;
      }

      // Update Face Texture (Blinking, Gaze Tracking, Dynamic Expressions & Lip-Sync)
      this.updateFaceTexture();

      this.renderer.render(this.scene, this.camera);
    };

    requestAnimationFrame(animateThree);
  }

  // --- Build Three.js Dual-Arm Hierarchical Joint Skeleton ---
  buildTopologicalJointHierarchy() {
    this.robotRoot = new THREE.Group();
    const scale = 0.44;
    this.robotRoot.scale.set(scale, scale, scale);
    this.robotRoot.position.set(0.0, 0.28, 0.05);
    this.scene.add(this.robotRoot);

    // 1. Torso Group
    this.torsoGroup = new THREE.Group();
    this.robotRoot.add(this.torsoGroup);

    // 2. Neck Joint (Pivot at Neck Center: [ -0.03, -1.19, -0.03 ])
    this.neckJoint = new THREE.Group();
    this.neckJoint.position.set(-0.03, -1.19, -0.03);
    this.robotRoot.add(this.neckJoint);

    // 3. Right Shoulder Joint (Pivot at Shoulder Socket: [ 0.58, -1.35, 0.12 ])
    this.shoulderJoint = new THREE.Group();
    this.shoulderJoint.position.set(0.58, -1.35, 0.12);
    this.torsoGroup.add(this.shoulderJoint);

    // 4. Right Elbow Joint (Pivot at Elbow Hinge: [ 0.37, -0.67, 0.08 ] relative to Shoulder)
    this.elbowJoint = new THREE.Group();
    this.elbowJoint.position.set(0.37, -0.67, 0.08);
    this.shoulderJoint.add(this.elbowJoint);

    // 5. Left Shoulder Joint (Pivot at Left Shoulder Socket: [ -0.64, -1.35, -0.16 ])
    this.leftShoulderJoint = new THREE.Group();
    this.leftShoulderJoint.position.set(-0.64, -1.35, -0.16);
    this.torsoGroup.add(this.leftShoulderJoint);

    // 6. Left Elbow Joint (Pivot at Left Elbow Hinge: [ -0.39, -0.67, -0.08 ] relative to Left Shoulder)
    this.leftElbowJoint = new THREE.Group();
    this.leftElbowJoint.position.set(-0.39, -0.67, -0.08);
    this.leftShoulderJoint.add(this.leftElbowJoint);
  }

  // --- Dynamic Expressive Face Canvas Texture ---
  setupFaceCanvas() {
    this.faceCanvas = document.createElement('canvas');
    this.faceCanvas.width = 1024;
    this.faceCanvas.height = 1024;
    this.faceCtx = this.faceCanvas.getContext('2d');

    this.faceTexture = new THREE.CanvasTexture(this.faceCanvas);
    this.faceTexture.flipY = true;
  }

  updateFaceTexture() {
    if (!this.faceCtx) return;
    const ctx = this.faceCtx;

    // Pure obsidian black OLED visor screen background
    ctx.fillStyle = '#06060c';
    ctx.fillRect(0, 0, 1024, 1024);

    // Natural Blinking Cycle (Every ~3.2s with soft squash)
    this.blinkTimer += 0.016;
    let eyeScaleY = 1.0;
    if (this.blinkTimer > 3.2) {
      eyeScaleY = 0.1;
      if (this.blinkTimer > 3.38) this.blinkTimer = 0;
    }

    // Dynamic Gaze Parallax on Visor
    const gazeShiftX = this.currentHeadRotation.y * 26;
    const gazeShiftY = -this.currentHeadRotation.x * 16;

    const vCenterX = 896 + gazeShiftX;
    const eyeSpacing = 40;
    const vEyeY = 108 + gazeShiftY;

    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 15;

    if (this.currentEmotion === 'waving') {
      // Joyful Crescent Curved Eyes (^  ^) during Waving & Cheer
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.arc(vCenterX - eyeSpacing, vEyeY + 3, 14, 1.15 * Math.PI, 1.85 * Math.PI, false);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(vCenterX + eyeSpacing, vEyeY + 3, 14, 1.15 * Math.PI, 1.85 * Math.PI, false);
      ctx.stroke();

      // Cheerful Wide Curved Smile
      ctx.beginPath();
      ctx.arc(vCenterX, 134 + gazeShiftY * 0.7, 16, 0.2 * Math.PI, 0.8 * Math.PI, false);
      ctx.stroke();

    } else if (this.currentEmotion === 'saluting') {
      // Sharp, Alert, Focused Eyes (O  O) during Salute
      ctx.beginPath();
      ctx.ellipse(vCenterX - eyeSpacing, vEyeY, 15, 14 * eyeScaleY, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(vCenterX + eyeSpacing, vEyeY, 15, 14 * eyeScaleY, 0, 0, Math.PI * 2);
      ctx.fill();

      // Proud Smile
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(vCenterX, 134 + gazeShiftY * 0.7, 13, 0.22 * Math.PI, 0.78 * Math.PI, false);
      ctx.stroke();

    } else {
      // Standard Cute Friendly Expression (Pill Eyes + Curved Smile)
      ctx.beginPath();
      ctx.ellipse(vCenterX - eyeSpacing, vEyeY, 15, 12 * eyeScaleY, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(vCenterX + eyeSpacing, vEyeY, 15, 12 * eyeScaleY, 0, 0, Math.PI * 2);
      ctx.fill();

      if (this.isSpeaking) {
        this.speechPhase += 0.28;
        const mouthOpen = Math.abs(Math.sin(this.speechPhase)) * 10 + 3;
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.ellipse(vCenterX, 142 + gazeShiftY * 0.7, 14, mouthOpen, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.strokeStyle = '#ffffff';
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 12;
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(vCenterX, 132 + gazeShiftY * 0.7, 13, 0.22 * Math.PI, 0.78 * Math.PI, false);
        ctx.stroke();
      }
    }

    ctx.shadowBlur = 0;

    if (this.faceTexture) {
      this.faceTexture.needsUpdate = true;
    }
  }

  // --- Animation Trigger Methods ---
  playWave() {
    this.currentAction = 'wave';
    this.actionTime = 0;
    this.actionDuration = 2.6;
    this.currentEmotion = 'waving';
  }

  playSalute() {
    this.currentAction = 'salute';
    this.actionTime = 0;
    this.actionDuration = 2.4;
    this.currentEmotion = 'saluting';
  }

  playCheer() {
    this.currentAction = 'cheer';
    this.actionTime = 0;
    this.actionDuration = 2.5;
    this.currentEmotion = 'waving';
  }

  // --- Create Solid PBR Materials Suite ---
  setupMaterials() {
    const textureLoader = new THREE.TextureLoader();

    // Load High-Res PBR Textures
    const orangeBase = textureLoader.load('models/orange-bot/Textures/Orange_Base_Color.jpg');
    orangeBase.encoding = THREE.sRGBEncoding;

    const orangeRough = textureLoader.load('models/orange-bot/Textures/Orange_Roughness.jpg');
    const orangeMetal = textureLoader.load('models/orange-bot/Textures/Orange_Metallic.jpg');
    const orangeNormal = textureLoader.load('models/orange-bot/Textures/Orange_Normal_OpenGL.jpg');
    const orangeAO = textureLoader.load('models/orange-bot/Textures/Orange_Mixed_AO.jpg');

    const blackBase = textureLoader.load('models/orange-bot/Textures/Black_Base_Color.jpg');
    blackBase.encoding = THREE.sRGBEncoding;
    const blackRough = textureLoader.load('models/orange-bot/Textures/Black_Roughness.jpg');
    const blackMetal = textureLoader.load('models/orange-bot/Textures/Black_Metallic.jpg');
    const blackNormal = textureLoader.load('models/orange-bot/Textures/Black_Normal_OpenGL.jpg');

    const whiteBase = textureLoader.load('models/orange-bot/Textures/White_Base_Color.jpg');
    whiteBase.encoding = THREE.sRGBEncoding;

    // 0: Orange Armor Material
    const orangeMaterial = new THREE.MeshStandardMaterial({
      map: orangeBase,
      roughnessMap: orangeRough,
      metalnessMap: orangeMetal,
      normalMap: orangeNormal,
      aoMap: orangeAO,
      color: 0xee4a00,
      roughness: 0.25,
      metalness: 0.25,
      aoMapIntensity: 0.8,
      side: THREE.DoubleSide
    });

    // 1: Black Joints / Chassis Material
    const blackMaterial = new THREE.MeshStandardMaterial({
      map: blackBase,
      roughnessMap: blackRough,
      metalnessMap: blackMetal,
      normalMap: blackNormal,
      color: 0x111116,
      roughness: 0.25,
      metalness: 0.85,
      side: THREE.DoubleSide
    });

    // 2: White Top Stripe Material
    const whiteMaterial = new THREE.MeshStandardMaterial({
      map: whiteBase,
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.3,
      side: THREE.DoubleSide
    });

    // 3: Face Screen Visor Material (OLED Visor with Glowing Cute Face)
    this.faceScreenMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      map: this.faceTexture,
      emissive: 0xffffff,
      emissiveMap: this.faceTexture,
      emissiveIntensity: 3.2,
      roughness: 0.05,
      metalness: 0.95,
      side: THREE.DoubleSide
    });

    // Unified 4-Material Suite
    this.materials = [orangeMaterial, blackMaterial, whiteMaterial, this.faceScreenMaterial];
  }

  // --- Load Clean 6-Part Upper-Body Topological Sub-Meshes with Cache-Buster ---
  loadTopologicalJointModels() {
    if (typeof THREE.OBJLoader !== 'undefined') {
      const objLoader = new THREE.OBJLoader();
      const cb = '?v=' + Date.now();

      // 1. Load Head & Visor Mesh (Attached to Neck Joint [ -0.03, -1.19, -0.03 ])
      objLoader.load(
        'models/orange-bot/OrangeBOT_Head.obj' + cb,
        (headObj) => {
          headObj.traverse((child) => {
            if (child.isMesh && child.geometry) {
              child.geometry.clearGroups();
              child.geometry.addGroup(0, 484752, 0); // Orange Armor & Solid Chin
              child.geometry.addGroup(484752, 56916, 1); // Black Ears/Neck
              child.geometry.addGroup(541668, 7296, 2); // White Top Racing Stripe
              child.geometry.addGroup(548964, 5760, 3); // Full OLED Visor Screen
              child.material = this.materials;
              child.castShadow = true;
              child.receiveShadow = true;
              child.geometry.computeVertexNormals();
            }
          });
          headObj.position.set(0.03, 1.19, 0.03);
          this.neckJoint.add(headObj);
        },
        undefined,
        (err) => console.warn('Head load error:', err)
      );

      // 2. Load Clean Pure Upper Torso, Chest Armor & Waist (NO LEGS, NO STATIC ARMS)
      objLoader.load(
        'models/orange-bot/OrangeBOT_Torso.obj' + cb,
        (torsoObj) => {
          torsoObj.traverse((child) => {
            if (child.isMesh && child.geometry) {
              child.geometry.clearGroups();
              child.geometry.addGroup(0, 49188, 0); // Orange Torso Armor
              child.geometry.addGroup(49188, 93696, 1); // Black Pelvis/Chassis
              child.material = this.materials;
              child.castShadow = true;
              child.receiveShadow = true;
              child.geometry.computeVertexNormals();
            }
          });
          this.torsoGroup.add(torsoObj);
        },
        undefined,
        (err) => console.warn('Torso load error:', err)
      );

      // 3. Load Right Upper Arm Mesh (Attached to Right Shoulder Joint [ 0.58, -1.35, 0.12 ])
      objLoader.load(
        'models/orange-bot/OrangeBOT_RightUpperArm.obj' + cb,
        (rUpperObj) => {
          rUpperObj.traverse((child) => {
            if (child.isMesh && child.geometry) {
              child.geometry.clearGroups();
              child.geometry.addGroup(0, 3060, 0); // Orange Bicep
              child.geometry.addGroup(3060, 14820, 1); // Black Shoulder Joint
              child.material = this.materials;
              child.castShadow = true;
              child.receiveShadow = true;
              child.geometry.computeVertexNormals();
            }
          });
          rUpperObj.position.set(-0.58, 1.35, -0.12);
          this.shoulderJoint.add(rUpperObj);
        },
        undefined,
        (err) => console.warn('Right Upper Arm load error:', err)
      );

      // 4. Load Right Forearm & Hand Mesh (Attached to Right Elbow Joint [ 0.95, -2.02, 0.20 ])
      objLoader.load(
        'models/orange-bot/OrangeBOT_RightForearm.obj' + cb,
        (rForearmObj) => {
          rForearmObj.traverse((child) => {
            if (child.isMesh && child.geometry) {
              child.geometry.clearGroups();
              child.geometry.addGroup(0, 5424, 0); // Orange Forearm Armor
              child.geometry.addGroup(5424, 12744, 1); // Black Elbow & Hand Clamp
              child.material = this.materials;
              child.castShadow = true;
              child.receiveShadow = true;
              child.geometry.computeVertexNormals();
            }
          });
          rForearmObj.position.set(-0.95, 2.02, -0.20);
          this.elbowJoint.add(rForearmObj);
        },
        undefined,
        (err) => console.warn('Right Forearm load error:', err)
      );

      // 5. Load Left Upper Arm Mesh (Attached to Left Shoulder Joint [ -0.64, -1.35, -0.16 ])
      objLoader.load(
        'models/orange-bot/OrangeBOT_LeftUpperArm.obj' + cb,
        (lUpperObj) => {
          lUpperObj.traverse((child) => {
            if (child.isMesh && child.geometry) {
              child.geometry.clearGroups();
              child.geometry.addGroup(0, 3060, 0); // Orange Left Bicep
              child.geometry.addGroup(3060, 14820, 1); // Black Left Shoulder Joint
              child.material = this.materials;
              child.castShadow = true;
              child.receiveShadow = true;
              child.geometry.computeVertexNormals();
            }
          });
          lUpperObj.position.set(0.64, 1.35, 0.16);
          this.leftShoulderJoint.add(lUpperObj);
        },
        undefined,
        (err) => console.warn('Left Upper Arm load error:', err)
      );

      // 6. Load Left Forearm & Hand Mesh (Attached to Left Elbow Joint [ -1.03, -2.02, -0.24 ])
      objLoader.load(
        'models/orange-bot/OrangeBOT_LeftForearm.obj' + cb,
        (lForearmObj) => {
          lForearmObj.traverse((child) => {
            if (child.isMesh && child.geometry) {
              child.geometry.clearGroups();
              child.geometry.addGroup(0, 5424, 0); // Orange Left Forearm
              child.geometry.addGroup(5424, 12744, 1); // Black Left Elbow & Clamp
              child.material = this.materials;
              child.castShadow = true;
              child.receiveShadow = true;
              child.geometry.computeVertexNormals();
            }
          });
          lForearmObj.position.set(1.03, 2.02, 0.24);
          this.leftElbowJoint.add(lForearmObj);
        },
        undefined,
        (err) => console.warn('Left Forearm load error:', err)
      );
    }
  }

  initInteractionListeners() {
    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) {
        const normX = (e.clientX / window.innerWidth) * 2 - 1;
        const normY = -(e.clientY / window.innerHeight) * 2 + 1;
        this.targetHeadRotation.y = normX * 0.55;
        this.targetHeadRotation.x = -normY * 0.35;
        this.targetHeadRotation.z = -normX * 0.1;
      } else {
        const deltaX = e.clientX - this.previousMousePosition.x;
        const deltaY = e.clientY - this.previousMousePosition.y;
        this.dragRotation.y += deltaX * 0.01;
        this.dragRotation.x += deltaY * 0.01;
        this.previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });

    if (this.container) {
      // Click on bot container to trigger spontaneous wave/salute/cheer
      this.container.addEventListener('click', () => {
        if (!this.currentAction) {
          const rand = Math.random();
          if (rand < 0.40) this.playWave();
          else if (rand < 0.70) this.playSalute();
          else this.playCheer();
        }
      });

      this.container.addEventListener('mousedown', (e) => {
        this.isDragging = true;
        this.previousMousePosition = { x: e.clientX, y: e.clientY };
      });

      this.container.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) {
          this.isDragging = true;
          this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (this.isDragging && e.touches && e.touches[0]) {
          const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
          const deltaY = e.touches[0].clientY - this.previousMousePosition.y;
          this.dragRotation.y += deltaX * 0.01;
          this.dragRotation.x += deltaY * 0.01;
          this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
      }, { passive: true });

      window.addEventListener('touchend', () => {
        this.isDragging = false;
        this.dragRotation = { x: 0, y: 0 };
      }, { passive: true });

      window.addEventListener('mouseup', () => {
        this.isDragging = false;
        this.dragRotation = { x: 0, y: 0 };
      });

      window.addEventListener('resize', () => {
        if (this.container && this.renderer && this.camera) {
          const w = this.container.clientWidth || 480;
          const h = this.container.clientHeight || 480;
          this.camera.aspect = w / h;
          this.camera.updateProjectionMatrix();
          this.renderer.setSize(w, h);
        }
      });
    }
  }

  // =========================================================================
  // 2. NATIVE 3D HEAD (Zero-Dependency Fallback)
  // =========================================================================
  initNative3D() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 760;
    this.canvas.height = 760;
    this.canvas.style.width = '380px';
    this.canvas.style.height = '380px';
    this.ctx = this.canvas.getContext('2d');

    this.container.innerHTML = '';
    this.container.appendChild(this.canvas);

    window.addEventListener('mousemove', (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      this.targetHeadRotation.y = normX * 0.4;
      this.targetHeadRotation.x = -normY * 0.25;
    });

    const animateNative = (timestamp) => {
      requestAnimationFrame(animateNative);
      this.renderNativeFrame(timestamp * 0.001);
    };
    requestAnimationFrame(animateNative);
  }

  renderNativeFrame(time) {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    this.currentHeadRotation.x += (this.targetHeadRotation.x - this.currentHeadRotation.x) * 0.08;
    this.currentHeadRotation.y += (this.targetHeadRotation.y - this.currentHeadRotation.y) * 0.08;

    const rotX = this.currentHeadRotation.x;
    const rotY = this.currentHeadRotation.y;
    const floatY = Math.sin(time * 1.8) * 3;

    ctx.save();
    ctx.translate(cx, cy + 20);

    // Torso
    const orangeGrad = ctx.createLinearGradient(-50, -50, 50, 80);
    orangeGrad.addColorStop(0, '#ff7722');
    orangeGrad.addColorStop(0.5, '#ee4a00');
    orangeGrad.addColorStop(1, '#bb3300');

    ctx.fillStyle = orangeGrad;
    ctx.beginPath();
    ctx.roundRect(-55, 30 + floatY, 110, 95, 24);
    ctx.fill();

    // Head
    ctx.save();
    ctx.translate(rotY * 35, floatY + rotX * 22);

    // Helmet Box
    ctx.beginPath();
    ctx.roundRect(-110, -95, 220, 175, 38);
    ctx.fillStyle = orangeGrad;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 15;
    ctx.fill();
    ctx.shadowBlur = 0;

    // White Top Stripe
    ctx.fillStyle = '#f0f0f0';
    ctx.beginPath();
    ctx.roundRect(-50, -95, 100, 24, [12, 12, 0, 0]);
    ctx.fill();

    // Side Ear Headphones
    ctx.fillStyle = '#1c1c22';
    ctx.beginPath();
    ctx.roundRect(-138, -40, 28, 60, 10);
    ctx.roundRect(110, -40, 28, 60, 10);
    ctx.fill();

    // Visor Screen
    ctx.fillStyle = '#06060c';
    ctx.beginPath();
    ctx.roundRect(-85, -68, 170, 125, 26);
    ctx.fill();

    // Glowing Face Eyes
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 20;

    ctx.beginPath();
    ctx.ellipse(-34, -15, 18, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(34, -15, 18, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mouth
    ctx.strokeStyle = '#ffffff';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 16;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 16, 22, 0.2 * Math.PI, 0.8 * Math.PI, false);
    ctx.stroke();

    ctx.restore();
    ctx.restore();
  }

  startSpeaking() {
    this.isSpeaking = true;
  }

  stopSpeaking() {
    this.isSpeaking = false;
    this.speechPhase = 0;
  }

  updateThemeColors(theme) {
    this.currentTheme = theme;
  }
}
