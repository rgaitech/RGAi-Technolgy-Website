/* ============================================================
   JS/LABS.JS — RGAi Labs Ecosystem Scripts
   ============================================================ */
'use strict';

document.addEventListener('loaderDone', initLabsEcosystem);
if (!document.getElementById('loader')) initLabsEcosystem();

function initLabsEcosystem() {
  initSPARouter();
  initMobileSidebar();
  initRGPTChat();
  initPlayground();
  initAgentBuilder();
  initKnowledgeBase();
  initAcademyQuiz();
  initClientPortal();
  initProjectTracker();
  initCRMTable();
  initEnterpriseDashboard();
  initWebsiteAuditor();
  initSEOAuditor();
  initLiveAnalyticsChart();
  initCommunityForums();
  initReferralProgram();
  initThreeGlobe();
  initNeuralNetworkCanvas();
}

/* ==================== 0. SPA Router & Navigation ==================== */
function initSPARouter() {
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  const panels = document.querySelectorAll('.lab-panel');

  function switchTab(tabId) {
    // Hide all panels
    panels.forEach(p => p.classList.remove('active'));
    // Deactivate sidebar links
    sidebarItems.forEach(i => i.classList.remove('active'));

    const targetPanel = document.getElementById(`panel-${tabId}`);
    const targetLink = document.querySelector(`.sidebar-item[data-tab="${tabId}"]`);

    if (targetPanel && targetLink) {
      targetPanel.classList.add('active');
      targetLink.classList.add('active');
    }

    // Custom Triggers for canvas resizing / updates
    if (tabId === 'globe') {
      window.dispatchEvent(new Event('resize-globe'));
    } else if (tabId === 'neural') {
      window.dispatchEvent(new Event('resize-neural'));
    }
  }

  sidebarItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const tabId = item.getAttribute('data-tab');
      switchTab(tabId);
      
      // Close sidebar on mobile
      const sidebar = document.getElementById('labsSidebar');
      if (sidebar) sidebar.classList.remove('open');
    });
  });

  // Handle direct url hashes on page load
  const hash = window.location.hash.substring(1);
  if (hash) {
    switchTab(hash);
  }
}

function initMobileSidebar() {
  const toggleBtn = document.getElementById('sidebarMobileToggle');
  const sidebar = document.getElementById('labsSidebar');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }
}

/* ==================== 1. RGPT Chat Simulator ==================== */
function initRGPTChat() {
  const input = document.getElementById('rgptInput');
  const send = document.getElementById('rgptSend');
  const messages = document.getElementById('rgptChatMessages');

  if (!input || !send || !messages) return;

  const localReplies = [
    "I've analyzed your script tags. Optimize performance by using 'async' or 'defer' parameters to prevent DOM render blocks.",
    "RGAi's model pipelines support multi-agent orchestrations. We recommend setting structured outputs via Pydantic templates.",
    "To build a responsive canvas background, bind window resize listeners and throttle drawing loops with RequestAnimationFrame.",
    "For enterprise rate throttling, configure API gateway rules to reject envelopes exceeding 1,000 queries per minute."
  ];

  function handleSend() {
    const text = input.value.trim();
    if (!text) return;

    // Append user message
    appendMessage(text, 'user');
    input.value = '';

    // Append typing indicator
    const typing = document.createElement('div');
    typing.className = 'rgpt-msg bot typing';
    typing.innerHTML = `<div class="rgpt-avatar">RG</div><div class="rgpt-msg-content">Thinking...</div>`;
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;

    // Simulate model inference delay
    setTimeout(() => {
      typing.remove();
      const reply = localReplies[Math.floor(Math.random() * localReplies.length)];
      appendMessage(reply, 'bot');
    }, 1200);
  }

  function appendMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = `rgpt-msg ${sender}`;
    const avatar = sender === 'bot' ? 'RG' : 'US';
    msg.innerHTML = `
      <div class="rgpt-avatar">${avatar}</div>
      <div class="rgpt-msg-content">${text}</div>
    `;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  send.addEventListener('click', handleSend);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
  });
}

