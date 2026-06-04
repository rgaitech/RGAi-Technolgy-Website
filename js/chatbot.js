/* ============================================================
   CHATBOT.JS — Custom AI Chatbot Widget (Local AI Assistant)
   ============================================================ */
(function initChatbot() {
  'use strict';

  // Dynamically load CSS if not already loaded
  if (!document.querySelector('link[href="css/chatbot.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/chatbot.css';
    document.head.appendChild(link);
  }

  // State
  let intents = [];
  let isChatbotOpen = false;
  let hasGreeted = false;

  // DOM Elements - Inject dynamically if not present
  let toggleBtn = document.querySelector('.chatbot-toggle');
  let windowEl = document.querySelector('.chatbot-window');

  if (!toggleBtn || !windowEl) {
    const chatbotContainer = document.createElement('div');
    chatbotContainer.innerHTML = `
      <button class="chatbot-toggle" aria-label="Open chat assistant">
        <span class="chatbot-badge">1</span>
        <svg class="chatbot-toggle-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:#fff;">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <svg class="chatbot-toggle-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:#fff;">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div class="chatbot-window">
        <div class="chatbot-header">
          <div class="chatbot-avatar">🤖</div>
          <div class="chatbot-header-info">
            <div class="chatbot-header-name">ARIA Assistant</div>
            <div class="chatbot-header-status">Online</div>
          </div>
          <button class="chatbot-min-btn" aria-label="Minimize chat">—</button>
        </div>
        <div class="chatbot-messages"></div>
        <div class="chatbot-input-wrap">
          <input type="text" class="chatbot-input" placeholder="Type a message..." aria-label="Message chatbot" />
          <button class="chatbot-send" aria-label="Send message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    `;
    
    // Append in document order
    while (chatbotContainer.childNodes.length > 0) {
      document.body.appendChild(chatbotContainer.firstChild);
    }

    toggleBtn = document.querySelector('.chatbot-toggle');
    windowEl = document.querySelector('.chatbot-window');
  }

  const messagesEl = document.querySelector('.chatbot-messages');
  const inputEl = document.querySelector('.chatbot-input');
  const sendBtn = document.querySelector('.chatbot-send');
  const badgeEl = document.querySelector('.chatbot-badge');

  if (!toggleBtn || !windowEl || !messagesEl || !inputEl || !sendBtn) {
    console.warn('Chatbot DOM elements not found. Skipping initialization.');
    return;
  }

  // Fallback Local Intents (if fetch fails or runs offline)
  const localFallbackIntents = [
    {
      "tag": "greeting",
      "patterns": ["hi", "hello", "hey", "howdy", "good morning", "good afternoon", "good evening", "namaste", "hii", "helo"],
      "responses": [
        "👋 Hello! Welcome to RGAi Technology. How can I help you today?",
        "Hi there! 🤖 I'm ARIA, RGAi's AI assistant. What can I help you with?",
        "Hey! Welcome to RGAi Technology 🚀 Ask me anything about our services!"
      ],
      "suggestions": ["Our Services", "Get a Quote", "Contact Us", "About RGAi"]
    },
    {
      "tag": "about",
      "patterns": ["who are you", "what is rgai", "about rgai", "tell me about", "company info", "what do you do", "rgai technology"],
      "responses": [
        "🏢 RGAi Technology Pvt. Ltd. is a premium AI & digital solutions company based in Mumbai, India.\n\nWe specialise in:\n• 🌐 Website Development\n• 📱 Mobile App Development\n• 🤖 AI Solutions & AI Agents\n• ⚙️ Business Automation\n• 📈 Digital Marketing & SEO\n• 🎨 UI/UX Design\n\nWith 200+ happy clients and 500+ projects delivered!"
      ],
      "suggestions": ["Our Services", "View Portfolio", "Meet the Team", "Get a Quote"]
    },
    {
      "tag": "services",
      "patterns": ["services", "what do you offer", "what can you build", "offerings", "solutions", "help me with"],
      "responses": [
        "🛠️ Here are our core services:\n\n🌐 **Website Development** — React, Next.js, Custom CMS\n📱 **Mobile Apps** — React Native, Flutter (iOS & Android)\n🤖 **AI Solutions** — ML models, NLP, Computer Vision\n⚡ **AI Agents** — Autonomous bots & workflow automation\n📈 **Digital Marketing** — Social media, PPC, Email\n🔍 **SEO Services** — On-page, Technical, Link Building\n⚙️ **Business Automation** — RPA, API integration\n🎨 **UI/UX Design** — Figma, Design Systems\n\nWhich service interests you?"
      ],
      "suggestions": ["Web Development", "Mobile Apps", "AI Solutions", "SEO Services", "Get Pricing"]
    },
    {
      "tag": "pricing",
      "patterns": ["price", "cost", "how much", "pricing", "rates", "charges", "budget", "affordable", "cheap", "quote", "estimate"],
      "responses": [
        "💰 Our pricing is transparent and competitive:\n\n🌐 Website Development: ₹15,000 – ₹2,00,000+\n📱 Mobile App: ₹50,000 – ₹5,00,000+\n🤖 AI Solutions: ₹30,000 – ₹3,00,000+\n📈 Digital Marketing: ₹8,000 – ₹50,000/month\n🔍 SEO Services: ₹8,000 – ₹30,000/month\n🎨 UI/UX Design: ₹10,000 – ₹1,00,000+\n⚙️ Automation: ₹20,000 – ₹2,00,000+\n\n*All prices vary based on scope & complexity.\n\nWant a precise quote? WhatsApp us or visit our Contact page!"
      ],
      "suggestions": ["WhatsApp Now", "Contact Us", "Free Consultation"]
    },
    {
      "tag": "contact",
      "patterns": ["contact", "reach you", "phone number", "email", "address", "location", "office", "call", "whatsapp number"],
      "responses": [
        "📞 Here's how to reach us:\n\n📧 Email: rgai.tech@gmail.com\n📱 WhatsApp: +91 9579098477\n📍 Mumbai, Maharashtra, India\n⏰ Mon–Sat: 9 AM – 7 PM IST\n\nThe fastest way to reach us is WhatsApp — we reply instantly!"
      ],
      "suggestions": ["WhatsApp Now", "Send Email", "Contact Page"]
    },
    {
      "tag": "thanks",
      "patterns": ["thank", "thanks", "thank you", "great", "awesome", "perfect", "nice", "good", "helpful"],
      "responses": [
        "You're welcome! 😊 Is there anything else I can help you with?",
        "Happy to help! 🎉 Feel free to ask if you have more questions.",
        "Anytime! 🚀 Remember, we're just a WhatsApp message away for detailed discussions!"
      ],
      "suggestions": ["More Questions", "WhatsApp Us", "Get Started"]
    },
    {
      "tag": "fallback",
      "patterns": [],
      "responses": [
        "🤔 I'm not sure about that specific query. Let me connect you with our team!\n\n📱 WhatsApp: +91 9579098477\n📧 Email: rgai.tech@gmail.com\n\nOr you can ask me about our services, pricing, or portfolio!",
        "I didn't quite catch that! 😊 Could you rephrase? Or choose from the options below:"
      ],
      "suggestions": ["Our Services", "Pricing", "Portfolio", "WhatsApp Us"]
    }
  ];

  // Load Intents from JSON
  async function loadKnowledgeBase() {
    try {
      const response = await fetch('data/knowledge.json');
      if (!response.ok) throw new Error('Failed to load chatbot data');
      const data = await response.json();
      intents = data.intents || localFallbackIntents;
    } catch (error) {
      console.warn('Could not load knowledge.json, falling back to local dataset.', error);
      intents = localFallbackIntents;
    }
  }

  // Toggle Chatbot Window
  function toggleChatbot() {
    isChatbotOpen = !isChatbotOpen;
    if (isChatbotOpen) {
      windowEl.classList.add('open');
      toggleBtn.classList.add('open');
      if (badgeEl) badgeEl.classList.add('hidden'); // Clear notifications
      if (!hasGreeted) {
        showGreeting();
        hasGreeted = true;
      }
      setTimeout(() => inputEl.focus(), 350);
    } else {
      windowEl.classList.remove('open');
      toggleBtn.classList.remove('open');
    }
  }

  // Show Greeting
  function showGreeting() {
    const greetingIntent = intents.find(i => i.tag === 'greeting') || localFallbackIntents[0];
    const greetingText = greetingIntent.responses[Math.floor(Math.random() * greetingIntent.responses.length)];
    
    // Show bot message
    appendMessage(greetingText, 'bot');
    renderSuggestions(greetingIntent.suggestions);
  }

  // Format Timestamp
  function getFormattedTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 12 instead of 0
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  }

  // Append Message to Chat Area
  function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;

    const time = getFormattedTime();

    if (sender === 'bot') {
      msgDiv.innerHTML = `
        <div class="chat-msg-avatar">🤖</div>
        <div class="chat-bubble">
          <div class="chat-text">${formatMessageText(text)}</div>
          <div class="chat-time">${time}</div>
        </div>
      `;
    } else {
      msgDiv.innerHTML = `
        <div class="chat-msg-avatar">👤</div>
        <div class="chat-bubble">
          <div class="chat-text">${escapeHTML(text)}</div>
          <div class="chat-time">${time}</div>
        </div>
      `;
    }

    messagesEl.appendChild(msgDiv);
    scrollToBottom();
    return msgDiv;
  }

  // Format message text (support simple markdown-like formatting for bold/bullet points)
  function formatMessageText(text) {
    let html = escapeHTML(text);
    // Replace **bold** with <strong>bold</strong>
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Replace newlines with <br>
    html = html.replace(/\n/g, '<br>');
    return html;
  }

  // Escape HTML helper
  function escapeHTML(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
  }

  // Scroll to bottom of chat
  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  // Render Suggestion Chips
  function renderSuggestions(suggestions) {
    // Remove old suggestions
    const existingSuggestions = document.querySelector('.chat-suggestions');
    if (existingSuggestions) {
      existingSuggestions.remove();
    }

    if (!suggestions || suggestions.length === 0) return;

    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'chat-suggestions';

    suggestions.forEach(suggestion => {
      const chip = document.createElement('button');
      chip.className = 'chat-chip';
      chip.textContent = suggestion;
      chip.addEventListener('click', () => {
        handleUserInput(suggestion);
      });
      suggestionsDiv.appendChild(chip);
    });

    windowEl.insertBefore(suggestionsDiv, windowEl.querySelector('.chatbot-input-wrap'));
    scrollToBottom();
  }

  // Handle User Input Submission
  function handleUserInput(input) {
    if (!input || input.trim() === '') return;
    
    // Add user message to UI
    appendMessage(input, 'user');
    inputEl.value = '';
    
    // Remove suggestions
    const existingSuggestions = document.querySelector('.chat-suggestions');
    if (existingSuggestions) existingSuggestions.remove();

    // Show typing indicator
    const typingIndicator = showTypingIndicator();

    // Generate AI response
    setTimeout(() => {
      // Remove typing indicator
      typingIndicator.remove();

      const response = generateAIResponse(input);
      appendMessage(response.text, 'bot');
      renderSuggestions(response.suggestions);
    }, 600 + Math.random() * 600); // Realistic delay
  }

  // Show Typing Indicator
  function showTypingIndicator() {
    const indicatorDiv = document.createElement('div');
    indicatorDiv.className = 'chat-msg bot typing-indicator-container';
    indicatorDiv.innerHTML = `
      <div class="chat-msg-avatar">🤖</div>
      <div class="typing-indicator">
        <div class="typing-dots">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `;
    messagesEl.appendChild(indicatorDiv);
    scrollToBottom();
    return indicatorDiv;
  }

  // Normalize String
  function normalizeString(str) {
    return str
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?\u2014]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  // Generate AI Response (Local Matching Engine)
  function generateAIResponse(userInput) {
    const normalizedInput = normalizeString(userInput);
    const inputWords = normalizedInput.split(" ");
    
    let bestMatch = null;
    let highestScore = 0;

    intents.forEach(intent => {
      if (intent.tag === 'fallback') return;

      intent.patterns.forEach(pattern => {
        const normalizedPattern = normalizeString(pattern);
        
        // Match 1: Exact Phrase Match
        if (normalizedInput === normalizedPattern) {
          bestMatch = intent;
          highestScore = 100; // Perfect match
        }
        
        // Match 2: Contains Exact Substring
        if (normalizedInput.includes(normalizedPattern) && highestScore < 80) {
          bestMatch = intent;
          highestScore = 80;
        }

        // Match 3: Word overlap scoring
        const patternWords = normalizedPattern.split(" ");
        let overlap = 0;

        patternWords.forEach(w => {
          if (inputWords.includes(w)) {
            overlap++;
          }
        });

        if (overlap > 0) {
          const score = (overlap / patternWords.length) * 50;
          if (score > highestScore) {
            highestScore = score;
            bestMatch = intent;
          }
        }
      });
    });

    // If score is too low, use fallback
    let matchedIntent = bestMatch;
    if (!bestMatch || highestScore < 15) {
      matchedIntent = intents.find(i => i.tag === 'fallback') || localFallbackIntents.find(i => i.tag === 'fallback');
    }

    const responses = matchedIntent.responses;
    const responseText = responses[Math.floor(Math.random() * responses.length)];
    const suggestions = matchedIntent.suggestions || [];

    return {
      text: responseText,
      suggestions: suggestions
    };
  }

  // Event Listeners
  toggleBtn.addEventListener('click', toggleChatbot);

  // Close when clicking minimize
  const minBtn = document.querySelector('.chatbot-min-btn');
  if (minBtn) {
    minBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleChatbot();
    });
  }

  // Send message events
  sendBtn.addEventListener('click', () => {
    handleUserInput(inputEl.value);
  });

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleUserInput(inputEl.value);
    }
  });

  // Load knowledge base
  loadKnowledgeBase();

})();
