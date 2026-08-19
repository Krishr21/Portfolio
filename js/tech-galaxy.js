/* ==========================================================================
   KRISH RUPAREL PORTFOLIO — 3D INTERACTIVE TECH GALAXY & ORBIT ENGINE
   ========================================================================== */

export const TECH_GALAXY_DATA = [
  // --- AI & Machine Learning ---
  { 
    id: "qdrant", 
    name: "Qdrant / FAISS", 
    color: "#2563eb", 
    hex: "#2563eb",
    colorNum: 0x2563eb,
    radius: 2.7, 
    speed: -0.42, 
    yOffset: -0.2, 
    icon: "⚡", 
    tag: "Vector RAG", 
    category: "ai", 
    level: 95,
    desc: "High-dimensional vector indexing, HNSW cosine retrieval, & sub-15ms reranked multimodal search.",
    usedIn: "VisionVault & Micropro Solutions",
    snippet: `# Qdrant HNSW Multimodal Video Retrieval
results = qdrant_client.search(
    collection_name="video_frames",
    query_vector=dense_query_embedding,
    limit=5,
    query_filter=Filter(must=[
        FieldCondition(key="fps", match=MatchValue(value=30))
    ])
)`
  },
  { 
    id: "llamaindex", 
    name: "LlamaIndex", 
    color: "#7c3aed", 
    hex: "#7c3aed",
    colorNum: 0x7c3aed,
    radius: 3.4, 
    speed: 0.35, 
    yOffset: -0.5, 
    icon: "🦙", 
    tag: "Agentic AI", 
    category: "ai", 
    level: 93,
    desc: "Hierarchical chunk synthesis, agent tool routing, and streaming to local Ollama LLMs.",
    usedIn: "VisionVault & K.R.I.S.H. Assistant",
    snippet: `# LlamaIndex Synthesis Engine
index = VectorStoreIndex.from_documents(chunks, storage_context=storage_ctx)
query_engine = index.as_query_engine(streaming=True, similarity_top_k=5)
response_stream = query_engine.query("Explain the sudden latency spike at timestamp 02:45")`
  },
  { 
    id: "pytorch", 
    name: "PyTorch", 
    color: "#e11d48", 
    hex: "#e11d48",
    colorNum: 0xe11d48,
    radius: 4.1, 
    speed: 0.30, 
    yOffset: 0.7, 
    icon: "🔥", 
    tag: "Deep Learning", 
    category: "ai", 
    level: 92,
    desc: "Neural network training, loss optimization, cross-encoders, and GPU-accelerated inference.",
    usedIn: "Computer Vision & RAG Benchmarking",
    snippet: `# Cross-Encoder Neural Reranking
class CrossEncoderReranker(nn.Module):
    def __init__(self, pretrained_model):
        super().__init__()
        self.encoder = AutoModel.from_pretrained(pretrained_model)
        self.classifier = nn.Linear(768, 1)
    
    def forward(self, input_ids, mask):
        embeds = self.encoder(input_ids=input_ids, attention_mask=mask).last_hidden_state[:, 0, :]
        return torch.sigmoid(self.classifier(embeds))`
  },
  { 
    id: "yolov8", 
    name: "YOLOv8", 
    color: "#ea580c", 
    hex: "#ea580c",
    colorNum: 0xea580c,
    radius: 4.8, 
    speed: -0.34, 
    yOffset: -0.6, 
    icon: "👁️", 
    tag: "IEEE Paper", 
    category: "ai", 
    level: 90,
    desc: "Real-time multi-food recognition & 3D volume reconstruction (82% benchmark accuracy).",
    usedIn: "IEEE Published Research Paper",
    snippet: `# YOLOv8 Multi-Object Segmentation & 3D Volume
results = yolov8_model.predict(source=frame_tensor, conf=0.45, iou=0.65)
masks = results[0].masks.data
volume_cm3 = calculate_3d_voxel_reconstruction(masks, depth_map_tensor)`
  },
  { 
    id: "gemini", 
    name: "Gemini 1.5 Flash", 
    color: "#9333ea", 
    hex: "#9333ea",
    colorNum: 0x9333ea,
    radius: 5.3, 
    speed: -0.22, 
    yOffset: 0.2, 
    icon: "✨", 
    tag: "GenAI", 
    category: "ai", 
    level: 94,
    desc: "Live Google Search Grounding and multimodal structured query synthesis.",
    usedIn: "CarWise-AI & Live Assistant",
    snippet: `# Gemini 1.5 Flash with Search Grounding
response = client.models.generate_content(
    model="gemini-1.5-flash",
    contents=[system_instruction, user_prompt],
    config={"tools": [{"google_search": {}}]}
)`
  },

  // --- Systems & Distributed Cloud ---
  { 
    id: "fastapi", 
    name: "FastAPI", 
    color: "#059669", 
    hex: "#059669",
    colorNum: 0x059669,
    radius: 3.0, 
    speed: -0.40, 
    yOffset: 0.8, 
    icon: "🚀", 
    tag: "Backend API", 
    category: "systems", 
    level: 94,
    desc: "High-throughput async REST endpoints, WebSocket streaming, & background workers.",
    usedIn: "OrchestrAI & Voice Agent Backend",
    snippet: `# Asynchronous WebSocket Telemetry Stream
@app.websocket("/ws/telemetry/{run_id}")
async def stream_telemetry(websocket: WebSocket, run_id: str):
    await websocket.accept()
    async for event in redis_pubsub.listen_channel(f"trace:{run_id}"):
        await websocket.send_json(event)`
  },
  { 
    id: "solace", 
    name: "Solace Pub/Sub", 
    color: "#16a34a", 
    hex: "#16a34a",
    colorNum: 0x16a34a,
    radius: 3.7, 
    speed: 0.28, 
    yOffset: -0.8, 
    icon: "📨", 
    tag: "Distributed", 
    category: "systems", 
    level: 92,
    desc: "Enterprise event mesh decoupling workflows, delivering +30% event processing throughput.",
    usedIn: "Utrecht IT Consulting (Netherlands)",
    snippet: `# Solace Event Mesh Topic Subscription
messaging_service = MessagingService.builder().from_properties(config).build()
direct_receiver = messaging_service.create_direct_message_receiver_builder() \\
    .with_subscriptions([TopicSubscription.of("market/orders/>")]) \\
    .build()
direct_receiver.start()`
  },
  { 
    id: "docker", 
    name: "Docker & Celery", 
    color: "#3b82f6", 
    hex: "#3b82f6",
    colorNum: 0x3b82f6,
    radius: 4.4, 
    speed: -0.26, 
    yOffset: 0.3, 
    icon: "🐳", 
    tag: "DevOps", 
    category: "systems", 
    level: 90,
    desc: "Multi-stage containerized deployments and asynchronous background worker queues.",
    usedIn: "Production Microservices",
    snippet: `# Distributed Background Task Dispatch
@celery_app.task(bind=True, max_retries=3)
def process_rag_eval_pipeline(self, run_id: str):
    eval_metrics = evaluate_trace_determinism(run_id)
    save_eval_to_postgres(run_id, eval_metrics)`
  },
  { 
    id: "opentelemetry", 
    name: "OpenTelemetry", 
    color: "#d97706", 
    hex: "#d97706",
    colorNum: 0xd97706,
    radius: 5.0, 
    speed: -0.29, 
    yOffset: -0.4, 
    icon: "📡", 
    tag: "Telemetry", 
    category: "systems", 
    level: 89,
    desc: "Distributed trace spans, Celery task evaluation, and real-time WebSocket state streaming.",
    usedIn: "OrchestrAI Telemetry Replay",
    snippet: `# Distributed Context Tracing Span
tracer = trace.get_tracer("orchestrai.agent")
with tracer.start_as_current_span("agent_step_execution") as span:
    span.set_attribute("agent.step_index", step_idx)
    span.set_attribute("agent.model", "llama3.2-3b")
    result = await execute_tool_call(tool_name, tool_args)`
  },

  // --- Core Programming Languages ---
  { 
    id: "python", 
    name: "Python", 
    color: "#0284c7", 
    hex: "#0284c7",
    colorNum: 0x0284c7,
    radius: 2.9, 
    speed: 0.44, 
    yOffset: 0.4, 
    icon: "🐍", 
    tag: "AI / Core", 
    category: "languages", 
    level: 96,
    desc: "Primary language for AI/ML, RAG pipelines, FastAPI services, & automation scripts.",
    usedIn: "All Core Projects & Production Pipelines",
    snippet: `# High-Performance Concurrent Pipeline Execution
async def execute_concurrent_pipeline(tasks: list[Coroutine]) -> list[Any]:
    results = await asyncio.gather(*tasks, return_exceptions=False)
    return [res for res in results if res is not None]`
  },
  { 
    id: "typescript", 
    name: "TypeScript & JS", 
    color: "#3178c6", 
    hex: "#3178c6",
    colorNum: 0x3178c6,
    radius: 3.6, 
    speed: -0.36, 
    yOffset: -0.3, 
    icon: "🔷", 
    tag: "Full-Stack", 
    category: "languages", 
    level: 91,
    desc: "Type-safe asynchronous client modules, WebGL shaders, Three.js, and audio streaming UI.",
    usedIn: "Portfolio Studio & Web Clients",
    snippet: `# Type-Safe Agent Telemetry Schema
interface AgentTracePacket {
  readonly traceId: string;
  readonly stepIndex: number;
  readonly latencyMs: number;
  readonly status: 'pending' | 'success' | 'error';
  readonly tokenCount: number;
}`
  },
  { 
    id: "sql", 
    name: "Advanced SQL", 
    color: "#d97706", 
    hex: "#d97706",
    colorNum: 0xd97706,
    radius: 4.3, 
    speed: 0.32, 
    yOffset: 0.5, 
    icon: "📜", 
    tag: "Query Engine", 
    category: "languages", 
    level: 93,
    desc: "Complex window functions, query plan analysis, indexing, and high-volume analytical joins.",
    usedIn: "Micropro & Financial Data Pipelines",
    snippet: `-- Analytical P95 Latency Window Function
SELECT 
    agent_id,
    AVG(latency_ms) OVER(PARTITION BY model_name) AS avg_model_latency,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY latency_ms) OVER() AS p95_latency
FROM telemetry_traces;`
  },
  { 
    id: "cpp", 
    name: "C++ & OOP", 
    color: "#64748b", 
    hex: "#64748b",
    colorNum: 0x64748b,
    radius: 4.9, 
    speed: -0.27, 
    yOffset: -0.7, 
    icon: "⚙️", 
    tag: "Low-Level", 
    category: "languages", 
    level: 88,
    desc: "Object-oriented software design, memory management, and high-performance algorithms.",
    usedIn: "Data Structures & Algorithms",
    snippet: `// Zero-Allocation Ring Buffer for Packet Tracing
template<typename T, size_t Capacity>
class LockFreeRingBuffer {
    std::array<T, Capacity> buffer;
    std::atomic<size_t> head{0}, tail{0};
public:
    void push(const T& item) { buffer[head.fetch_add(1) % Capacity] = item; }
};`
  },

  // --- Data Engineering & Databases ---
  { 
    id: "postgres", 
    name: "PostgreSQL", 
    color: "#4f46e5", 
    hex: "#4f46e5",
    colorNum: 0x4f46e5,
    radius: 3.1, 
    speed: 0.46, 
    yOffset: 0.5, 
    icon: "🐘", 
    tag: "Database", 
    category: "data", 
    level: 92,
    desc: "ACID relational schema design, complex analytical joins, and Alembic migrations.",
    usedIn: "Backend Data Stores",
    snippet: `-- High-Speed Composite Covering Index
CREATE INDEX CONCURRENTLY idx_traces_agent_timestamp 
ON agent_execution_traces (agent_id, created_at DESC) 
INCLUDE (latency_ms, tokens_used);`
  },
  { 
    id: "redis", 
    name: "Redis Cache", 
    color: "#dc2626", 
    hex: "#dc2626",
    colorNum: 0xdc2626,
    radius: 3.8, 
    speed: -0.38, 
    yOffset: -0.4, 
    icon: "🟥", 
    tag: "In-Memory", 
    category: "data", 
    level: 94,
    desc: "Sub-millisecond key-value caching, Pub/Sub channels, and distributed rate limiting.",
    usedIn: "VisionVault & OrchestrAI Queues",
    snippet: `# Atomic Redis Pub/Sub Dispatch
async with redis.pipeline(transaction=True) as pipe:
    pipe.lpush("queue:tasks", json.dumps(task_payload))
    pipe.publish("events:new_task", task_payload["id"])
    await pipe.execute()`
  },
  { 
    id: "duckdb", 
    name: "DuckDB & OLAP", 
    color: "#b45309", 
    hex: "#b45309",
    colorNum: 0xb45309,
    radius: 5.1, 
    speed: -0.23, 
    yOffset: -0.2, 
    icon: "🦆", 
    tag: "OLAP Engine", 
    category: "data", 
    level: 90,
    desc: "Columnar analytical query engine for blazing fast local data transformations and parquet files.",
    usedIn: "Fast Analytical Data Pipelines",
    snippet: `# Sub-second OLAP Aggregation over Parquet
import duckdb
con = duckdb.connect()
df = con.execute("""
    SELECT step_name, count(*) AS total_steps, avg(duration_ms) AS avg_duration
    FROM 'telemetry_*.parquet' 
    GROUP BY 1 ORDER BY 3 DESC
""").df()`
  }
];