/* ==================== 2. AI Model Playground ==================== */
function initPlayground() {
  const tempSlider = document.getElementById('pgTemp');
  const tempVal = document.getElementById('tempVal');
  const tokensSlider = document.getElementById('pgTokens');
  const tokensVal = document.getElementById('tokensVal');
  const runBtn = document.getElementById('pgRun');
  const body = document.getElementById('pgBody');
  const meta = document.getElementById('pgMeta');

  if (!tempSlider || !runBtn || !body) return;

  tempSlider.addEventListener('input', () => { tempVal.textContent = tempSlider.value; });
  tokensSlider.addEventListener('input', () => { tokensVal.textContent = tokensSlider.value; });

  runBtn.addEventListener('click', () => {
    body.textContent = "Connecting to computational cluster...\n";
    meta.textContent = "Latency: Connecting... | Tokens: 0";
    
    let dots = 0;
    const interval = setInterval(() => {
      dots = (dots + 1) % 4;
      body.textContent = "Invoking inference pipeline" + ".".repeat(dots) + "\n";
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      body.textContent = "";
      
      const response = `[Inference Success] Model: ${document.getElementById('pgModel').value}
Parameters: temp=${tempSlider.value}, max_tokens=${tokensSlider.value}

Streaming output:
----------------------------------------
import torch
import torch.nn as nn

class ResidualBlock(nn.Module):
    def __init__(self, channels):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(channels, channels, 3, padding=1),
            nn.BatchNorm2d(channels),
            nn.ReLU(inplace=True),
            nn.Conv2d(channels, channels, 3, padding=1),
            nn.BatchNorm2d(channels)
        )
    def forward(self, x):
        return x + self.conv(x)

# Model initialization success. Rate limits stable.`;

      // Simulating typewriter streaming
      let charIdx = 0;
      body.textContent = "";
      const streamTimer = setInterval(() => {
        body.textContent += response[charIdx];
        charIdx++;
        if (charIdx >= response.length) {
          clearInterval(streamTimer);
          const latency = 120 + Math.floor(Math.random() * 40);
          meta.textContent = `Latency: ${latency}ms | Tokens: 128 | Output: SUCCESS`;
        }
        body.scrollTop = body.scrollHeight;
      }, 5);

    }, 1500);
  });
}

/* ==================== 3. Agent Builder ==================== */
function initAgentBuilder() {
  const buildBtn = document.getElementById('btnBuildAgent');
  const consoleEl = document.getElementById('agentConsole');

  if (!buildBtn || !consoleEl) return;

  buildBtn.addEventListener('click', () => {
    const name = document.getElementById('agentName').value.trim();
    const role = document.getElementById('agentRole').value.trim();
    
    consoleEl.innerHTML = `<div class="console-line system">[SYSTEM] Compiling environment configurations for agent: '${name}'...</div>`;
    
    const steps = [
      { t: 800, c: "system", text: `[SYSTEM] Injecting system directives & memory keys...` },
      { t: 1500, c: "action", text: `[ACTION] Building executable sandbox. Permitting authorized tool APIs...` },
      { t: 2300, c: "observation", text: `[OBSERVATION] Sandbox initialized. Compiling execution loop.` },
      { t: 3000, c: "system", text: `[SYSTEM] Backstory configured: "${role.substring(0, 45)}..."` },
      { t: 3800, c: "success", text: `🚀 Agent '${name}' compiled successfully! Ready to receive webhook queries.` }
    ];

    steps.forEach(step => {
      setTimeout(() => {
        const div = document.createElement('div');
        div.className = `console-line ${step.c}`;
        div.textContent = step.text;
        consoleEl.appendChild(div);
        consoleEl.scrollTop = consoleEl.scrollHeight;
      }, step.t);
    });
  });
}

