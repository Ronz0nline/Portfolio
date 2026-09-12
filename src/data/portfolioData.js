/**
 * Structured Portfolio Data for Rohan Rakshe
 * Maintained with verified credentials, academic distinctions, and engineering architectures.
 */

export const portfolioData = {
  identity: {
    name: "Rohan Rakshe",
    title: "Computer Science × Intelligent Systems",
    location: "Pune, Maharashtra, India",
    coordinates: "18.5204° N, 73.8567° E",
    bio: "Computer science student and software architect based in Pune, India. Bridging rigorous mathematical foundations with native mobile engineering and generative artificial intelligence. Focused on resilient, deterministic software that calculates truth at the boundary of hardware and cloud.",
    quote: "Building intelligent systems from algorithms, data, and computation.",
    contact: {
      email: "rohanrakshe8@gmail.com",
      phone: "+91 8600728359",
      linkedin: "https://linkedin.com/in/rohan-rakshe",
      github: "https://github.com/rohanrakshe",
      resumeUrl: "#"
    }
  },

  disciplines: [
    {
      id: "01",
      name: "Machine Learning & AI",
      category: "Probabilistic Learning",
      description: "Formulating regression diagnostics, stochastic gradient descents, parameter tuning, and LLM reasoning pipelines.",
      stack: ["Python", "PyTorch", "Scikit-Learn", "Gemini API"],
      color: "#B76545",
      meshFocus: { rotX: 0.2, rotY: 0.5, scale: 1.25, color: 0xb76545 }
    },
    {
      id: "02",
      name: "Computer Vision",
      category: "Spatial Geometry",
      description: "Discrete pixel operations, edge extraction kernel masks, facial landmark tracking, and real-time video transformation.",
      stack: ["OpenCV", "NumPy", "Spatial Tracking", "Convolution"],
      color: "#7F4636",
      meshFocus: { rotX: -0.3, rotY: 1.1, scale: 1.2, color: 0x7f4636 }
    },
    {
      id: "03",
      name: "Native Systems",
      category: "Hardware Boundary",
      description: "Native Android Kotlin architectures, BLE protocol packet negotiation, deterministic concurrency, and Room SQLite caching.",
      stack: ["C++", "Kotlin", "Jetpack Compose", "Android BLE"],
      color: "#B76545",
      meshFocus: { rotX: 0.6, rotY: 2.2, scale: 1.3, color: 0xb76545 }
    },
    {
      id: "04",
      name: "Web Engineering",
      category: "Interactive Surfaces",
      description: "Performance-oriented responsive web platforms, clean CSS composition, asynchronous streams, and dynamic 3D data visualization.",
      stack: ["HTML5", "Modern CSS", "ES6+", "WebGL / Three.js"],
      color: "#8D887E",
      meshFocus: { rotX: -0.5, rotY: -0.8, scale: 1.15, color: 0x8d887e }
    },
    {
      id: "05",
      name: "Retrieval & Grounding",
      category: "Deterministic Indexing",
      description: "Semantic vector embedding, recursive text chunking, hybrid BM25 + dense cosine scoring, and hallucination reduction.",
      stack: ["Embeddings", "Cosine Metric", "HNSW Graphs", "Vector Spaces"],
      color: "#B76545",
      meshFocus: { rotX: 0.1, rotY: 3.14, scale: 1.25, color: 0xb76545 }
    },
    {
      id: "06",
      name: "Quantum Paradigms",
      category: "Frontier Explorations",
      description: "Exploratory mathematical analysis of qubit state vectors, Bloch sphere rotations, and quantum linear algebra primitives.",
      stack: ["Qubit States", "Complex Matrices", "Bloch Sphere", "Proofs"],
      color: "#7F4636",
      meshFocus: { rotX: 0.8, rotY: -1.8, scale: 1.35, color: 0x7f4636 }
    }
  ],

  methodology: [
    {
      code: "01 / ISO",
      name: "Isolate",
      description: "Locate the true physical, hardware, and algorithmic constraints before writing a single line of implementation.",
      metric: "Constraint Mapping"
    },
    {
      code: "02 / ACQ",
      name: "Acquire",
      description: "Scrub, normalize, and inspect edge data distributions to uncover bias, noise, and boundary anomalies.",
      metric: "Zero-Leakage Ingestion"
    },
    {
      code: "03 / BEN",
      name: "Benchmark",
      description: "Draft targeted proof-of-concept tests, latency ceilings, and empirical baseline metrics.",
      metric: "Empirical Baseline"
    },
    {
      code: "04 / FOR",
      name: "Formulate",
      description: "Establish state boundaries, algebraic representations, and deterministic algorithmic pathways.",
      metric: "Mathematical Rigor"
    },
    {
      code: "05 / STR",
      name: "Streamline",
      description: "Prune redundant passes, cache hot paths, reduce instruction cycles, and enforce memory discipline.",
      metric: "Sub-millisecond Bounds"
    },
    {
      code: "06 / INT",
      name: "Integrate",
      description: "Build graceful fail-safes, offline-first fallback caches, and robust background synchronization queues.",
      metric: "Resilient Concurrency"
    },
    {
      code: "07 / VER",
      name: "Verify",
      description: "Measure empirical results under adversarial edge conditions, low signal strength, and offline limits.",
      metric: "Field Proven"
    }
  ],

  projects: [
    {
      id: "01",
      badge: "Case Study 01 // Research & Software Award Winner",
      title: "MarkMe — Proximity-Based Smart Attendance System",
      type: "Offline-First Native Android & Cryptographic BLE",
      award: "1st Place Winner — Software Development & Research Competition",
      problem: "Academic institutions lose substantial pedagogical time to manual roll-calls and proxy sign-ins. Existing RFID card readers or GPS coordinates fail indoors, cause bottlenecks, or burden users with friction.",
      architecture: "Native Android client utilizing Bluetooth Low Energy (BLE) peripheral beacons. Deployed dynamic rolling UUID cryptographic rotation to eliminate replay attacks, combined with strictly calibrated RSSI signal boundaries (-68 dBm cutoff) to ensure physical in-room presence.",
      implementation: "Offline-first architecture powered by Jetpack Compose UI, Room SQLite local caching, and opportunistic background synchronization to Firebase upon network re-establishment.",
      result: "Instantaneous verification in <350ms with 0% proxy vulnerability during on-campus testing trials. Honored with 1st place in the college research & software development symposium.",
      stack: ["Kotlin", "Jetpack Compose", "Android BLE", "Room DB", "Firebase"],
      metrics: {
        latency: "<350ms Handshake",
        threshold: "-68 dBm Cutoff",
        security: "Rolling UUID Salting"
      },
      pipeline: [
        { step: "BEACON", label: "BLE Peripheral Broadcast" },
        { step: "SALT", label: "Time-slotted Dynamic UUID" },
        { step: "RSSI", label: "Threshold Verification (-68dBm)" },
        { step: "ROOM", label: "Local SQLite Atomic Commit" },
        { step: "SYNC", label: "Opportunistic Cloud Sync" }
      ]
    },
    {
      id: "02",
      badge: "Case Study 02 // Web Platform & Performance",
      title: "Tesla India Digital Platform",
      type: "Lightweight High-Performance Web Surface",
      award: "Technical Specification Engine",
      problem: "Electric vehicle specifications require contextual adaptation for Indian infrastructure parameters, road typography, and thermal ambient operating environments.",
      architecture: "Zero-bloat responsive web platform built purely with semantic HTML5, modern CSS grids, and modular JavaScript without heavy JavaScript framework runtime overhead.",
      implementation: "Features an interactive mathematical specification comparison engine calculating real-time range curves, battery thermal degradation, and energy cost amortization against localized tariffs.",
      result: "Achieved sub-second initial paint, 100/100 Lighthouse performance metrics, and fluid responsive adaptability across all screen dimensions from 320px mobile to 4K ultra-wide displays.",
      stack: ["HTML5", "Modern CSS3", "JavaScript ES6+", "Canvas Engine"],
      metrics: {
        bundle: "18KB Gzipped Core",
        fps: "60 FPS Smooth Scaling",
        lighthouse: "100 Performance Score"
      },
      pipeline: [
        { step: "SPEC INPUT", label: "Vehicle Variant Selection" },
        { step: "AMBIENT", label: "Thermal & Road Factor Matrix" },
        { step: "DECAY MODEL", label: "Battery Degradation Equation" },
        { step: "PROJECTION", label: "Cost & Range Amortization" }
      ]
    },
    {
      id: "03",
      badge: "Case Study 03 // Competitive Hackathon Sprint",
      title: "Finovexa — AI Budgeting Engine",
      type: "Generative AI + Financial Ledger Parsing",
      award: "Built & Deployed in 3.0-Hour Strict Sprint",
      problem: "Individual financial tracking is hindered by irregular transaction statements across varied banking formats, making unified categorization tedious.",
      architecture: "Couples Google Gemini API zero-shot reasoning chains with Pandas CSV parsing to provide real-time budget health diagnosis, anomaly detection, and actionable savings advice.",
      implementation: "Engineered during a high-intensity 3-hour competitive hackathon. Streamlit interface with asynchronous background parsing, automatic column normalization, and prompt-engineered financial guardrails.",
      result: "Fully operational deployment delivered under the 3-hour time constraint, capable of parsing arbitrary statement schemas and returning categorized insights in <800ms.",
      stack: ["Python", "Google Gemini API", "Pandas", "Streamlit"],
      metrics: {
        velocity: "3.0 Hours Conception to Production",
        parsing: "Schema-Agnostic CSV Handling",
        reasoning: "Zero-Shot Financial Health Scoring"
      },
      pipeline: [
        { step: "RAW CSV", label: "Multi-Format Ledger Upload" },
        { step: "NORMALIZE", label: "Pandas Column Schema Alignment" },
        { step: "REASONING", label: "Gemini Structured Zero-Shot Chain" },
        { step: "DIAGNOSTIC", label: "Health Score & Spending Breakdown" }
      ]
    }
  ],

  ragKnowledgeBase: [
    {
      id: "chunk_101",
      topic: "markme_security",
      queryKeywords: ["markme", "proxy", "attendance", "ble", "rssi", "beacon", "spoof"],
      score: 0.964,
      latency: "38ms",
      title: "Chunk #184 — MarkMe BLE Cryptographic Verification Layer",
      excerpt: "MarkMe generates rolling time-slotted cryptographic UUIDs paired with strictly calibrated RSSI signal thresholds (-68dBm cutoff), preventing replay packets, signal reflection attacks, and unauthorized remote attendance logging."
    },
    {
      id: "chunk_102",
      topic: "finovexa_core",
      queryKeywords: ["finovexa", "budget", "finance", "gemini", "hackathon", "csv", "pandas"],
      score: 0.982,
      latency: "31ms",
      title: "Chunk #104 — Finovexa Zero-Shot Reasoning Architecture",
      excerpt: "Finovexa couples Google Gemini API zero-shot reasoning chains with Pandas vector ledger parsing to normalize heterogeneous financial statement exports and categorize discretionary spending under strict latency limits."
    },
    {
      id: "chunk_103",
      topic: "tesla_platform",
      queryKeywords: ["tesla", "vehicle", "degradation", "battery", "range", "css", "web"],
      score: 0.974,
      latency: "29ms",
      title: "Chunk #072 — Tesla India Specification Model",
      excerpt: "Pure semantic web platform built with responsive CSS grids and modular JavaScript mathematical modules calculating ambient battery depreciation curves and range degradation under localized Indian thermal factors."
    },
    {
      id: "chunk_104",
      topic: "education_pedagogy",
      queryKeywords: ["education", "degree", "college", "mmcc", "university", "pune", "bba"],
      score: 0.951,
      latency: "44ms",
      title: "Chunk #012 — Academic Trajectory & Institutional Honors",
      excerpt: "Rohan Rakshe studies Bachelor of Business Administration in Computer Applications (BBA CA) at Marathwada Mitra Mandal College of Commerce (MMCC), Pune University, with secondary foundational schooling at Army Public School (APS)."
    },
    {
      id: "chunk_105",
      topic: "math_stats",
      queryKeywords: ["math", "statistics", "award", "tech setu", "competition", "proofs", "linear algebra"],
      score: 0.978,
      latency: "35ms",
      title: "Chunk #045 — Tech Setu Mathematics & Statistics Distinction",
      excerpt: "Awarded 2nd Place in the Pune Inter-College Tech Setu Competition for rigorous analytical proofs, probabilistic machine learning formulations, and statistical inference modeling."
    }
  ],

  trajectory: [
    {
      year: "Award",
      tag: "1ST PLACE // RESEARCH & SOFTWARE",
      title: "Winner — Software Development & Research Competition",
      institution: "Pune Regional Symposium",
      detail: "Awarded top honors for designing, defending, and live-demonstrating the MarkMe offline-first BLE cryptographic attendance protocol.",
      accent: "#B76545"
    },
    {
      year: "Award",
      tag: "2ND PLACE // MATHEMATICS & STATS",
      title: "Tech Setu Inter-College Competition",
      institution: "Tech Setu Academic Committee",
      detail: "Distinction in advanced numerical proofs, probabilistic distributions, linear algebra systems, and statistical inference rigor.",
      accent: "#7F4636"
    },
    {
      year: "Degree",
      tag: "UNDERGRADUATE STUDIES",
      title: "Marathwada Mitra Mandal College of Commerce (MMCC)",
      institution: "Savitribai Phule Pune University",
      detail: "Bachelor of Business Administration in Computer Applications (BBA CA). Core study of data structures, algorithm analysis, relational database design, and object-oriented systems.",
      accent: "#8D887E"
    },
    {
      year: "Foundation",
      tag: "SECONDARY EDUCATION",
      title: "Army Public School (APS)",
      institution: "APS Alumni",
      detail: "Scientific discipline, systematic analytical problem-solving, and foundational mastery of physical and mathematical sciences.",
      accent: "#8D887E"
    }
  ],

  frontier: [
    {
      tag: "01 // Quantum Superposition",
      title: "Quantum Probability Matrices",
      description: "Exploring qubit state spaces and Hilbert space projections for combinatorial optimization and high-dimensional vector orthogonalization.",
      status: "EXPLORING"
    },
    {
      tag: "02 // Spatial Models",
      title: "Visual World Priors",
      description: "Investigating generative visual world models that anticipate spatial state transitions prior to hardware action in physical environments.",
      status: "RESEARCHING"
    },
    {
      tag: "03 // Consensus Graphs",
      title: "Multi-Agent Critique Networks",
      description: "Decentralized networks where specialized autonomous sub-agents negotiate, critique, and cryptographically verify logical deductions.",
      status: "EXPLORING"
    },
    {
      tag: "04 // Edge Silicon",
      title: "Sub-Milliwatt Neuromorphic Compute",
      description: "Spike-timing mechanisms enabling event-driven inference on embedded microcontroller nodes without thermal throttling or cloud tethering.",
      status: "RESEARCHING"
    }
  ]
};
