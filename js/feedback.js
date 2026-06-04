/* ============================================================
   FEEDBACK.JS — Live Reviews and Approval Moderation Panel Logic
   ============================================================ */
(function initFeedback() {
  'use strict';

  // 1. Firebase Configurations Placeholders
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  };

  // State Management
  let isFirebaseEnabled = false;
  let db = null;
  let reviews = []; // Main array in local-fallback mode
  let isAdminAuthenticated = false;

  // Default Mock Reviews for stunning visual demonstration
  const defaultMockReviews = [
    {
      id: 'mock-1',
      name: 'Rohan Sharma',
      company: 'Apex Digital Solutions',
      rating: 5,
      message: 'RGAi built a premium ecommerce site for us. The layout looks luxury, and the GSAP transitions are beautiful. Our client conversions increased by 40%!',
      approved: true,
      date: '2026-05-15T09:30:00Z'
    },
    {
      id: 'mock-2',
      name: 'Priya Patel',
      company: 'Zenith AI',
      rating: 5,
      message: 'We commissioned a custom workflow automation bot. RGAi delivered a beautiful Python-based pipeline that automates our invoice processing completely.',
      approved: true,
      date: '2026-05-24T14:45:00Z'
    },
    {
      id: 'mock-3',
      name: 'Vikram Singh',
      company: 'InnoTech Industries',
      rating: 4,
      message: 'Excellent Next.js frontend engineering. The modular structure they constructed is clean, making it extremely easy for our internal developers to scale.',
      approved: true,
      date: '2026-06-01T11:15:00Z'
    }
  ];

  // DOM Elements
  const tabFeedBtn = document.getElementById('tabFeedBtn');
  const tabFormBtn = document.getElementById('tabFormBtn');
  const tabAdminBtn = document.getElementById('tabAdminBtn');
  
  const contentFeed = document.getElementById('contentFeed');
  const contentForm = document.getElementById('contentForm');
  const contentAdmin = document.getElementById('contentAdmin');

  const starSelector = document.getElementById('starSelector');
  const ratingValInput = document.getElementById('fbRatingVal');

  const publicReviewsContainer = document.getElementById('publicReviewsContainer');
  const feedCount = document.getElementById('feedCount');
  const feedAvgRating = document.getElementById('feedAvgRating');

  const adminAuthCard = document.getElementById('adminAuthCard');
  const adminDashboardPanel = document.getElementById('adminDashboardPanel');
  const adminPasswordInput = document.getElementById('adminPassword');
  const adminAuthBtn = document.getElementById('adminAuthBtn');

  const admTotal = document.getElementById('admTotal');
  const admPending = document.getElementById('admPending');
  const admApproved = document.getElementById('admApproved');
  const moderationTableBody = document.getElementById('moderationTableBody');

  const feedbackForm = document.getElementById('feedbackForm');

  // --- INITIALIZATION ---
  function initDatabase() {
    // Check if Firebase compatibility scripts are imported and keys configured
    if (
      typeof firebase !== 'undefined' && 
      firebaseConfig.apiKey !== 'YOUR_API_KEY'
    ) {
      try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        isFirebaseEnabled = true;
        console.log('🔥 Firebase Initialized successfully.');
      } catch (error) {
        console.warn('Firebase initialization failed. Defaulting to local storage mode.', error);
        isFirebaseEnabled = false;
      }
    } else {
      console.log('📦 Firebase SDK not fully configured. Defaulting to LocalStorage Fallback Mode.');
      isFirebaseEnabled = false;
    }

    // Load initial data
    if (isFirebaseEnabled) {
      syncReviewsWithFirebase();
    } else {
      loadReviewsFromLocalStorage();
    }
  }

  // --- TAB NAVIGATION ---
  function switchTab(activeBtn, activeContent) {
    [tabFeedBtn, tabFormBtn, tabAdminBtn].forEach(b => b && b.classList.remove('active'));
    [contentFeed, contentForm, contentAdmin].forEach(c => c && c.classList.remove('active'));

    activeBtn.classList.add('active');
    activeContent.classList.add('active');

    // Trigger visual scroll trigger checks or entry animations
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  }

  if (tabFeedBtn && contentFeed) {
    tabFeedBtn.addEventListener('click', () => switchTab(tabFeedBtn, contentFeed));
  }
  if (tabFormBtn && contentForm) {
    tabFormBtn.addEventListener('click', () => switchTab(tabFormBtn, contentForm));
  }
  if (tabAdminBtn && contentAdmin) {
    tabAdminBtn.addEventListener('click', () => {
      switchTab(tabAdminBtn, contentAdmin);
      // If already logged in, refresh numbers
      if (isAdminAuthenticated) {
        refreshAdminDashboard();
      }
    });
  }

  // --- INTERACTIVE STAR RATING ---
  if (starSelector) {
    const stars = starSelector.querySelectorAll('.rating-star');
    
    stars.forEach(star => {
      // Hover In
      star.addEventListener('mouseenter', () => {
        const val = parseInt(star.getAttribute('data-value'));
        stars.forEach(s => {
          const sVal = parseInt(s.getAttribute('data-value'));
          s.classList.toggle('hovered', sVal <= val);
        });
      });

      // Hover Out
      star.addEventListener('mouseleave', () => {
        stars.forEach(s => s.classList.remove('hovered'));
      });

      // Lock Star Value
      star.addEventListener('click', () => {
        const val = parseInt(star.getAttribute('data-value'));
        ratingValInput.value = val;
        stars.forEach(s => {
          const sVal = parseInt(s.getAttribute('data-value'));
          s.classList.toggle('selected', sVal <= val);
        });
      });
    });

    // Default: set initial 5-star state
    const defaultVal = parseInt(ratingValInput.value) || 5;
    stars.forEach(s => {
      if (parseInt(s.getAttribute('data-value')) <= defaultVal) {
        s.classList.add('selected');
      }
    });
  }

  // --- DATABASE SYNC: LOCAL FALLBACK MODE ---
  function loadReviewsFromLocalStorage() {
    const localData = localStorage.getItem('rgai-reviews');
    if (localData) {
      reviews = JSON.parse(localData);
    } else {
      // Set default mock reviews on first load
      reviews = [...defaultMockReviews];
      localStorage.setItem('rgai-reviews', JSON.stringify(reviews));
    }
    renderPublicFeed();
  }

  function saveReviewsToLocalStorage() {
    localStorage.setItem('rgai-reviews', JSON.stringify(reviews));
    renderPublicFeed();
    if (isAdminAuthenticated) {
      refreshAdminDashboard();
    }
  }

  // --- DATABASE SYNC: FIREBASE MODE ---
  function syncReviewsWithFirebase() {
    // Listen to approved reviews in real time
    db.collection("reviews")
      .where("approved", "==", true)
      .orderBy("date", "desc")
      .onSnapshot((snapshot) => {
        const publicList = [];
        snapshot.forEach((doc) => {
          publicList.push({ id: doc.id, ...doc.data() });
        });
        
        // Render Public Feed
        renderReviewsList(publicList);
        
        // Calculate Public Stats
        updateStatsCount(publicList);
      }, (error) => {
        console.error("Error fetching Firestore feed: ", error);
        // Fallback to local
        loadReviewsFromLocalStorage();
      });
  }

  // --- RENDERING FEED ---
  function renderPublicFeed() {
    if (isFirebaseEnabled) return; // Managed by Firestore real-time listener

    // Filter approved reviews & sort desc
    const approvedList = reviews
      .filter(r => r.approved)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    renderReviewsList(approvedList);
    updateStatsCount(approvedList);
  }

  function renderReviewsList(list) {
    if (!publicReviewsContainer) return;

    if (list.length === 0) {
      publicReviewsContainer.innerHTML = `
        <div class="reviews-loading-state">
          <p>No reviews found. Be the first to write one!</p>
        </div>
      `;
      return;
    }

    publicReviewsContainer.innerHTML = list.map(rev => {
      const dateStr = new Date(rev.date).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
      const starText = '★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating);
      
      return `
        <div class="review-card card-spotlight">
          <div class="review-card-header">
            <div class="client-info">
              <h4>${escapeHTML(rev.name)}</h4>
              <span>${escapeHTML(rev.company)}</span>
            </div>
            <div class="star-rating-display">${starText}</div>
          </div>
          <p class="review-msg">"${escapeHTML(rev.message)}"</p>
          <div class="review-date">${dateStr}</div>
        </div>
      `;
    }).join('');

    // Re-bind cursor dots hover effects and spotlight calculations
    if (window.refreshSpotlights) window.refreshSpotlights();
    if (window.refreshMicrointeractions) window.refreshMicrointeractions();
  }

  function updateStatsCount(list) {
    if (feedCount) feedCount.textContent = list.length;

    if (feedAvgRating) {
      if (list.length === 0) {
        feedAvgRating.textContent = '0.0';
        return;
      }
      const sum = list.reduce((total, r) => total + r.rating, 0);
      const avg = (sum / list.length).toFixed(1);
      feedAvgRating.textContent = avg;
    }
  }

  // --- SUBMIT FORM ---
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('fbName').value.trim();
      const company = document.getElementById('fbCompany').value.trim();
      const rating = parseInt(ratingValInput.value) || 5;
      const message = document.getElementById('fbMessage').value.trim();

      const newReview = {
        name,
        company,
        rating,
        message,
        approved: false, // Must be approved by Admin moderation dashboard
        date: new Date().toISOString()
      };

      try {
        if (isFirebaseEnabled) {
          await db.collection("reviews").add(newReview);
        } else {
          // Local storage push
          const uniqueId = 'fb-' + Date.now();
          reviews.push({ id: uniqueId, ...newReview });
          saveReviewsToLocalStorage();
        }

        // Notify client
        if (window.showToast) {
          window.showToast('✅ Review submitted! Pending admin moderation.', 'success');
        } else {
          alert('✅ Review submitted! It will appear publicly after admin approval.');
        }

        feedbackForm.reset();
        
        // Reset stars to 5 selected
        const stars = starSelector.querySelectorAll('.rating-star');
        stars.forEach((s, idx) => s.classList.toggle('selected', idx < 5));
        ratingValInput.value = 5;

        // Route back to public feed tab
        switchTab(tabFeedBtn, contentFeed);

      } catch (error) {
        console.error('Error submitting feedback review: ', error);
        if (window.showToast) {
          window.showToast('❌ Submission failed. Please try again.', 'error');
        }
      }
    });
  }

  // --- ADMIN AUTHORIZATION ---
  if (adminAuthBtn) {
    adminAuthBtn.addEventListener('click', () => {
      const password = adminPasswordInput.value;
      if (password === 'admin123') {
        isAdminAuthenticated = true;
        adminAuthCard.classList.add('hidden');
        adminDashboardPanel.classList.remove('hidden');
        
        if (window.showToast) window.showToast('🔓 Access Granted. Administrative session started.', 'success');

        refreshAdminDashboard();
      } else {
        if (window.showToast) {
          window.showToast('❌ Incorrect Password! Try again.', 'error');
        } else {
          alert('❌ Access Denied: Incorrect Password!');
        }
        adminPasswordInput.value = '';
      }
    });
  }

  // --- ADMIN SYSTEM LOGIC ---
  async function refreshAdminDashboard() {
    if (!isAdminAuthenticated) return;

    if (isFirebaseEnabled) {
      // Pull all documents from Firestore
      try {
        const snapshot = await db.collection("reviews").orderBy("date", "desc").get();
        const allReviews = [];
        snapshot.forEach(doc => {
          allReviews.push({ id: doc.id, ...doc.data() });
        });
        renderAdminDashboard(allReviews);
      } catch (error) {
        console.error("Failed fetching all reviews for admin: ", error);
      }
    } else {
      // Local Storage pull
      renderAdminDashboard(reviews);
    }
  }

  function renderAdminDashboard(list) {
    // Stats calculation
    const total = list.length;
    const approved = list.filter(r => r.approved).length;
    const pending = total - approved;

    if (admTotal) admTotal.textContent = total;
    if (admApproved) admApproved.textContent = approved;
    if (admPending) admPending.textContent = pending;

    // Filter pending rows
    const pendingList = list.filter(r => !r.approved);

    if (!moderationTableBody) return;

    if (pendingList.length === 0) {
      moderationTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding: 2rem; color: var(--clr-text-3);">No pending approvals found.</td>
        </tr>
      `;
      return;
    }

    moderationTableBody.innerHTML = pendingList.map(rev => {
      const dateStr = new Date(rev.date).toLocaleDateString('en-IN', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
      return `
        <tr data-id="${rev.id}">
          <td>${dateStr}</td>
          <td style="font-weight:600; color: var(--clr-text);">${escapeHTML(rev.name)}</td>
          <td>${escapeHTML(rev.company)}</td>
          <td style="color: #FBBF24;">${'★'.repeat(rev.rating)}</td>
          <td><div class="admin-msg-cell" title="${escapeHTML(rev.message)}">${escapeHTML(rev.message)}</div></td>
          <td>
            <button class="admin-action-btn approve-btn" data-action="approve">Approve</button>
            <button class="admin-action-btn reject-btn" data-action="reject">Reject</button>
          </td>
        </tr>
      `;
    }).join('');

    // Bind action events inside rows
    moderationTableBody.querySelectorAll('.admin-action-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const row = btn.closest('tr');
        const id = row.getAttribute('data-id');
        const action = btn.getAttribute('data-action');

        if (action === 'approve') {
          await approveReview(id);
        } else {
          await rejectReview(id);
        }
      });
    });
  }

  // Action Operations
  async function approveReview(id) {
    try {
      if (isFirebaseEnabled) {
        await db.collection("reviews").doc(id).update({ approved: true });
      } else {
        const index = reviews.findIndex(r => r.id === id);
        if (index !== -1) {
          reviews[index].approved = true;
          saveReviewsToLocalStorage();
        }
      }
      if (window.showToast) window.showToast('✅ Review Approved & Published!', 'success');
      refreshAdminDashboard();
    } catch (error) {
      console.error("Failed to approve review: ", error);
    }
  }

  async function rejectReview(id) {
    try {
      if (isFirebaseEnabled) {
        await db.collection("reviews").doc(id).delete();
      } else {
        reviews = reviews.filter(r => r.id !== id);
        saveReviewsToLocalStorage();
      }
      if (window.showToast) window.showToast('🗑️ Review rejected & deleted.', 'error');
      refreshAdminDashboard();
    } catch (error) {
      console.error("Failed to reject review: ", error);
    }
  }

  // Escape HTML helper
  function escapeHTML(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
  }

  // --- START DATABASE INITIALIZATION ---
  initDatabase();

})();