/* ==================== 4. Knowledge Base ==================== */
function initKnowledgeBase() {
  const listItems = document.querySelectorAll('#kbDocList li');
  const contentArea = document.getElementById('kbContentArea');

  if (!listItems || !contentArea) return;

  const docs = {
    "api-intro": `
      <h3>API Introduction</h3>
      <p>Welcome to the RGAi Technology Developer API. Our endpoint architectures enable seamless integration of language model inferences, autonomous agents workflows, and database updates into your enterprise setups.</p>
      <pre><code>curl -X POST https://api.rgai.tech/v1/chat \
  -H "Authorization: Bearer RGAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "aria-v2",
    "prompt": "Hello!"
  }'</code></pre>
    `,
    "sdk-setup": `
      <h3>Node SDK Quickstart</h3>
      <p>Install the RGAi core library directly from npm to build server-side automation scripts:</p>
      <pre><code>npm install @rgai/sdk --save</code></pre>
      <p>Configure project instances in your application files:</p>
      <pre><code>const { RGAiAgent } = require('@rgai/sdk');
const agent = new RGAiAgent({ apiKey: 'YOUR_API_KEY' });</code></pre>
    `,
    "auth-guide": `
      <h3>Authentication & Security</h3>
      <p>All API request payloads must include your bearer tokens in the authorization header envelopes. Secure your keys in environment configurations and never commit them to public code repositories.</p>
      <pre><code>Authorization: Bearer rgai_live_8f3d...</code></pre>
    `,
    "agent-tools": `
      <h3>Defining Custom Agent Tools</h3>
      <p>Expand agent capabilities by linking dedicated custom functions they can invoke programmatically:</p>
      <pre><code>agent.registerTool({
  name: "fetchStockRates",
  description: "Queries current rates for active stocks symbols.",
  handler: async (symbol) => {
    return await database.fetchSymbol(symbol);
  }
});</code></pre>
    `
  };

  listItems.forEach(item => {
    item.addEventListener('click', () => {
      listItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      const docKey = item.getAttribute('data-doc');
      contentArea.innerHTML = docs[docKey] || "<h3>Document not found</h3>";
    });
  });
}

/* ==================== 5. AI Academy Portal ==================== */
function initAcademyQuiz() {
  const nodes = document.querySelectorAll('.chapter-node');
  const viewer = document.getElementById('chapterViewerArea');

  if (!nodes || !viewer) return;

  const contentMap = {
    "chap-1": {
      title: "Chapter 1: Agent Foundations",
      desc: "In this module, you will explore the primary execution loop of an autonomous agent: plan, act, observe, and iterate. Learn why typical chat interactions are static, and how loops unlock autonomous reasoning.",
      question: "Which design pattern describes an agent reasoning steps before executing actions?",
      opts: [
        { text: "ReAct (Reasoning + Acting)", correct: true },
        { text: "Simple Zero-Shot Prompting", correct: false },
        { text: "Stochastic Gradient Descent", correct: false }
      ]
    },
    "chap-2": {
      title: "Chapter 2: Tool Calling Systems",
      desc: "Learn the protocols regulating function calls in generative pipelines. Understand JSON schema constraints, function signature formatting, and backend handling of tool execution payloads.",
      question: "How does a model signal it needs to call a registered tool?",
      opts: [
        { text: "It returns a specific JSON object with tool name and arguments", correct: true },
        { text: "It throws a standard HTTP 500 error", correct: false },
        { text: "It shuts down the client connection instantly", correct: false }
      ]
    },
    "chap-3": {
      title: "Chapter 3: Multi-Agent Orchestration",
      desc: "Scale autonomous networks. Design systems of specialist agents that query other nodes, assign sub-tasks, compile reports, and evaluate result sets in collaborative workspace clusters.",
      question: "What is the benefit of a multi-agent setup compared to a single large prompt?",
      opts: [
        { text: "Specialized roles prevent context drift and boost reliability", correct: true },
        { text: "It runs faster and consumes fewer tokens", correct: false },
        { text: "It requires no backend configuration", correct: false }
      ]
    }
  };

  function setupQuizHandlers() {
    const quizOpts = viewer.querySelectorAll('.quiz-opt');
    const feedback = viewer.querySelector('.quiz-feedback');
    
    quizOpts.forEach(opt => {
      opt.addEventListener('click', () => {
        const isCorrect = opt.getAttribute('data-correct') === 'true';
        quizOpts.forEach(o => o.classList.remove('correct-select', 'incorrect-select'));
        
        if (isCorrect) {
          opt.classList.add('correct-select');
          feedback.style.color = '#10B981';
          feedback.textContent = "✅ Correct! Great job.";
        } else {
          opt.classList.add('incorrect-select');
          feedback.style.color = '#EF4444';
          feedback.textContent = "❌ Incorrect. Try again!";
        }
      });
    });
  }

  nodes.forEach(node => {
    node.addEventListener('click', () => {
      nodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');

      const chapKey = node.getAttribute('data-chap');
      const data = contentMap[chapKey];
      
      if (data) {
        viewer.innerHTML = `
          <h3>${data.title}</h3>
          <p>${data.desc}</p>
          <div class="quiz-box">
            <h4>Check Your Knowledge</h4>
            <p>${data.question}</p>
            <div class="quiz-opts">
              ${data.opts.map(o => `<button class="quiz-opt" data-correct="${o.correct}">${o.text}</button>`).join('')}
            </div>
            <div class="quiz-feedback"></div>
          </div>
        `;
        setupQuizHandlers();
      }
    });
  });

  setupQuizHandlers();
}

