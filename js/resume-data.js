/* ==========================================================================
   KRISH RUPAREL — STRUCTURED RESUME & SYSTEM DATA
   ========================================================================== */

export const RESUME_DATA = {
  name: "Krish Ruparel",
  title: "AI Engineer & Distributed Systems Architect",
  tagline: "Building scalable multimodal RAG pipelines, agentic observability, and real-time distributed intelligence.",
  location: "Arlington, Texas 76013",
  email: "krishruparel.career@gmail.com",
  phone: "(682)-392-0214",
  socials: {
    github: "https://github.com/Krishr21",
    linkedin: "https://www.linkedin.com/in/krishruparel21/",
    portfolio: "https://portfolio-beta-one-nj2dqxay0f.vercel.app"
  },
  status: "Available for Fall 2026 & Spring 2027 Roles",
  education: [
    {
      institution: "University of Texas, Arlington",
      degree: "Master of Science - MS, Computer Science",
      period: "Aug 2025 – May 2027",
      gpa: "3.84 / 4.0",
      coursework: [
        "Advanced Algorithms",
        "Data Modelling",
        "Data Mining",
        "Artificial Intelligence",
        "Computer Vision"
      ]
    },
    {
      institution: "University of Pune",
      degree: "Bachelor of Engineering - BE, Computer Engineering",
      period: "Aug 2021 – May 2025",
      gpa: "3.4 / 4.0",
      coursework: [
        "Data Structures",
        "Database Management",
        "Software Engineering",
        "Machine Learning",
        "Cloud Computing and Big Data"
      ]
    }
  ],
  experience: [
    {
      company: "Utrecht IT Consulting",
      location: "Netherlands",
      role: "Automation & Integration Consultant",
      specialization: "Automation and Integration, Machine Learning, API Integration & Cost Optimization",
      period: "Oct 2024 – Aug 2025",
      metrics: ["+30% Event Throughput", "3 Production Pipelines Deployed", "Enterprise Governance"],
      bullets: [
        "Engineered custom SDK connectors leveraging Solace's pub/sub messaging model to decouple distributed data workflows.",
        "Improved real-time event processing throughput by 30% across high-load microservice pipelines.",
        "Embedded custom AI agents using Workato's Agent Studio to orchestrate enterprise workflows with built-in governance and security.",
        "Automated end-to-end operational workflows using Python, eliminating bottlenecks and enabling teams to ship reliable systems faster.",
        "Designed fault-tolerant, scalable cloud integration solutions adopted across three mission-critical production pipelines."
      ]
    },
    {
      company: "Micropro Solutions",
      location: "Nagpur, India",
      role: "Artificial Intelligence Engineering Intern",
      specialization: "Retrieval-Augmented Generation, Machine Learning, Data Analytics",
      period: "Mar 2024 – Sep 2024",
      metrics: ["Sub-second Hybrid Retrieval", "Real-Time WebSocket Replay", "Zero-Downtime Docker"],
      bullets: [
        "Deployed a multimodal RAG pipeline combining Whisper transcription and frame captioning to enable natural language video search.",
        "Built query-time retrieval over Qdrant and FAISS with cross-encoder reranking, improving precision and relevance at scale.",
        "Instrumented distributed AI services with OpenTelemetry and containerized the full stack via Docker Compose for production reliability.",
        "Streamed live agent runs using Redis Pub/Sub and WebSockets, enabling real-time monitoring and deterministic offline replay."
      ]
    }
  ],
  research: {
    title: "Reviewing Advances in Food Image Recognition and Nutritional Assessment: Focus on YOLOv8",
    venue: "Oral Presentation in IEEE Journal",
    github: "https://github.com/Krishr21",
    tags: ["Computer Science", "Data Cleaning/Preprocessing", "Data Augmentation", "YOLOv8", "3D Reconstruction"],
    bullets: [
      "Co-authored a peer-reviewed research paper, benchmarking YOLOv8 against Faster R-CNN and SSD across speed and accuracy metrics.",
      "Built and evaluated a custom Indian food dataset with varied lighting and resolution, achieving 82% recognition on a 1,000-image Indian food benchmark.",
      "Proposed an India-Food Dataset architecture with metadata on portion size and calorie content, addressing gaps in Food-101 and UEC-Food100.",
      "Analyzed 3D volume estimation techniques including stereo vision, GANs, and Structure from Motion (SfM).",
      "Identified scalable pathways for automating nutritional assessment in real-world dietary monitoring systems."
    ]
  },
  projects: [
    {
      id: "visionvault",
      title: "VisionVault",
      subtitle: "Multimodal Video RAG Pipeline & Semantic Knowledge Engine",
      role: "Software Engineer",
      skills: ["Multimodal RAG", "Whisper", "LlamaIndex", "Ollama", "Qdrant", "Cross-Encoder", "Async Python"],
      description: "A high-performance multimodal retrieval system combining video speech transcription (Whisper) and visual scene embeddings into time-aligned searchable vectors for instant conversational video QA.",
      bullets: [
        "Developed a multimodal RAG retrieval pipeline combining speech transcription and optional vision cues aligned into searchable chunks.",
        "Integrated LlamaIndex for optional RAG index construction and local LLM synthesis (Ollama) to enable 'ask questions about the video' workflows.",
        "Built query-time retrieval logic supporting multiple vector backends (Qdrant, FAISS) and tuned tradeoffs for speed vs accuracy via environment-configurable knobs.",
        "Upgraded embedding quality and improved retrieval precision using cross-encoder reranking and dynamic result filtering for higher relevance."
      ],
      metrics: [
        { label: "Vector Search", value: "Qdrant / FAISS" },
        { label: "Synthesis", value: "LlamaIndex + Ollama" },
        { label: "Precision", value: "Cross-Encoder Reranked" }
      ]
    },
    {
      id: "orchestrai",
      title: "OrchestrAI",
      subtitle: "Local-First Agent Observability & Deterministic Replay Platform",
      role: "Software Engineer",
      skills: ["FastAPI", "Postgres", "Redis Pub/Sub", "WebSockets", "Celery", "Next.js", "Docker", "OpenTelemetry"],
      description: "An enterprise-grade observability platform designed to inspect, trace, and deterministically replay complex multi-agent execution steps with zero data loss and sub-millisecond telemetry.",
      bullets: [
        "Built a local-first agent observability platform to record agent runs step-by-step with persistent storage in Postgres and migrations via Alembic.",
        "Executed real-time run streaming using Redis Pub/Sub + WebSockets and added deterministic replay plus offline evaluation pipelines using Celery.",
        "Instrumented services with OpenTelemetry, packaged the stack with Docker Compose and integrated both local and hosted LLM execution paths."
      ],
      metrics: [
        { label: "Latency", value: "< 10ms Telemetry" },
        { label: "Streaming", value: "Redis + WebSockets" },
        { label: "Replay", value: "100% Deterministic" }
      ]
    },
    {
      id: "carwise-ai",
      title: "CarWise-AI",
      subtitle: "Live AI Search Assistant Grounded with Google Gemini API",
      role: "Software Engineer",
      skills: ["Google Gemini API", "Search Grounding", "React", "TypeScript", "Real-Time Web API"],
      description: "An intelligent automotive discovery engine utilizing Google Gemini's native Search Grounding to eliminate AI hallucinations and stream verified real-time vehicle marketplace listings.",
      bullets: [
        "Built a live-search powered car discovery assistant using Google Gemini's native Search Grounding to fetch real, verifiable listings in real-time.",
        "Integrated Gemini Flash to auto-generate AI-driven pros, cons, and summaries for each listing, replacing hallucinated results with grounded web data.",
        "Designed a side-by-side comparison grid surfacing mileage, price, location, and source links for data-driven purchase decisions.",
        "Engineered graceful error handling for incomplete real-world listing data, ensuring reliable UX across inconsistent marketplace sources."
      ],
      metrics: [
        { label: "Grounding", value: "Google Search Grounding" },
        { label: "Model", value: "Gemini Flash" },
        { label: "Data Quality", value: "Zero Hallucination" }
      ]
    }
  ],
  skillsMatrix: {
    "Programming Languages": ["Python", "C++", "JavaScript (ES6+)", "SQL", "Java", "R", "CSS/HTML"],
    "AI & Machine Learning": ["Retrieval-Augmented Generation (RAG)", "Large Language Models (LLMs)", "LlamaIndex", "LangChain", "Qdrant", "FAISS", "PyTorch", "TensorFlow", "YOLOv8", "OpenCV", "Scikit-Learn", "NLTK", "SpaCy"],
    "Distributed Systems & Cloud": ["FastAPI", "Docker", "Redis Pub/Sub", "WebSockets", "Celery", "Kafka", "AWS", "Google Cloud", "Microsoft Azure", "Solace Messaging", "Airflow", "Linux"],
    "Data Engineering & Databases": ["PostgreSQL", "MySQL", "MongoDB", "DynamoDB", "Apache Spark", "PySpark", "Data Warehousing", "ETL Pipelines", "Tableau", "Power BI"],
    "Certifications": [
      "Full Stack Web Development – Apna College (WDM)",
      "Workato Automation Pro – I (WAP-01)",
      "Workato Automation Pro – II (WAP-02)",
      "Workato Automation Pro – III (WAP-03)"
    ]
  },
  quizQuestions: [
    {
      question: "What was the core technique Krish implemented in Micropro Solutions to boost RAG search precision?",
      options: [
        "Cross-encoder reranking over vector search results",
        "Keyword exact match with regular expressions",
        "Static TF-IDF indexing only",
        "Random document sampling"
      ],
      answerIndex: 0,
      explanation: "Krish built query-time retrieval over Qdrant/FAISS with cross-encoder reranking to refine dense semantic retrieval!"
    },
    {
      question: "How did Krish achieve a 30% throughput boost at Utrecht IT Consulting?",
      options: [
        "Custom SDK connectors using Solace's pub/sub messaging model",
        "Switching from Python to Assembly",
        "Manual data entry automation",
        "Disabling all database security checks"
      ],
      answerIndex: 0,
      explanation: "By engineering custom SDK connectors leveraging Solace pub/sub messaging to decouple distributed data workflows!"
    },
    {
      question: "In Krish's IEEE research paper on YOLOv8, what accuracy was achieved on the custom 1,000-image Indian Food benchmark?",
      options: [
        "82% recognition accuracy",
        "45% recognition accuracy",
        "99.9% synthetic score",
        "61% baseline score"
      ],
      answerIndex: 0,
      explanation: "The model achieved 82% recognition accuracy on the custom 1,000-image Indian food dataset benchmark!"
    }
  ]
};