class TechGalaxyEngine {
  constructor() {
    this.container = null;
    this.badgesOverlay = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.galaxyGroup = null;
    this.starField = null;
    this.coreNode = null;
    this.nodeMeshes = [];
    this.badgeElements = [];
    this.activeFilter = 'all';

    // Drag / Orbit state
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.targetRotation = { x: 0.25, y: 0 };
    this.currentRotation = { x: 0.25, y: 0 };

    // 3D Hyperdrive Camera Warp state
    this.isWarping = false;
    this.warpTargetId = null;
    this.defaultCameraPos = new THREE.Vector3(0, 1.2, 9.2);
    this.targetCameraPos = new THREE.Vector3(0, 1.2, 9.2);
    this.currentLookAt = new THREE.Vector3(0, 0, 0);
    this.targetLookAt = new THREE.Vector3(0, 0, 0);

    this.onNodeHoverCallback = null;
    this.hoveredNodeId = null;
    this.clock = null;
    this.animId = null;
    this.isInitialized = false;

    this.tempVector = new THREE.Vector3();
    this.ambientLight = null;
    this.pointLight = null;
    this.concentricRingMeshes = [];
  }

  init(containerId, badgesOverlayId, onNodeHover) {
    this.container = document.getElementById(containerId);
    this.badgesOverlay = document.getElementById(badgesOverlayId);
    if (!this.container || this.isInitialized) return;

    this.onNodeHoverCallback = onNodeHover;
    this.clock = new THREE.Clock();

    const width = this.container.clientWidth || 900;
    const height = this.container.clientHeight || 420;

    // Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 1000);
    this.camera.position.copy(this.defaultCameraPos);
    this.camera.lookAt(0, 0, 0);

    // Renderer (transparent WebGL)
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // Root Group
    this.galaxyGroup = new THREE.Group();
    this.scene.add(this.galaxyGroup);

    // Ambient Lighting & Central Point Light
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(this.ambientLight);

    this.pointLight = new THREE.PointLight(0xffedd5, 2.2, 30);
    this.pointLight.position.set(0, 0, 0);
    this.scene.add(this.pointLight);

    // Build Sub-components
    this.createConcentricRings();
    this.createCentralCore();
    this.createStarField();
    this.createPlanetaryNodes();
    this.createHtmlBadges();

    // Check initial theme
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    this.updateTheme(currentTheme);

    this.bindEvents();
    this.animate();
    this.isInitialized = true;
  }