/* ==================== 6. Client Portal ==================== */
function initClientPortal() {
  const codeInput = document.getElementById('portalCode');
  const authBtn = document.getElementById('btnPortalAuth');
  const authCard = document.getElementById('portalAuthCard');
  const dashboard = document.getElementById('portalDashboardArea');
  const tabLinks = document.querySelectorAll('.pg-menu li');
  const contentArea = document.getElementById('portalPaneContent');

  if (!codeInput || !authBtn || !dashboard) return;

  authBtn.addEventListener('click', () => {
    if (codeInput.value === '2026') {
      authCard.classList.add('hidden');
      dashboard.classList.remove('hidden');
    } else {
      alert("❌ Invalid Access Code. Hint: 2026");
      codeInput.value = '';
    }
  });

  const paneDocs = {
    "overview": `
      <h3>Project Status Overview</h3>
      <div class="project-headline-status">
        <strong>Project:</strong> Enterprise AI Agent Implementation<br>
        <strong>Status:</strong> <span class="badge-status-green">In QA Testing</span><br>
        <strong>Est. Delivery:</strong> June 18, 2026
      </div>
      <div class="progress-bar-wrap"><div class="progress-bar" style="width: 85%;"></div></div>
    `,
    "files": `
      <h3>Shared Documents Workspace</h3>
      <p>Secure shared directory containing project deliverables:</p>
      <ul class="tc-cert-list">
        <li><span>📄 System Architecture Proposal.pdf</span> <button class="btn btn-secondary btn-xs">Download</button></li>
        <li><span>📂 API Integration Spec.json</span> <button class="btn btn-secondary btn-xs">Download</button></li>
        <li><span>📄 Milestone 2 Completion Report.pdf</span> <button class="btn btn-secondary btn-xs">Download</button></li>
      </ul>
    `,
    "billing": `
      <h3>Invoices & Contract Details</h3>
      <p>Verify contract financial records:</p>
      <ul class="tc-cert-list">
        <li><span>🧾 Invoice #2026-004 (Paid)</span> <button class="btn btn-secondary btn-xs">Receipt</button></li>
        <li><span>🧾 Invoice #2026-005 (Pending)</span> <button class="btn btn-primary btn-xs">Pay Now</button></li>
      </ul>
    `
  };

  tabLinks.forEach(link => {
    link.addEventListener('click', () => {
      tabLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      const paneKey = link.getAttribute('data-pane');
      contentArea.innerHTML = paneDocs[paneKey] || "<h3>Page not found</h3>";
    });
  });
}

/* ==================== 7. Project Tracker (Kanban) ==================== */
function initProjectTracker() {
  const cards = document.querySelectorAll('.kanban-card');
  const cols = ["backlog", "progress", "qa", "done"];

  function updateCounts() {
    cols.forEach(col => {
      const el = document.getElementById(`col-${col}`);
      const countEl = el.closest('.kanban-col').querySelector('.kc-count');
      if (el && countEl) {
        countEl.textContent = el.children.length;
      }
    });
  }

  function moveCard(card, direction) {
    const parentColId = card.parentElement.id.replace('col-', '');
    const currentIdx = cols.indexOf(parentColId);
    let newIdx = currentIdx;

    if (direction === 'next' && currentIdx < cols.length - 1) {
      newIdx++;
    } else if (direction === 'prev' && currentIdx > 0) {
      newIdx--;
    }

    if (newIdx !== currentIdx) {
      const destinationCol = document.getElementById(`col-${cols[newIdx]}`);
      if (destinationCol) {
        destinationCol.appendChild(card);
        setupCardButtons(card, cols[newIdx]);
        updateCounts();
      }
    }
  }

  function setupCardButtons(card, colId) {
    const btnBox = card.querySelector('.card-btns') || card;
    // Remove existing move buttons
    const oldBtns = card.querySelectorAll('.btn-card-move');
    oldBtns.forEach(b => b.remove());

    const idx = cols.indexOf(colId);

    if (idx === 0) {
      // Only show Next
      const nextBtn = document.createElement('button');
      nextBtn.className = 'btn-card-move';
      nextBtn.textContent = '→';
      nextBtn.addEventListener('click', () => moveCard(card, 'next'));
      card.appendChild(nextBtn);
    } else if (idx === cols.length - 1) {
      // Only show Prev
      const prevBtn = document.createElement('button');
      prevBtn.className = 'btn-card-move';
      prevBtn.textContent = '←';
      prevBtn.addEventListener('click', () => moveCard(card, 'prev'));
      card.appendChild(prevBtn);
    } else {
      // Show both
      const wrap = document.createElement('div');
      wrap.className = 'card-btns';
      
      const prevBtn = document.createElement('button');
      prevBtn.className = 'btn-card-move';
      prevBtn.textContent = '←';
      prevBtn.addEventListener('click', () => moveCard(card, 'prev'));
      
      const nextBtn = document.createElement('button');
      nextBtn.className = 'btn-card-move';
      nextBtn.textContent = '→';
      nextBtn.addEventListener('click', () => moveCard(card, 'next'));
      
      wrap.appendChild(prevBtn);
      wrap.appendChild(nextBtn);
      card.appendChild(wrap);
    }
  }

  cards.forEach(card => {
    const parentId = card.parentElement.id.replace('col-', '');
    setupCardButtons(card, parentId);
  });

  updateCounts();
}