  createConcentricRings() {
    const ringRadii = [2.7, 3.0, 3.4, 3.7, 4.1, 4.4, 4.8, 5.1, 5.3];

    ringRadii.forEach((radius) => {
      const ringGeo = new THREE.RingGeometry(radius - 0.012, radius + 0.012, 96);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x94a3b8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.16
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.userData = { defaultColor: 0x94a3b8, defaultOpacity: 0.16 };
      this.concentricRingMeshes.push(ringMesh);
      this.galaxyGroup.add(ringMesh);
    });
  }

  createCentralCore() {
    const coreGroup = new THREE.Group();

    // Outer wireframe icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(0.65, 1);
    const icoMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      wireframe: true,
      emissive: 0x1e293b,
      emissiveIntensity: 0.3,
      roughness: 0.8
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    coreGroup.add(icoMesh);

    // Inner warm glowing sphere
    const innerGeo = new THREE.SphereGeometry(0.32, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xd9382e
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    this.coreNode = { group: coreGroup, ico: icoMesh, inner: innerMesh };
    this.galaxyGroup.add(coreGroup);
  }

  createStarField() {
    const count = 900;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color(0x94a3b8),
      new THREE.Color(0xcbd5e1),
      new THREE.Color(0xe2e8f0),
      new THREE.Color(0xd97706),
      new THREE.Color(0xffedd5)
    ];

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const r = 5 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.8;

      positions[idx] = r * Math.cos(phi) * Math.cos(theta);
      positions[idx + 1] = r * Math.sin(phi);
      positions[idx + 2] = r * Math.cos(phi) * Math.sin(theta);

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[idx] = color.r;
      colors[idx + 1] = color.g;
      colors[idx + 2] = color.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.35
    });

    this.starField = new THREE.Points(geo, mat);
    this.scene.add(this.starField);
  }

  createPlanetaryNodes() {
    this.nodeMeshes = [];
    const total = TECH_GALAXY_DATA.length;

    TECH_GALAXY_DATA.forEach((node, index) => {
      const nodeGroup = new THREE.Group();

      const sphereGeo = new THREE.SphereGeometry(0.18, 32, 32);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: node.colorNum,
        emissive: node.colorNum,
        emissiveIntensity: 0.45,
        roughness: 0.4,
        metalness: 0.5
      });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      nodeGroup.add(sphereMesh);

      const ringGeo = new THREE.RingGeometry(0.24, 0.28, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: node.colorNum,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      nodeGroup.add(ringMesh);

      this.galaxyGroup.add(nodeGroup);

      this.nodeMeshes.push({
        data: node,
        group: nodeGroup,
        sphere: sphereMesh,
        ring: ringMesh,
        index: index,
        phaseAngle: (index / total) * Math.PI * 2
      });
    });
  }

  createHtmlBadges() {
    if (!this.badgesOverlay) return;
    this.badgesOverlay.innerHTML = '';
    this.badgeElements = [];

    TECH_GALAXY_DATA.forEach((node) => {
      const badge = document.createElement('div');
      badge.className = 'cyber-galaxy-badge';
      badge.setAttribute('data-node-id', node.id);
      badge.style.setProperty('--c-node-color', node.hex);

      badge.innerHTML = `
        <div class="badge-inner">
          <span class="badge-icon">${node.icon}</span>
          <span class="badge-name">${node.name}</span>
          <span class="badge-tag">${node.tag}</span>
        </div>
      `;

      badge.addEventListener('mouseenter', () => {
        if (!this.isWarping) this.setHoveredNode(node.id);
      });

      badge.addEventListener('mouseleave', () => {
        if (!this.isWarping) this.clearHoveredNode();
      });

      badge.addEventListener('click', (e) => {
        e.stopPropagation();
        this.warpToNode(node.id);
      });

      this.badgesOverlay.appendChild(badge);
      this.badgeElements.push({ id: node.id, element: badge });
    });
  }

  // --- 3D Hyperdrive Camera Warp Flight ---
  warpToNode(nodeId) {
    const nodeObj = this.nodeMeshes.find(n => n.data.id === nodeId);
    if (!nodeObj) return;

    this.isWarping = true;
    this.warpTargetId = nodeId;
    this.setHoveredNode(nodeId);

    // Get current world position of target node
    const worldPos = new THREE.Vector3();
    nodeObj.group.getWorldPosition(worldPos);

    // Calculate camera target offset
    this.targetCameraPos.set(worldPos.x * 0.75, worldPos.y + 0.4, worldPos.z + 1.8);
    this.targetLookAt.copy(worldPos);

    // Show Holographic Detail Modal
    this.showNodeModal(nodeObj.data);
  }

  exitWarp() {
    this.isWarping = false;
    this.warpTargetId = null;
    this.targetCameraPos.copy(this.defaultCameraPos);
    this.targetLookAt.set(0, 0, 0);

    const modal = document.getElementById('galaxyNodeModal');
    if (modal) modal.classList.remove('active');
    this.clearHoveredNode();
  }

  showNodeModal(node) {
    let modal = document.getElementById('galaxyNodeModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'galaxyNodeModal';
      modal.className = 'galaxy-node-modal';
      if (this.container) this.container.appendChild(modal);
    }

    modal.style.setProperty('--c-node-color', node.hex);
    modal.innerHTML = `
      <div class="node-modal-header">
        <div class="node-modal-icon-title">
          <span>${node.icon}</span>
          <span>${node.name}</span>
          <span style="font-size:0.72rem; font-family:var(--font-mono); padding:0.1rem 0.4rem; border-radius:4px; background:rgba(255,255,255,0.1);">${node.tag}</span>
        </div>
        <button class="node-modal-close-btn" id="btnExitGalaxyWarp">Exit Warp [Esc] ✕</button>
      </div>

      <p class="node-modal-desc">${node.desc}</p>

      <div class="node-modal-code-block">${node.snippet || '// Production architecture snippet available in repo'}</div>

      <div class="node-modal-meta">
        <span>💼 <strong>Deployed in:</strong> ${node.usedIn}</span>
        <span>⚡ <strong>Proficiency:</strong> ${node.level}%</span>
      </div>
    `;

    modal.classList.add('active');

    const exitBtn = document.getElementById('btnExitGalaxyWarp');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.exitWarp();
      });
    }
  }

  setHoveredNode(id) {
    this.hoveredNodeId = id;
    const nodeObj = this.nodeMeshes.find(n => n.data.id === id);

    if (nodeObj) {
      nodeObj.sphere.material.emissiveIntensity = 3.2;
      nodeObj.group.scale.set(1.4, 1.4, 1.4);

      if (this.onNodeHoverCallback) {
        this.onNodeHoverCallback(nodeObj.data);
      }
    }

    this.badgeElements.forEach(b => {
      if (b.id === id) {
        b.element.classList.add('active');
      } else {
        b.element.classList.remove('active');
      }
    });
  }

  clearHoveredNode() {
    if (this.hoveredNodeId) {
      const prev = this.nodeMeshes.find(n => n.data.id === this.hoveredNodeId);
      if (prev) {
        prev.sphere.material.emissiveIntensity = 1.5;
        prev.group.scale.set(1, 1, 1);
      }
      this.hoveredNodeId = null;
    }

    this.badgeElements.forEach(b => b.element.classList.remove('active'));
  }

  setFilter(categoryKey) {
    this.activeFilter = categoryKey;

    this.nodeMeshes.forEach(nodeObj => {
      const isMatch = (categoryKey === 'all' || nodeObj.data.category === categoryKey);
      nodeObj.sphere.material.opacity = isMatch ? 1 : 0.12;
      nodeObj.sphere.material.transparent = !isMatch;
      nodeObj.ring.material.opacity = isMatch ? 0.75 : 0.05;
      nodeObj.ring.material.transparent = true;
    });

    this.badgeElements.forEach(b => {
      const nodeData = TECH_GALAXY_DATA.find(n => n.id === b.id);
      const isMatch = (categoryKey === 'all' || nodeData.category === categoryKey);
      b.element.style.display = isMatch ? 'block' : 'none';
    });

    if (categoryKey !== 'all') {
      const firstMatch = TECH_GALAXY_DATA.find(n => n.category === categoryKey);
      if (firstMatch) {
        this.setHoveredNode(firstMatch.id);
      }
    } else {
      this.clearHoveredNode();
    }
  }

  bindEvents() {
    const el = this.container;
    if (!el) return;

    el.addEventListener('mousedown', (e) => {
      if (this.isWarping) return;
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging && !this.isWarping) {
        const deltaX = e.clientX - this.previousMousePosition.x;
        const deltaY = e.clientY - this.previousMousePosition.y;

        this.targetRotation.y += deltaX * 0.005;
        this.targetRotation.x += deltaY * 0.005;
        this.targetRotation.x = Math.max(-0.6, Math.min(0.8, this.targetRotation.x));

        this.previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isWarping) {
        this.exitWarp();
      }
    });

    window.addEventListener('resize', () => this.onResize());
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth || 900;
    const height = this.container.clientHeight || 420;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animId = requestAnimationFrame(() => this.animate());

    const delta = this.clock ? this.clock.getDelta() : 0.016;
    const elapsedTime = this.clock ? this.clock.getElapsedTime() : Date.now() * 0.001;

    // Smooth Camera Flight / Warp Lerp
    this.camera.position.lerp(this.targetCameraPos, 0.07);
    this.currentLookAt.lerp(this.targetLookAt, 0.07);
    this.camera.lookAt(this.currentLookAt);

    // Auto Slow Galaxy Drift (paused during warp flight)
    if (!this.isDragging && !this.isWarping) {
      this.targetRotation.y += delta * 0.08;
    }

    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.06;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.06;

    this.galaxyGroup.rotation.y = this.currentRotation.y;
    this.galaxyGroup.rotation.x = this.currentRotation.x;

    // Central Core Pulse
    if (this.coreNode) {
      this.coreNode.ico.rotation.y -= delta * 0.4;
      this.coreNode.ico.rotation.x += delta * 0.2;
      const pulse = 1 + Math.sin(elapsedTime * 2.5) * 0.08;
      this.coreNode.group.scale.set(pulse, pulse, pulse);
    }

    // Star Field Drift & Hyperdrive Warp Particle Stretches
    if (this.starField) {
      this.starField.rotation.y += delta * 0.02;
    }

    // Dynamic Orbital Physics
    const width = this.container.clientWidth || 900;
    const height = this.container.clientHeight || 420;

    this.nodeMeshes.forEach((nodeObj) => {
      const node = nodeObj.data;
      const speedMult = this.isWarping && this.warpTargetId === node.id ? 0.05 : 1.0;
      const t = elapsedTime * node.speed * speedMult + (nodeObj.phaseAngle || 0);

      const posX = Math.cos(t) * node.radius;
      const posZ = Math.sin(t) * node.radius;
      const posY = node.yOffset + Math.sin(t * 1.5) * 0.25;

      nodeObj.group.position.set(posX, posY, posZ);
      nodeObj.ring.rotation.y += 0.02;

      // Project 3D Coordinates to 2D HTML Badges
      const badgeObj = this.badgeElements.find(b => b.id === node.id);
      if (badgeObj && this.badgesOverlay) {
        this.tempVector.set(posX, posY + 0.35, posZ);
        this.tempVector.applyMatrix4(this.galaxyGroup.matrixWorld);
        this.tempVector.project(this.camera);

        const x = (this.tempVector.x * 0.5 + 0.5) * width;
        const y = (-(this.tempVector.y * 0.5) + 0.5) * height;

        badgeObj.element.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0)`;
        badgeObj.element.style.zIndex = Math.round((1 - this.tempVector.z) * 100);

        if (this.tempVector.z > 1.0 || this.isWarping) {
          badgeObj.element.style.opacity = this.isWarping && this.warpTargetId === node.id ? '1' : '0';
        } else {
          badgeObj.element.style.opacity = nodeObj.sphere.material.opacity;
        }
      }
    });

    this.renderer.render(this.scene, this.camera);
  }

  updateTheme(theme = 'light') {
    const isLight = theme === 'light';

    if (this.ambientLight) {
      this.ambientLight.intensity = isLight ? 1.6 : 0.9;
    }
    if (this.pointLight) {
      this.pointLight.color.setHex(0xffedd5);
      this.pointLight.intensity = isLight ? 2.5 : 3.0;
    }

    if (this.coreNode) {
      if (isLight) {
        this.coreNode.ico.material.color.setHex(0x64748b);
        this.coreNode.ico.material.emissive.setHex(0x334155);
        this.coreNode.ico.material.emissiveIntensity = 0.2;
        this.coreNode.inner.material.color.setHex(0xd9382e);
      } else {
        this.coreNode.ico.material.color.setHex(0x475569);
        this.coreNode.ico.material.emissive.setHex(0x1e293b);
        this.coreNode.ico.material.emissiveIntensity = 0.3;
        this.coreNode.inner.material.color.setHex(0xd9382e);
      }
    }

    if (this.concentricRingMeshes) {
      this.concentricRingMeshes.forEach(mesh => {
        if (isLight) {
          mesh.material.color.setHex(0x94a3b8);
          mesh.material.opacity = 0.18;
        } else {
          mesh.material.color.setHex(0x475569);
          mesh.material.opacity = 0.22;
        }
      });
    }

    if (this.starField) {
      this.starField.material.blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;
      this.starField.material.opacity = isLight ? 0.25 : 0.45;
    }
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.remove();
    }
    this.isInitialized = false;
  }
}

export const techGalaxy = new TechGalaxyEngine();