/* ==================== 8. CRM Pipeline ==================== */
function initCRMTable() {
  const addBtn = document.getElementById('btnCRMAdd');
  const tableBody = document.getElementById('crmTableBody');

  if (!addBtn || !tableBody) return;

  addBtn.addEventListener('click', () => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>New Client</td>
      <td>Acme Ltd</td>
      <td>₹2,50,000</td>
      <td>
        <select class="crm-stage-select">
          <option value="contacted" selected>Initial Contact</option>
          <option value="proposal">Proposal Sent</option>
          <option value="negotiating">Negotiations</option>
          <option value="won">Closed Won</option>
        </select>
      </td>
      <td><button class="btn-table-delete">Delete</button></td>
    `;
    tableBody.appendChild(tr);
    setupCRMRowHandlers(tr);
  });

  function setupCRMRowHandlers(tr) {
    const delBtn = tr.querySelector('.btn-table-delete');
    if (delBtn) {
      delBtn.addEventListener('click', () => tr.remove());
    }
  }

  tableBody.querySelectorAll('tr').forEach(tr => setupCRMRowHandlers(tr));
}

/* ==================== 9. Enterprise Panel ==================== */
function initEnterpriseDashboard() {
  const keyStr = document.getElementById('apiKeyStr');
  const copyBtn = document.getElementById('btnCopyAPIKey');
  const regenBtn = document.getElementById('btnRegenAPIKey');

  if (!keyStr || !copyBtn || !regenBtn) return;

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText("rgai_live_8f3d1e9f0c2a8b3d7e5f6g");
    copyBtn.textContent = "Copied!";
    setTimeout(() => { copyBtn.textContent = "Copy Key"; }, 1500);
  });

  regenBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to regenerate this live API Key? Active integrations will be broken.")) {
      const hex = Array.from({length: 20}, () => Math.floor(Math.random()*16).toString(16)).join('');
      keyStr.textContent = `rgai_live_${hex.substring(0, 6)}...${hex.substring(14, 18)}`;
      
      const charges = document.getElementById('entCharges');
      if (charges) charges.textContent = "₹0.00";
    }
  });
}

/* ==================== 10. Website Auditor ==================== */
function initWebsiteAuditor() {
  const runBtn = document.getElementById('btnRunWebAudit');
  const results = document.getElementById('webAuditResults');
  
  if (!runBtn || !results) return;

  runBtn.addEventListener('click', () => {
    results.classList.add('hidden');
    runBtn.textContent = "Auditing Site...";
    
    // Simulate circular progress ticks
    setTimeout(() => {
      runBtn.textContent = "Analyze URL";
      results.classList.remove('hidden');

      const scoreElements = [
        { id: "scorePerf", val: 94 },
        { id: "scoreAccess", val: 88 },
        { id: "scoreBest", val: 90 }
      ];

      scoreElements.forEach(item => {
        const circle = document.getElementById(item.id);
        if (circle) {
          const dash = 283;
          const offset = dash - (item.val / 100) * dash;
          circle.style.strokeDashoffset = offset;
        }
      });

    }, 2000);
  });
}

/* ==================== 11. SEO Auditor ==================== */
function initSEOAuditor() {
  const runBtn = document.getElementById('btnRunSeoAudit');
  const results = document.getElementById('seoAuditResults');

  if (!runBtn || !results) return;

  runBtn.addEventListener('click', () => {
    results.classList.add('hidden');
    runBtn.textContent = "Scanning SEO Tags...";

    setTimeout(() => {
      runBtn.textContent = "Scan SEO Elements";
      results.classList.remove('hidden');
    }, 1800);
  });
}

/* ==================== 12. Live Analytics ==================== */
function initLiveAnalyticsChart() {
  const canvas = document.getElementById('liveLatencyChart');
  if (!canvas) return;

  const data = {
    labels: ['1s ago', '2s ago', '3s ago', '4s ago', '5s ago', '6s ago', '7s ago'],
    datasets: [{
      label: 'API Request Latency (ms)',
      data: [120, 142, 115, 130, 95, 110, 105],
      borderColor: '#0066FF',
      backgroundColor: 'rgba(0, 102, 255, 0.05)',
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }]
  };

  const chart = new Chart(canvas, {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: 'rgba(255,255,255,0.5)' } },
        x: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: 'rgba(255,255,255,0.5)' } }
      }
    }
  });

  // Simulate real-time updates
  setInterval(() => {
    if (!document.getElementById('panel-analytics-dashboard').classList.contains('active')) return;
    
    const newVal = 90 + Math.floor(Math.random() * 60);
    chart.data.datasets[0].data.shift();
    chart.data.datasets[0].data.push(newVal);
    chart.update();
  }, 2000);
}

/* ==================== 13. Community Forums ==================== */
function initCommunityForums() {
  const upvoteBtn = document.querySelector('.ct-btn-upvote');
  if (upvoteBtn) {
    upvoteBtn.addEventListener('click', () => {
      upvoteBtn.textContent = "▲ Upvoted (15)";
      upvoteBtn.style.color = '#10B981';
      upvoteBtn.style.borderColor = 'rgba(16,185,129,0.2)';
    });
  }
}

/* ==================== 14. Referral Program ==================== */
function initReferralProgram() {
  const copyBtn = document.getElementById('btnCopyRefLink');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText("https://rgai.tech/ref?id=rg_partner_9a3c");
      copyBtn.textContent = "Copied!";
      setTimeout(() => { copyBtn.textContent = "Copy Link"; }, 1500);
    });
  }
}

/* ==================== 16. WebGL Globe (Three.js) ==================== */
function initThreeGlobe() {
  const container = document.getElementById('labsGlobeContainer');
  if (!container || typeof THREE === 'undefined') return;

  let renderer, scene, camera, globe, particles;
  
  function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 8;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Globe geometry
    const geometry = new THREE.SphereGeometry(2.5, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: 0x0066FF,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // Dynamic Server Nodes (small glowing meshes)
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x7C3AED });
    const nodeGeo = new THREE.SphereGeometry(0.06, 8, 8);
    
    // Add 8 random node connections
    for(let i=0; i<8; i++) {
      const mesh = new THREE.Mesh(nodeGeo, nodeMaterial);
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 2.5;

      mesh.position.x = r * Math.sin(phi) * Math.cos(theta);
      mesh.position.y = r * Math.sin(phi) * Math.sin(theta);
      mesh.position.z = r * Math.cos(phi);
      globe.add(mesh);
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0x0066FF, 0.8);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);

    animate();
  }

  function animate() {
    requestAnimationFrame(animate);
    if (globe) {
      globe.rotation.y += 0.003;
      globe.rotation.x += 0.001;
    }
    renderer.render(scene, camera);
  }

  // Handle panel resizing
  window.addEventListener('resize-globe', () => {
    setTimeout(() => {
      if (renderer && camera && container) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      }
    }, 100);
  });

  window.addEventListener('resize', () => {
    if (renderer && camera && container) {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
  });

  init();
}

/* ==================== 17. Neural Network Canvas ==================== */
function initNeuralNetworkCanvas() {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let nodes = [];
  let signals = [];

  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;
    setupNetwork();
  }

  function setupNetwork() {
    nodes = [];
    // Define 3 Layers: Input (3), Hidden (4), Output (2)
    const layers = [3, 4, 2];
    const layerSpacing = width / (layers.length + 1);
    
    layers.forEach((count, lIdx) => {
      const x = layerSpacing * (lIdx + 1);
      const nodeSpacing = height / (count + 1);
      
      for(let i=0; i<count; i++) {
        nodes.push({
          x: x,
          y: nodeSpacing * (i + 1),
          layer: lIdx,
          id: `${lIdx}-${i}`,
          pulse: 0
        });
      }
    });
  }

  function pulseData() {
    // Send signals from all nodes in Layer 0
    nodes.filter(n => n.layer === 0).forEach(n => {
      sendSignalsFrom(n);
    });
  }

  function sendSignalsFrom(sourceNode) {
    const targets = nodes.filter(n => n.layer === sourceNode.layer + 1);
    targets.forEach(t => {
      signals.push({
        x: sourceNode.x,
        y: sourceNode.y,
        tx: t.x,
        ty: t.y,
        progress: 0,
        targetNode: t
      });
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw Synaptic Connections
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    nodes.forEach(n => {
      const targets = nodes.filter(t => t.layer === n.layer + 1);
      targets.forEach(t => {
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(t.x, t.y);
        ctx.stroke();
      });
    });

    // Draw Signals (Pulsing data waves)
    signals.forEach((sig, idx) => {
      sig.progress += 0.02;
      
      const cx = sig.x + (sig.tx - sig.x) * sig.progress;
      const cy = sig.y + (sig.ty - sig.y) * sig.progress;

      ctx.fillStyle = '#0066FF';
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();

      // Upon reaching target, trigger target node pulse and propagate
      if (sig.progress >= 1) {
        sig.targetNode.pulse = 1;
        sendSignalsFrom(sig.targetNode);
        signals.splice(idx, 1);
      }
    });

    // Draw Nodes
    nodes.forEach(n => {
      ctx.fillStyle = n.pulse > 0 ? '#0066FF' : 'rgba(255, 255, 255, 0.15)';
      ctx.strokeStyle = n.pulse > 0 ? '#10B981' : 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.arc(n.x, n.y, 8 + (n.pulse * 4), 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Cool node fading back to normal
      if (n.pulse > 0) {
        n.pulse -= 0.05;
      }
    });

    requestAnimationFrame(draw);
  }

  // Node controls
  document.getElementById('btnNeuralPulse').addEventListener('click', pulseData);
  document.getElementById('btnNeuralAddNode').addEventListener('click', () => {
    // Add custom hidden node to Layer 1 (index 1)
    const h1Nodes = nodes.filter(n => n.layer === 1);
    const x = width / 2;
    const count = h1Nodes.length + 1;
    const spacing = height / (count + 1);

    // Re-adjust existing hidden layer nodes
    h1Nodes.forEach((n, idx) => {
      n.y = spacing * (idx + 1);
    });

    nodes.push({
      x: x,
      y: spacing * count,
      layer: 1,
      id: `1-${count - 1}`,
      pulse: 0
    });
  });

  window.addEventListener('resize-neural', () => {
    setTimeout(resize, 100);
  });

  window.addEventListener('resize', resize);

  resize();
  draw();
  
  // Start with a default pulse after load
  setTimeout(pulseData, 1000);
}
