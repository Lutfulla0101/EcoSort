/**
 * EcoSort Game Engine — Interaktiv Karta Swiper & Reyting Tizimi
 * Mualliflik: Antigravity EcoSort Project
 * O'zbek tilida to'liq interaktiv tajriba
 */

(function () {
  'use strict';

  // ================= 1. O'YIN HOLLATLARI VA SOZLAMALARI =================
  const gameState = {
    // Rejimlar: 'standard' (3 ta jon) yoki 'class' (cheksiz dars rejimi)
    mode: 'standard',
    cards: [],
    currentIndex: 0,
    score: 0,
    streak: 0,
    maxStreak: 0,
    lives: 3,
    maxLives: 3,
    correctCount: 0,
    wrongCount: 0,
    soundEnabled: true,
    isInteracting: false,
    currentDragCard: null,
    // Swipe fizikasi
    dragStartX: 0,
    dragStartY: 0,
    currentX: 0,
    currentY: 0,
    isDragging: false
  };

  // ================= 2. WEB AUDIO API (TOVUSH EFFEKTLARI) =================
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // To'g'ri javob uchun yoqimli zangona (Chime: C5 -> E5 -> G5)
  function playCorrectSound() {
    if (!gameState.soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.28);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.3);
    });
  }

  // Xato javob uchun muloyim ogohlantiruvchi signal (Low buzz)
  function playWrongSound() {
    if (!gameState.soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(130, now + 0.25);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  // Karta surilgandagi yengil shamol tovushi (Swoosh)
  function playSwipeSound() {
    if (!gameState.soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Kombo va g'alaba tovushi
  function playFanfareSound() {
    if (!gameState.soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    const freqs = [440, 554.37, 659.25, 880];
    freqs.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      gain.gain.setValueAtTime(0.15, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.4);
    });
  }

  // Ball qo'shilgandagi yoqimli tanga tovushi (Coin sound)
  function playCoinSound() {
    if (!gameState.soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  // Daraja oshgandagi tantanali musiqa (Level Up arpeggio)
  function playLevelUpSound() {
    if (!gameState.soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);
      gain.gain.setValueAtTime(0.18, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.45);
    });
  }

  // ================= 3. CANVAS KONFETTI MOTORU =================
  const confettiCanvas = document.getElementById('confetti-canvas');
  const ctx = confettiCanvas.getContext('2d');
  let confettiParticles = [];
  let confettiAnimationId = null;

  function resizeConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeConfetti);
  resizeConfetti();

  function triggerConfetti(count = 70) {
    const colors = ['#10b981', '#34d399', '#38bdf8', '#fbbf24', '#f43f5e', '#a855f7'];
    for (let i = 0; i < count; i++) {
      confettiParticles.push({
        x: window.innerWidth * 0.5 + (Math.random() - 0.5) * 200,
        y: window.innerHeight * 0.4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 12,
        vy: Math.random() * -12 - 4,
        gravity: 0.35,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 10,
        alpha: 1
      });
    }

    if (!confettiAnimationId) {
      animateConfetti();
    }
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.vRot;
      p.alpha -= 0.008;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();

      if (p.alpha <= 0 || p.y > window.innerHeight) {
        confettiParticles.splice(i, 1);
      }
    }

    if (confettiParticles.length > 0) {
      confettiAnimationId = requestAnimationFrame(animateConfetti);
    } else {
      confettiAnimationId = null;
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  // ================= 4. MA'LUMOTLAR VA REYTING (LOCALSTORAGE) =================
  const STORAGE_KEY_LEVELS = 'ecosort_levels_top_v2';
  const STORAGE_KEY_CLASSES = 'ecosort_classes_top_v2';
  const STORAGE_KEY_PHOTOS = 'ecosort_photos_v2';
  const STORAGE_KEY_PROFILE = 'ecosort_user_profile_v2';

  // Foydalanuvchi Eko-Profili (1-5 Sinflar, Ballar, Darajalar)
  function getUserProfile() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Profile yuklash xatosi:', e);
    }
    return {
      name: "Ali Valiyev",
      gradeNum: 3,
      classLetter: "A",
      school: "21-maktab",
      gameScore: 0,
      videoScore: 0,
      photoScore: 0,
      totalScore: 0,
      watchedVideos: [],
      passedQuizzes: {}, // { [lessonId]: score }
      photos: []
    };
  }

  function saveUserProfile(profile) {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('Profile saqlash xatosi:', e);
    }
  }

  function getLevelsTopData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LEVELS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Levels top yuklash xatosi:', e);
    }
    return typeof INITIAL_LEVELS_TOP !== 'undefined' ? [...INITIAL_LEVELS_TOP] : [];
  }

  function saveLevelsTopData(list) {
    try {
      localStorage.setItem(STORAGE_KEY_LEVELS, JSON.stringify(list));
    } catch (e) {
      console.warn('Levels saqlash xatosi:', e);
    }
  }

  function getClassesTopData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CLASSES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Classes top yuklash xatosi:', e);
    }
    return typeof INITIAL_CLASSES_TOP !== 'undefined' ? [...INITIAL_CLASSES_TOP] : [];
  }

  function saveClassesTopData(list) {
    try {
      localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(list));
    } catch (e) {
      console.warn('Classes saqlash xatosi:', e);
    }
  }

  function getCommunityPhotosData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PHOTOS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Photos yuklash xatosi:', e);
    }
    return typeof INITIAL_COMMUNITY_PHOTOS !== 'undefined' ? [...INITIAL_COMMUNITY_PHOTOS] : [];
  }

  function saveCommunityPhotosData(list) {
    try {
      localStorage.setItem(STORAGE_KEY_PHOTOS, JSON.stringify(list));
    } catch (e) {
      console.warn('Photos saqlash xatosi:', e);
    }
  }

  // ================= 5. O'YIN BOSHQARUVI VA DOM REFERENSLARI =================
  const dom = {
    // Hud
    score: document.getElementById('current-score'),
    streak: document.getElementById('current-streak'),
    multiplier: document.getElementById('streak-multiplier'),
    heartsContainer: document.getElementById('hearts-container'),
    modeLifeLabel: document.getElementById('mode-life-label'),
    cardCounter: document.getElementById('card-counter'),
    progressFill: document.getElementById('game-progress-fill'),
    // Deck
    cardDeck: document.getElementById('card-deck'),
    zoneLeft: document.getElementById('zone-left-indicator'),
    zoneRight: document.getElementById('zone-right-indicator'),
    // Buttons
    btnLeft: document.getElementById('btn-swipe-left'),
    btnRight: document.getElementById('btn-swipe-right'),
    btnHint: document.getElementById('btn-show-hint'),
    soundToggle: document.getElementById('sound-toggle-btn'),
    soundIcon: document.getElementById('sound-icon'),
    helpBtn: document.getElementById('help-btn'),
    brandLogoBtn: document.getElementById('brand-logo-btn'),
    // Views
    tabs: document.querySelectorAll('.nav-tab'),
    sections: document.querySelectorAll('.view-section'),

    // Header Profile Widget
    userHeaderWidget: document.getElementById('user-profile-widget'),
    headerAvatarBadge: document.getElementById('header-avatar-badge'),
    userDisplayName: document.getElementById('user-display-name'),
    userDisplayGrade: document.getElementById('user-display-grade'),
    userDisplayLevel: document.getElementById('user-display-level'),
    userDisplayScore: document.getElementById('user-display-score'),
    btnEditProfileQuick: document.getElementById('btn-edit-profile-quick'),

    // Video Section
    videoCardsContainer: document.getElementById('video-cards-container'),
    videoGradeFilters: document.getElementById('video-grade-filters'),
    videoPlayerModal: document.getElementById('video-player-modal'),
    videoIframe: document.getElementById('video-iframe'),
    videoModalTitle: document.getElementById('video-modal-title'),
    videoModalGrade: document.getElementById('video-modal-grade'),
    videoModalDuration: document.getElementById('video-modal-duration'),
    videoModalSummary: document.getElementById('video-modal-summary'),
    videoModalGoals: document.getElementById('video-modal-goals'),
    btnCloseVideo: document.getElementById('btn-close-video'),
    btnWatchComplete: document.getElementById('btn-watch-complete'),
    btnStartQuizFromVideo: document.getElementById('btn-start-quiz-from-video'),

    // Quiz Modal
    quizModal: document.getElementById('quiz-modal'),
    quizStepIndicator: document.getElementById('quiz-step-indicator'),
    quizProgressFill: document.getElementById('quiz-progress-fill'),
    quizQuestionView: document.getElementById('quiz-question-view'),
    quizQuestionText: document.getElementById('quiz-question-text'),
    quizOptionsList: document.getElementById('quiz-options-list'),
    quizFeedbackBox: document.getElementById('quiz-feedback-box'),
    quizFeedbackBadge: document.getElementById('quiz-feedback-badge'),
    quizFeedbackText: document.getElementById('quiz-feedback-text'),
    quizResultsView: document.getElementById('quiz-results-view'),
    quizEarnedPoints: document.getElementById('quiz-earned-points'),
    btnQuizNext: document.getElementById('btn-quiz-next'),
    btnQuizFinish: document.getElementById('btn-quiz-finish'),
    btnCloseQuiz: document.getElementById('btn-close-quiz'),

    // Photo Section
    photoSubmitForm: document.getElementById('photo-submit-form'),
    photoStudentName: document.getElementById('photo-student-name'),
    photoStudentGrade: document.getElementById('photo-student-grade'),
    photoWasteSelectors: document.getElementById('photo-waste-selectors'),
    photoBinSelectors: document.getElementById('photo-bin-selectors'),
    photoDropzone: document.getElementById('photo-dropzone'),
    photoFileInput: document.getElementById('photo-file-input'),
    dropzonePrompt: document.getElementById('dropzone-prompt'),
    dropzonePreview: document.getElementById('dropzone-preview'),
    previewImg: document.getElementById('preview-img'),
    btnRemovePreview: document.getElementById('btn-remove-preview'),
    photoNote: document.getElementById('photo-note'),
    communityPhotosFeed: document.getElementById('community-photos-feed'),
    feedItemsCount: document.getElementById('feed-items-count'),

    // Scanner Modal
    photoVerifyModal: document.getElementById('photo-verify-modal'),
    scannerImgPreview: document.getElementById('scanner-img-preview'),
    scanDetectedWaste: document.getElementById('scan-detected-waste'),
    scanDetectedBin: document.getElementById('scan-detected-bin'),
    scannerResultBox: document.getElementById('scanner-result-box'),
    btnCloseScanner: document.getElementById('btn-close-scanner'),
    scanStep1: document.getElementById('scan-step-1'),
    scanStep2: document.getElementById('scan-step-2'),
    scanStep3: document.getElementById('scan-step-3'),

    // Levels Top Section
    myCardIcon: document.getElementById('my-card-icon'),
    myCardName: document.getElementById('my-card-name'),
    myCardGrade: document.getElementById('my-card-grade'),
    myCardSchool: document.getElementById('my-card-school'),
    myCardTierBadge: document.getElementById('my-card-tier-badge'),
    myCardTierTitle: document.getElementById('my-card-tier-title'),
    myCardDesc: document.getElementById('my-card-desc'),
    myCardScore: document.getElementById('my-card-score'),
    nextLevelTitle: document.getElementById('next-level-title'),
    nextLevelNeeded: document.getElementById('next-level-needed'),
    myLevelProgressFill: document.getElementById('my-level-progress-fill'),
    myLevelPercentText: document.getElementById('my-level-percent-text'),
    levelTiersContainer: document.getElementById('level-tiers-container'),
    lbGradeFilters: document.getElementById('leaderboard-grade-filters'),
    lbTabClasses: document.getElementById('lb-tab-classes'),
    lbTabStudents: document.getElementById('lb-tab-students'),
    levelsPodiumWrapper: document.getElementById('levels-podium-wrapper'),
    leaderboardThead: document.getElementById('leaderboard-thead'),
    leaderboardTbody: document.getElementById('leaderboard-tbody'),
    tableViewTitle: document.getElementById('table-view-title'),
    btnOpenGameFromLb: document.getElementById('btn-open-game-from-lb'),

    // Level Up Modal
    levelUpModal: document.getElementById('level-up-modal'),
    levelUpBadgeIcon: document.getElementById('level-up-badge-icon'),
    levelUpTitle: document.getElementById('level-up-title'),
    levelUpUzTitle: document.getElementById('level-up-uz-title'),
    levelUpDesc: document.getElementById('level-up-desc'),
    levelUpRewardTitle: document.getElementById('level-up-reward-title'),
    btnCloseLevelUp: document.getElementById('btn-close-level-up'),

    // Profile Edit Modal
    editProfileModal: document.getElementById('edit-profile-modal'),
    profileEditForm: document.getElementById('profile-edit-form'),
    editProfileName: document.getElementById('edit-profile-name'),
    editProfileGrade: document.getElementById('edit-profile-grade'),
    editProfileLetter: document.getElementById('edit-profile-letter'),
    editProfileSchool: document.getElementById('edit-profile-school'),
    btnCloseProfileModal: document.getElementById('btn-close-profile-modal'),

    // Classroom elements
    startClassBtn: document.getElementById('start-class-mode-btn'),
    viewLessonBtn: document.getElementById('view-lesson-plan-btn'),
    lessonPlanContainer: document.getElementById('lesson-plan-container'),

    // Explanation Modal
    explanationModal: document.getElementById('explanation-modal'),
    modalStatusBadge: document.getElementById('modal-status-badge'),
    modalStatusIcon: document.getElementById('modal-status-icon'),
    modalStatusTitle: document.getElementById('modal-status-title'),
    modalItemPreview: document.getElementById('modal-item-preview'),
    modalItemName: document.getElementById('modal-item-name'),
    modalItemExplanation: document.getElementById('modal-item-explanation'),
    modalItemTip: document.getElementById('modal-item-tip'),
    modalItemFact: document.getElementById('modal-item-fact'),
    modalCloseBtn: document.getElementById('btn-close-explanation'),
    modalContinueBtn: document.getElementById('btn-modal-continue'),

    // Game Over
    gameOverModal: document.getElementById('game-over-modal'),
    gameoverTrophy: document.getElementById('gameover-trophy'),
    gameoverTitle: document.getElementById('gameover-title'),
    gameoverSubtitle: document.getElementById('gameover-subtitle'),
    finalScoreVal: document.getElementById('final-score-val'),
    finalAccuracyVal: document.getElementById('final-accuracy-val'),
    finalStreakVal: document.getElementById('final-streak-val'),
    saveScoreForm: document.getElementById('save-score-form'),
    btnPlayAgain: document.getElementById('btn-play-again'),

    // Help modal
    helpModal: document.getElementById('help-modal'),
    closeHelpBtn: document.getElementById('btn-close-help'),
    closeHelpConfirmBtn: document.getElementById('btn-close-help-confirm'),

    // Ticker
    tickerText: document.getElementById('ticker-text')
  };

  // Massivni aralashtirish (Fisher-Yates)
  function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Yangi o'yinni boshlash
  function startNewGame(mode = 'standard') {
    gameState.mode = mode;
    gameState.cards = shuffleArray(WASTE_ITEMS);
    gameState.currentIndex = 0;
    gameState.score = 0;
    gameState.streak = 0;
    gameState.maxStreak = 0;
    gameState.lives = mode === 'class' ? 999 : gameState.maxLives;
    gameState.correctCount = 0;
    gameState.wrongCount = 0;
    gameState.isInteracting = false;

    updateHud();
    renderCardDeck();
    closeAllModals();

    if (mode === 'class') {
      dom.modeLifeLabel.textContent = "Dars Rejimi";
      dom.heartsContainer.innerHTML = '<span class="class-mode-badge" style="color:var(--primary-mint); font-weight:bold; font-size:0.9rem;">♾️ Cheksiz Jon</span>';
    } else {
      dom.modeLifeLabel.textContent = "Imkoniyatlar";
      updateHearts();
    }
  }

  // HUD ko'rsatkichlarini yangilash
  function updateHud() {
    dom.score.textContent = gameState.score;
    dom.streak.textContent = gameState.streak;

    // Kombo ko'paytirgich
    let multiplier = 1;
    if (gameState.streak >= 9) multiplier = 4;
    else if (gameState.streak >= 6) multiplier = 3;
    else if (gameState.streak >= 3) multiplier = 2;
    
    dom.multiplier.textContent = `x${multiplier}`;
    if (multiplier > 1) {
      dom.multiplier.style.display = 'inline-block';
    } else {
      dom.multiplier.style.display = 'none';
    }

    // Progress
    const total = gameState.cards.length;
    const current = Math.min(gameState.currentIndex + 1, total);
    dom.cardCounter.textContent = `${current} / ${total}`;
    const pct = ((gameState.currentIndex) / total) * 100;
    dom.progressFill.style.width = `${Math.min(100, Math.max(5, pct))}%`;

    if (gameState.mode !== 'class') {
      updateHearts();
    }
  }

  function updateHearts() {
    let heartsHtml = '';
    for (let i = 0; i < gameState.maxLives; i++) {
      if (i < gameState.lives) {
        heartsHtml += '<span class="heart-icon active">❤️</span>';
      } else {
        heartsHtml += '<span class="heart-icon">🖤</span>';
      }
    }
    dom.heartsContainer.innerHTML = heartsHtml;
  }

  // ================= 6. KARTALARNI RENDER QILISH VA SWIPE MOTORU =================
  function renderCardDeck() {
    dom.cardDeck.innerHTML = '';

    if (gameState.currentIndex >= gameState.cards.length) {
      endGame(true);
      return;
    }

    // Stackda 3 tagacha karta ko'rsatiladi (faol, keyingi, uchinchi)
    const indices = [
      gameState.currentIndex,
      gameState.currentIndex + 1,
      gameState.currentIndex + 2
    ];

    // Orqadan oldinga render qilamiz (pastki kartalar avval, active karta tepada bo'ladi)
    indices.reverse().forEach(idx => {
      if (idx < gameState.cards.length) {
        const item = gameState.cards[idx];
        const isCurrent = idx === gameState.currentIndex;
        const isNext = idx === gameState.currentIndex + 1;
        const isThird = idx === gameState.currentIndex + 2;

        const cardEl = createCardElement(item, idx, isCurrent, isNext, isThird);
        dom.cardDeck.appendChild(cardEl);

        if (isCurrent) {
          attachCardEvents(cardEl, item);
        }
      }
    });
  }

  function createCardElement(item, index, isCurrent, isNext, isThird) {
    const card = document.createElement('div');
    card.classList.add('swipe-card');
    if (isCurrent) card.classList.add('is-active');
    if (isNext) card.classList.add('is-next');
    if (isThird) card.classList.add('is-third');

    card.id = `card-item-${item.id}`;

    card.innerHTML = `
      <!-- Shtamplar (Stamps) -->
      <div class="card-stamp stamp-recycle">QAYTA ISHLASH ♻️</div>
      <div class="card-stamp stamp-general">UMUMIY AXLAT 🗑️</div>

      <!-- Karta Tepasi -->
      <div class="card-header-bar">
        <span class="card-category-badge" style="border-color: ${item.color}40; color: ${item.color};">
          ● ${item.typeTag}
        </span>
        <span class="card-id-badge">#${index + 1}</span>
      </div>

      <!-- Markaziy SVG Illyustratsiya -->
      <div class="card-visual-podium">
        ${item.iconSvg}
      </div>

      <!-- Karta Nomi va Maslahat -->
      <div class="card-content">
        <h2 class="card-item-title">${item.name}</h2>
        <p class="card-item-tip">${item.tip}</p>
      </div>

      <!-- Pastki Surish Ko'rsatkichi -->
      <div class="card-swipe-cue">
        <span class="cue-arrow">← Umumiy</span>
        <span>Yoki tugmalarni bosing</span>
        <span class="cue-arrow">Qayta ishlash →</span>
      </div>
    `;

    return card;
  }

  // ================= 7. TOUCH VA MOUSE DRAG FIZIKASI =================
  function attachCardEvents(card, item) {
    const stampRecycle = card.querySelector('.stamp-recycle');
    const stampGeneral = card.querySelector('.stamp-general');

    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;

    function onPointerDown(e) {
      if (gameState.isInteracting) return;
      isDragging = true;
      card.style.transition = 'none';

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      startX = clientX;
      startY = clientY;
      currentX = clientX;
      currentY = clientY;

      initAudio();
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      currentX = clientX;
      currentY = clientY;

      const deltaX = currentX - startX;
      const deltaY = currentY - startY;

      // 3D aylanish va siljish
      const rotateDeg = deltaX * 0.08;
      card.style.transform = `translate(${deltaX}px, ${deltaY * 0.4}px) rotate(${rotateDeg}deg)`;

      // Shtamp va zonalar indikatorining shaffofligi
      const threshold = 120;
      if (deltaX > 0) {
        // O'ngga surish (Qayta ishlash)
        const opacity = Math.min(1, Math.max(0, deltaX / threshold));
        stampRecycle.style.opacity = opacity;
        stampGeneral.style.opacity = 0;
        dom.zoneRight.classList.add('active-zone');
        dom.zoneLeft.classList.remove('active-zone');
      } else if (deltaX < 0) {
        // Chapga surish (Umumiy axlat)
        const opacity = Math.min(1, Math.max(0, Math.abs(deltaX) / threshold));
        stampGeneral.style.opacity = opacity;
        stampRecycle.style.opacity = 0;
        dom.zoneLeft.classList.add('active-zone');
        dom.zoneRight.classList.remove('active-zone');
      } else {
        stampRecycle.style.opacity = 0;
        stampGeneral.style.opacity = 0;
        dom.zoneLeft.classList.remove('active-zone');
        dom.zoneRight.classList.remove('active-zone');
      }
    }

    function onPointerUp() {
      if (!isDragging) return;
      isDragging = false;

      const deltaX = currentX - startX;
      const threshold = 90; // Surish kuchi yetarliligi

      dom.zoneLeft.classList.remove('active-zone');
      dom.zoneRight.classList.remove('active-zone');

      if (deltaX > threshold) {
        // O'ngga tashlandi -> 'recycle'
        executeSwipe(card, item, 'recycle', 'right');
      } else if (deltaX < -threshold) {
        // Chapga tashlandi -> 'general'
        executeSwipe(card, item, 'general', 'left');
      } else {
        // Qaytib kelish (Snap back with spring)
        card.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        card.style.transform = 'translate(0px, 0px) rotate(0deg)';
        stampRecycle.style.opacity = 0;
        stampGeneral.style.opacity = 0;
      }
    }

    // Touch hodisalari
    card.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
    window.addEventListener('touchcancel', onPointerUp);

    // Sichqoncha hodisalari
    card.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
  }

  // ================= 8. SWIPE NATIJASINI ANIQLASH VA AMALGA OSHIRISH =================
  function executeSwipe(card, item, chosenAction, direction) {
    if (gameState.isInteracting) return;
    gameState.isInteracting = true;

    playSwipeSound();

    // Animatsiya bilan uchib ketish
    if (direction === 'right') {
      card.classList.add('fly-right');
    } else {
      card.classList.add('fly-left');
    }

    // Javob to'g'riligini tekshirish
    const isCorrect = item.binType === chosenAction;

    setTimeout(() => {
      handleAnswerResult(item, isCorrect, chosenAction);
    }, 280);
  }

  function handleAnswerResult(item, isCorrect, chosenAction) {
    if (isCorrect) {
      gameState.correctCount++;
      gameState.streak++;
      if (gameState.streak > gameState.maxStreak) {
        gameState.maxStreak = gameState.streak;
      }

      // Ball hisoblash
      let mult = 1;
      if (gameState.streak >= 9) mult = 4;
      else if (gameState.streak >= 6) mult = 3;
      else if (gameState.streak >= 3) mult = 2;

      gameState.score += (10 * mult);
      playCorrectSound();

      // Yuqori kombolarda konfetti
      if (gameState.streak % 5 === 0) {
        triggerConfetti(50);
        playFanfareSound();
      }

      // Dars rejimida har doim batafsil tushuntirish ko'rsatiladi
      if (gameState.mode === 'class') {
        showExplanationModal(item, true, chosenAction);
      } else {
        advanceNextCard();
      }

    } else {
      gameState.wrongCount++;
      gameState.streak = 0;
      playWrongSound();

      if (gameState.mode !== 'class') {
        gameState.lives--;
        updateHearts();

        if (gameState.lives <= 0) {
          showExplanationModal(item, false, chosenAction, true);
          return;
        }
      }

      // Xato bo'lganda ta'limiy popup darhol chiqadi (o'quvchi xatosini tushunishi uchun)
      showExplanationModal(item, false, chosenAction, false);
    }

    updateHud();
  }

  function advanceNextCard() {
    gameState.currentIndex++;
    gameState.isInteracting = false;
    updateHud();
    renderCardDeck();
  }

  // ================= 9. TA'LIMIY TUSHUNTIRISH MODALI =================
  function showExplanationModal(item, isCorrect, chosenAction, isGameOverAfter = false) {
    dom.modalStatusBadge.className = 'modal-badge-status ' + (isCorrect ? 'correct' : 'wrong');
    dom.modalStatusIcon.textContent = isCorrect ? '🎉 To\'g\'ri Saralandi!' : '⚠️ Adashdingiz!';
    dom.modalStatusTitle.textContent = isCorrect ? 'Ajoyib eko-bilim!' : 'To\'g\'ri qoidani bilib oling:';

    dom.modalItemPreview.innerHTML = item.iconSvg;
    dom.modalItemName.textContent = item.name;
    dom.modalItemExplanation.textContent = item.explanation;
    dom.modalItemTip.textContent = item.tip;
    dom.modalItemFact.textContent = item.funFact;

    dom.explanationModal.classList.add('active');

    function onContinue() {
      dom.explanationModal.classList.remove('active');
      dom.modalContinueBtn.removeEventListener('click', onContinue);
      dom.modalCloseBtn.removeEventListener('click', onContinue);

      if (isGameOverAfter) {
        endGame(false);
      } else {
        advanceNextCard();
      }
    }

    dom.modalContinueBtn.addEventListener('click', onContinue);
    dom.modalCloseBtn.addEventListener('click', onContinue);
  }

  // Maslahat tugmasi bosilganda
  function showHintModal() {
    if (gameState.currentIndex >= gameState.cards.length) return;
    const currentItem = gameState.cards[gameState.currentIndex];

    dom.modalStatusBadge.className = 'modal-badge-status neutral';
    dom.modalStatusIcon.textContent = '💡';
    dom.modalStatusTitle.textContent = 'Eko-Maslahat va Yordam';

    dom.modalItemPreview.innerHTML = currentItem.iconSvg;
    dom.modalItemName.textContent = currentItem.name;
    dom.modalItemExplanation.textContent = `Ushbu chiqindi: ${currentItem.binType === 'recycle' ? 'Qayta ishlanadigan (o\'ngga ♻️)' : 'Umumiy axlatga (chapga 🗑️)'} tashlanishi kerak.`;
    dom.modalItemTip.textContent = currentItem.tip;
    dom.modalItemFact.textContent = currentItem.funFact;

    dom.explanationModal.classList.add('active');

    function onClose() {
      dom.explanationModal.classList.remove('active');
      dom.modalContinueBtn.removeEventListener('click', onClose);
      dom.modalCloseBtn.removeEventListener('click', onClose);
    }

    dom.modalContinueBtn.addEventListener('click', onClose);
    dom.modalCloseBtn.addEventListener('click', onClose);
  }

  // ================= 10. O'YIN TUGASHI (GAME OVER & SAVING SCORE) =================
  function endGame(isWon) {
    const totalAnswered = gameState.correctCount + gameState.wrongCount;
    const accuracy = totalAnswered > 0 ? Math.round((gameState.correctCount / totalAnswered) * 100) : 0;

    dom.finalScoreVal.textContent = gameState.score;
    dom.finalAccuracyVal.textContent = `${accuracy}% (${gameState.correctCount}/${totalAnswered})`;
    dom.finalStreakVal.textContent = `🔥 ${gameState.maxStreak}`;

    if (isWon) {
      dom.gameoverTrophy.textContent = '🏆';
      dom.gameoverTitle.textContent = 'G\'alaba! Barcha Chiqindilar Saralandi!';
      dom.gameoverSubtitle.textContent = 'Siz maktabingizning haqiqiy Eko-Chempionisiz!';
      triggerConfetti(100);
      playFanfareSound();
    } else {
      dom.gameoverTrophy.textContent = '🌱';
      dom.gameoverTitle.textContent = 'Imkoniyatlar Tugadi!';
      dom.gameoverSubtitle.textContent = 'Xafa bo\'lmang, yana urinib ko\'ring va bilimingizni oshiring!';
    }

    dom.gameOverModal.classList.add('active');
  }

  // ================= 10. FOYDALANUVCHI PROFILI VA LEVEL TIZIMI =================
  let userProfile = getUserProfile();

  function updateUserHeaderUI() {
    if (!userProfile) userProfile = getUserProfile();
    const currentLevel = getLevelByScore(userProfile.totalScore);

    if (dom.userDisplayName) dom.userDisplayName.textContent = userProfile.name || "Yosh Eko-Do'st";
    if (dom.userDisplayGrade) dom.userDisplayGrade.textContent = `${userProfile.gradeNum}-${userProfile.classLetter || 'A'} sinf`;
    if (dom.userDisplayLevel) dom.userDisplayLevel.textContent = `${currentLevel.badgeIcon} ${currentLevel.name}`;
    if (dom.userDisplayScore) dom.userDisplayScore.textContent = userProfile.totalScore || 0;
    if (dom.headerAvatarBadge) dom.headerAvatarBadge.textContent = currentLevel.badgeIcon;
  }

  // Profilga ball qo'shish va Level Up tekshirish
  function addScoreToProfile(points, source) {
    if (!userProfile) userProfile = getUserProfile();
    const oldScore = userProfile.totalScore || 0;
    const oldLevel = getLevelByScore(oldScore);

    if (source === 'game') userProfile.gameScore = (userProfile.gameScore || 0) + points;
    else if (source === 'video') userProfile.videoScore = (userProfile.videoScore || 0) + points;
    else if (source === 'quiz') userProfile.videoScore = (userProfile.videoScore || 0) + points;
    else if (source === 'photo') userProfile.photoScore = (userProfile.photoScore || 0) + points;

    userProfile.totalScore = (userProfile.gameScore || 0) + (userProfile.videoScore || 0) + (userProfile.photoScore || 0);
    saveUserProfile(userProfile);

    playCoinSound();
    updateUserHeaderUI();

    const newLevel = getLevelByScore(userProfile.totalScore);
    if (newLevel.tier > oldLevel.tier) {
      setTimeout(() => {
        showLevelUpCelebration(newLevel);
      }, 500);
    }
  }

  function showLevelUpCelebration(level) {
    playLevelUpSound();
    triggerConfetti(120);

    if (dom.levelUpBadgeIcon) dom.levelUpBadgeIcon.textContent = level.badgeIcon;
    if (dom.levelUpTitle) dom.levelUpTitle.textContent = level.name;
    if (dom.levelUpUzTitle) dom.levelUpUzTitle.textContent = level.uzTitle;
    if (dom.levelUpDesc) dom.levelUpDesc.textContent = level.desc;
    if (dom.levelUpRewardTitle) dom.levelUpRewardTitle.textContent = level.rewardNote;

    if (dom.levelUpModal) dom.levelUpModal.classList.add('active');
  }

  if (dom.btnCloseLevelUp) {
    dom.btnCloseLevelUp.addEventListener('click', () => {
      dom.levelUpModal.classList.remove('active');
      switchView('levels-view');
    });
  }

  // O'yin tugagach ballni reytingga saqlash
  if (dom.saveScoreForm) {
    dom.saveScoreForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const studentName = document.getElementById('input-student-name').value.trim() || userProfile.name || "O'quvchi";
      const gradeNum = parseInt(document.getElementById('input-class-grade').value, 10) || userProfile.gradeNum || 3;
      const classLetter = (document.getElementById('input-class-letter').value.trim() || "A").toUpperCase();
      const schoolName = document.getElementById('input-school-name').value.trim() || userProfile.school || "Maktab";

      // Profilni yangilash
      userProfile.name = studentName;
      userProfile.gradeNum = gradeNum;
      userProfile.classLetter = classLetter;
      userProfile.school = schoolName;
      addScoreToProfile(gameState.score, 'game');

      const totalAnswered = gameState.correctCount + gameState.wrongCount;
      const accuracy = totalAnswered > 0 ? `${Math.round((gameState.correctCount / totalAnswered) * 100)}%` : '100%';

      const userLevel = getLevelByScore(userProfile.totalScore);

      const newEntry = {
        rank: 0,
        studentName: studentName,
        gradeNum: gradeNum,
        className: `${gradeNum}-${classLetter}`,
        school: schoolName,
        score: userProfile.totalScore,
        levelId: userLevel.id,
        accuracy: accuracy,
        actionsCount: (userProfile.watchedVideos ? userProfile.watchedVideos.length : 0) + (userProfile.photos ? userProfile.photos.length : 0) + 1,
        badgeText: `${userLevel.badgeIcon} ${userLevel.name}`
      };

      const list = getLevelsTopData();
      // Mavjud foydalanuvchini yangilash yoki yangi qo'shish
      const existingIdx = list.findIndex(item => item.studentName.toLowerCase() === studentName.toLowerCase());
      if (existingIdx >= 0) {
        list[existingIdx] = newEntry;
      } else {
        list.push(newEntry);
      }

      list.sort((a, b) => b.score - a.score);
      list.forEach((item, idx) => { item.rank = idx + 1; });
      saveLevelsTopData(list);

      dom.gameOverModal.classList.remove('active');
      triggerConfetti(80);

      // Levels Top sahifasiga o'tish
      switchView('levels-view');
      renderLevelsView();
    });
  }

  if (dom.btnPlayAgain) {
    dom.btnPlayAgain.addEventListener('click', () => {
      dom.gameOverModal.classList.remove('active');
      startNewGame(gameState.mode);
    });
  }

  // ================= 11. VIDEO DARSLIKLAR VA TESTLAR =================
  let currentVideoGrade = 'all';
  let activeVideoLesson = null;

  function renderVideoLessons() {
    if (!dom.videoCardsContainer) return;

    let lessons = typeof VIDEO_LESSONS !== 'undefined' ? [...VIDEO_LESSONS] : [];
    if (currentVideoGrade !== 'all') {
      const g = parseInt(currentVideoGrade, 10);
      lessons = lessons.filter(l => l.grades.includes(g));
    }

    let html = '';
    lessons.forEach(lesson => {
      const isWatched = userProfile.watchedVideos && userProfile.watchedVideos.includes(lesson.id);
      const quizPassedScore = userProfile.passedQuizzes ? userProfile.passedQuizzes[lesson.id] : null;

      let statusBadge = '';
      if (quizPassedScore) {
        statusBadge = `<span class="video-status-done">✅ Test topshirildi (+${50 + quizPassedScore} ball)</span>`;
      } else if (isWatched) {
        statusBadge = `<span class="video-status-done" style="background:#0284c7;">👁️ Ko'rildi (+50 ball)</span>`;
      }

      html += `
        <div class="video-lesson-card" id="video-card-${lesson.id}">
          ${statusBadge}
          <div class="video-card-thumb-wrap" data-id="${lesson.id}">
            <img class="video-card-poster-bg" src="https://img.youtube.com/vi/${lesson.youtubeId}/hqdefault.jpg" alt="${lesson.title}" onerror="this.src='assets/kid_plastic.jpg'">
            <div class="video-card-thumb-overlay">
              <div class="video-card-play-btn">▶</div>
            </div>
            <div class="video-card-badges">
              <span class="video-badge-grade">${lesson.gradeText}</span>
              <span class="video-badge-duration">⏱️ ${lesson.duration}</span>
            </div>
          </div>

          <div class="video-card-body">
            <h3 class="video-card-title">${lesson.title}</h3>
            <p class="video-card-summary">${lesson.summary}</p>

            <div class="video-points-row">
              <span class="point-pill video-pt">🎬 +${lesson.watchPoints} ball ko'rishga</span>
              <span class="point-pill quiz-pt">📝 +${lesson.quizPoints} ball testga</span>
            </div>

            <div class="video-card-actions">
              <button class="btn-card-action btn-card-watch" data-id="${lesson.id}">
                <span>▶️ Videoni Ko'rish</span>
              </button>
              <button class="btn-card-action btn-card-quiz" data-id="${lesson.id}">
                <span>📝 Testni Boshlash</span>
              </button>
            </div>
          </div>
        </div>
      `;
    });

    if (lessons.length === 0) {
      html = `<div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-dim);">Ushbu sinf uchun videolar tayyorlanmoqda. Boshqa sinflarni ko'ring!</div>`;
    }

    dom.videoCardsContainer.innerHTML = html;

    // Hodisalarni biriktirish
    dom.videoCardsContainer.querySelectorAll('.video-card-thumb-wrap, .btn-card-watch').forEach(el => {
      el.addEventListener('click', (e) => {
        const id = parseInt(el.dataset.id, 10);
        openVideoModal(id);
      });
    });

    dom.videoCardsContainer.querySelectorAll('.btn-card-quiz').forEach(el => {
      el.addEventListener('click', (e) => {
        const id = parseInt(el.dataset.id, 10);
        startQuiz(id);
      });
    });
  }

  // Video darslik modali
  function openVideoModal(lessonId) {
    const lesson = VIDEO_LESSONS.find(l => l.id === lessonId);
    if (!lesson) return;
    activeVideoLesson = lesson;

    dom.videoModalTitle.textContent = lesson.title;
    dom.videoModalGrade.textContent = lesson.gradeText;
    dom.videoModalDuration.textContent = `⏱️ ${lesson.duration}`;
    dom.videoModalSummary.textContent = lesson.summary;

    if (dom.videoModalGoals) {
      dom.videoModalGoals.innerHTML = lesson.learningGoals.map(g => `<li>${g}</li>`).join('');
    }

    dom.videoIframe.src = lesson.embedUrl;

    const isWatched = userProfile.watchedVideos && userProfile.watchedVideos.includes(lesson.id);
    if (isWatched) {
      dom.btnWatchComplete.innerHTML = '<span>✅ Ko\'rilgan (+50 Ball olindi)</span>';
      dom.btnWatchComplete.style.opacity = '0.7';
    } else {
      dom.btnWatchComplete.innerHTML = '<span>✅ Videoni Ko\'rdim (+50 Ball Olish)</span>';
      dom.btnWatchComplete.style.opacity = '1';
    }

    dom.videoPlayerModal.classList.add('active');
  }

  function closeVideoModal() {
    dom.videoIframe.src = '';
    dom.videoPlayerModal.classList.remove('active');
  }

  if (dom.btnCloseVideo) dom.btnCloseVideo.addEventListener('click', closeVideoModal);

  if (dom.btnWatchComplete) {
    dom.btnWatchComplete.addEventListener('click', () => {
      if (!activeVideoLesson) return;
      if (!userProfile.watchedVideos) userProfile.watchedVideos = [];

      if (!userProfile.watchedVideos.includes(activeVideoLesson.id)) {
        userProfile.watchedVideos.push(activeVideoLesson.id);
        addScoreToProfile(activeVideoLesson.watchPoints, 'video');
        triggerConfetti(50);
        dom.btnWatchComplete.innerHTML = '<span>✅ Ko\'rildi (+50 Ball Olindi!)</span>';
        renderVideoLessons();
      }
    });
  }

  if (dom.btnStartQuizFromVideo) {
    dom.btnStartQuizFromVideo.addEventListener('click', () => {
      if (!activeVideoLesson) return;
      const lessonId = activeVideoLesson.id;
      closeVideoModal();
      startQuiz(lessonId);
    });
  }

  // ================= 12. INTERAKTIV TEST (QUIZ) LOGIKASI =================
  let currentQuizLesson = null;
  let currentQuestionIndex = 0;
  let quizCorrectCount = 0;
  let isOptionSelected = false;

  function startQuiz(lessonId) {
    const lesson = VIDEO_LESSONS.find(l => l.id === lessonId);
    if (!lesson || !lesson.quiz || lesson.quiz.length === 0) return;

    currentQuizLesson = lesson;
    currentQuestionIndex = 0;
    quizCorrectCount = 0;
    isOptionSelected = false;

    dom.quizQuestionView.style.display = 'block';
    dom.quizResultsView.style.display = 'none';
    dom.btnQuizFinish.style.display = 'none';
    dom.btnQuizNext.style.display = 'none';

    renderCurrentQuizQuestion();
    dom.quizModal.classList.add('active');
  }

  function renderCurrentQuizQuestion() {
    if (!currentQuizLesson) return;
    const questions = currentQuizLesson.quiz;
    const q = questions[currentQuestionIndex];
    isOptionSelected = false;

    dom.quizStepIndicator.textContent = `Savol ${currentQuestionIndex + 1} / ${questions.length}`;
    const pct = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
    dom.quizProgressFill.style.width = `${pct}%`;

    dom.quizQuestionText.textContent = q.question;
    dom.quizFeedbackBox.style.display = 'none';
    dom.btnQuizNext.style.display = 'none';

    let optionsHtml = '';
    const optionLetters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, idx) => {
      optionsHtml += `
        <button class="quiz-option-btn" data-index="${idx}">
          <span style="display:inline-flex; width:26px; height:26px; border-radius:50%; background:rgba(255,255,255,0.1); align-items:center; justify-content:center; font-weight:800; font-size:0.8rem;">${optionLetters[idx]}</span>
          <span>${opt}</span>
        </button>
      `;
    });
    dom.quizOptionsList.innerHTML = optionsHtml;

    dom.quizOptionsList.querySelectorAll('.quiz-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (isOptionSelected) return;
        isOptionSelected = true;
        const chosenIdx = parseInt(btn.dataset.index, 10);
        handleQuizChoice(chosenIdx, q);
      });
    });
  }

  function handleQuizChoice(chosenIdx, questionObj) {
    const isCorrect = chosenIdx === questionObj.correct;
    const allButtons = dom.quizOptionsList.querySelectorAll('.quiz-option-btn');

    allButtons.forEach((btn, idx) => {
      if (idx === questionObj.correct) {
        btn.classList.add('correct-choice');
      } else if (idx === chosenIdx && !isCorrect) {
        btn.classList.add('wrong-choice');
      }
      btn.style.pointerEvents = 'none';
    });

    dom.quizFeedbackBox.style.display = 'block';
    if (isCorrect) {
      quizCorrectCount++;
      playCorrectSound();
      dom.quizFeedbackBadge.className = 'feedback-badge correct';
      dom.quizFeedbackBadge.textContent = '🎉 To\'ppa-to\'g\'ri!';
    } else {
      playWrongSound();
      dom.quizFeedbackBadge.className = 'feedback-badge wrong';
      dom.quizFeedbackBadge.textContent = '⚠️ To\'g\'ri javobni eslab qoling:';
    }
    dom.quizFeedbackText.textContent = questionObj.explanation;

    const questions = currentQuizLesson.quiz;
    if (currentQuestionIndex < questions.length - 1) {
      dom.btnQuizNext.style.display = 'inline-block';
      dom.btnQuizNext.textContent = 'Keyingi Savol ➔';
    } else {
      dom.btnQuizNext.style.display = 'inline-block';
      dom.btnQuizNext.textContent = 'Natijani Ko\'rish 🏆';
    }
  }

  if (dom.btnQuizNext) {
    dom.btnQuizNext.addEventListener('click', () => {
      const questions = currentQuizLesson.quiz;
      if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        renderCurrentQuizQuestion();
      } else {
        finishQuiz();
      }
    });
  }

  function finishQuiz() {
    dom.quizQuestionView.style.display = 'none';
    dom.quizResultsView.style.display = 'block';
    dom.btnQuizNext.style.display = 'none';
    dom.btnQuizFinish.style.display = 'inline-block';

    const totalQ = currentQuizLesson.quiz.length;
    // Har bir to'g'ri javob uchun 25 ball, 3 ta bo'lsa jami 75 ball!
    const earnedPoints = Math.round((quizCorrectCount / totalQ) * currentQuizLesson.quizPoints);

    if (dom.quizEarnedPoints) dom.quizEarnedPoints.textContent = `+${earnedPoints}`;

    if (!userProfile.passedQuizzes) userProfile.passedQuizzes = {};
    const prevScore = userProfile.passedQuizzes[currentQuizLesson.id] || 0;
    if (earnedPoints > prevScore) {
      const diff = earnedPoints - prevScore;
      userProfile.passedQuizzes[currentQuizLesson.id] = earnedPoints;
      addScoreToProfile(diff, 'quiz');
    }

    if (quizCorrectCount === totalQ) {
      playFanfareSound();
      triggerConfetti(100);
      document.getElementById('quiz-result-title').textContent = 'Ajoyib! 100% To\'g\'ri!';
      document.getElementById('quiz-result-sub').textContent = 'Siz videodagi barcha qoidalarni a\'lo darajada o\'zlashtirdingiz!';
    } else {
      playCorrectSound();
      document.getElementById('quiz-result-title').textContent = `${quizCorrectCount} / ${totalQ} To'g'ri Natija!`;
      document.getElementById('quiz-result-sub').textContent = 'Bilimingizni oshirganingiz uchun ballar taqdim etildi!';
    }

    renderVideoLessons();
  }

  if (dom.btnQuizFinish) {
    dom.btnQuizFinish.addEventListener('click', () => {
      dom.quizModal.classList.remove('active');
      switchView('levels-view');
      renderLevelsView();
    });
  }

  if (dom.btnCloseQuiz) {
    dom.btnCloseQuiz.addEventListener('click', () => {
      dom.quizModal.classList.remove('active');
    });
  }

  // ================= 13. EKO-FOTO (SARALASH ISBOTI & AI-SKANNER) =================
  let selectedWasteType = "Plastik PET idish";
  let selectedBinType = "recycle";
  let selectedBinLabel = "♻️ Yashil Qayta Ishlash Qutisi";
  let currentUploadedPhotoData = "assets/kid_plastic.jpg"; // Standart namuna

  function setupPhotoUploadAndScanner() {
    if (!dom.photoSubmitForm) return;

    // Chiqindi turi tugmalari
    if (dom.photoWasteSelectors) {
      dom.photoWasteSelectors.querySelectorAll('.waste-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          dom.photoWasteSelectors.querySelectorAll('.waste-type-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          selectedWasteType = btn.dataset.type;
        });
      });
    }

    // Quti turi tugmalari
    if (dom.photoBinSelectors) {
      dom.photoBinSelectors.querySelectorAll('.bin-select-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          dom.photoBinSelectors.querySelectorAll('.bin-select-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          selectedBinType = btn.dataset.bin;
          selectedBinLabel = btn.dataset.label;
        });
      });
    }

    // Fayl yuklash
    if (dom.photoFileInput) {
      dom.photoFileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (evt) {
            setPhotoPreview(evt.target.result);
          };
          reader.readAsDataURL(file);
        }
      });
    }

    if (dom.btnRemovePreview) {
      dom.btnRemovePreview.addEventListener('click', (e) => {
        e.stopPropagation();
        dom.dropzonePreview.style.display = 'none';
        dom.dropzonePrompt.style.display = 'flex';
        currentUploadedPhotoData = null;
        if (dom.photoFileInput) dom.photoFileInput.value = '';
      });
    }

    // Namunaviy fotolar tanlash
    document.querySelectorAll('.sample-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const img = btn.dataset.img;
        const waste = btn.dataset.waste;
        const bin = btn.dataset.bin;

        setPhotoPreview(img);

        if (dom.photoWasteSelectors) {
          dom.photoWasteSelectors.querySelectorAll('.waste-type-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.type === waste);
          });
          selectedWasteType = waste;
        }

        if (dom.photoBinSelectors) {
          dom.photoBinSelectors.querySelectorAll('.bin-select-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.bin === bin);
            if (b.dataset.bin === bin) selectedBinLabel = b.dataset.label;
          });
          selectedBinType = bin;
        }
      });
    });

    // Form submit
    dom.photoSubmitForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!currentUploadedPhotoData) {
        alert("Iltimos, avval saralayotgan rasmingizni yuklang yoki quyidagi namunaviy fotosuratlardan birini tanlang!");
        return;
      }

      const name = dom.photoStudentName.value.trim() || userProfile.name || "O'quvchi";
      const grade = parseInt(dom.photoStudentGrade.value, 10) || 3;
      const note = dom.photoNote.value.trim() || "Chiqindini to'g'ri qutiga saralab soldim!";

      runAIScannerVerification({
        studentName: name,
        gradeNum: grade,
        wasteType: selectedWasteType,
        binType: selectedBinType,
        binLabel: selectedBinLabel,
        note: note,
        imgUrl: currentUploadedPhotoData
      });
    });
  }

  function setPhotoPreview(imgSrc) {
    currentUploadedPhotoData = imgSrc;
    if (dom.previewImg) dom.previewImg.src = imgSrc;
    if (dom.dropzonePreview) dom.dropzonePreview.style.display = 'block';
    if (dom.dropzonePrompt) dom.dropzonePrompt.style.display = 'none';
  }

  // AI-Skanner animatsiyasi
  function runAIScannerVerification(photoObj) {
    if (!dom.photoVerifyModal) return;

    if (dom.scannerImgPreview) dom.scannerImgPreview.src = photoObj.imgUrl;
    if (dom.scanDetectedWaste) dom.scanDetectedWaste.textContent = photoObj.wasteType;
    if (dom.scanDetectedBin) dom.scanDetectedBin.textContent = photoObj.binLabel;

    // Reset steps
    dom.scanStep1.classList.remove('active');
    dom.scanStep2.classList.remove('active');
    dom.scanStep3.classList.remove('active');
    dom.scannerResultBox.style.display = 'none';
    dom.btnCloseScanner.style.display = 'none';

    dom.photoVerifyModal.classList.add('active');

    // Bosqichma-bosqich skanerlash
    setTimeout(() => {
      dom.scanStep1.classList.add('active');
      playCorrectSound();
    }, 600);

    setTimeout(() => {
      dom.scanStep2.classList.add('active');
      playCorrectSound();
    }, 1300);

    setTimeout(() => {
      dom.scanStep3.classList.add('active');
      playCorrectSound();
    }, 2000);

    setTimeout(() => {
      dom.scannerResultBox.style.display = 'block';
      dom.btnCloseScanner.style.display = 'inline-block';
      playFanfareSound();
      triggerConfetti(80);

      // +75 ball berish
      addScoreToProfile(75, 'photo');

      // Yangi fotosuratni lentaga qo'shish
      const newPhotoEntry = {
        id: 'photo-' + Date.now(),
        studentName: photoObj.studentName,
        gradeNum: photoObj.gradeNum,
        className: `${photoObj.gradeNum}-sinf`,
        school: userProfile.school || "Maktab",
        wasteType: photoObj.wasteType,
        binType: photoObj.binType,
        binLabel: photoObj.binLabel,
        imgUrl: photoObj.imgUrl,
        note: photoObj.note,
        awardedPoints: 75,
        likes: 1,
        date: "Hozirgina",
        verified: true
      };

      const photos = getCommunityPhotosData();
      photos.unshift(newPhotoEntry);
      saveCommunityPhotosData(photos);

      renderPhotoFeed();
    }, 2600);
  }

  if (dom.btnCloseScanner) {
    dom.btnCloseScanner.addEventListener('click', () => {
      dom.photoVerifyModal.classList.remove('active');
      switchView('photo-view');
    });
  }

  // Jamoat Eko-Lentasini chizish
  function renderPhotoFeed() {
    if (!dom.communityPhotosFeed) return;
    const photos = getCommunityPhotosData();

    if (dom.feedItemsCount) {
      dom.feedItemsCount.textContent = `${photos.length} ta tasdiqlangan`;
    }

    let html = '';
    photos.forEach(item => {
      html += `
        <div class="feed-card" id="${item.id}">
          <div class="feed-card-header">
            <div class="feed-user-wrap">
              <div class="feed-user-avatar">${item.studentName.charAt(0)}</div>
              <div class="feed-user-meta">
                <strong>${item.studentName}</strong>
                <small>${item.className} • ${item.school}</small>
              </div>
            </div>
            <span class="feed-verified-badge">✅ Tasdiqlandi (+${item.awardedPoints} ball)</span>
          </div>

          <div class="feed-img-box">
            <img src="${item.imgUrl}" alt="${item.wasteType}" loading="lazy">
          </div>

          <div class="feed-card-body">
            <div class="feed-tags-row">
              <span class="feed-tag waste">🏷️ ${item.wasteType}</span>
              <span class="feed-tag bin">${item.binLabel || '♻️ Qayta ishlash'}</span>
            </div>
            <p class="feed-note-text">${item.note}</p>
            <div class="feed-card-footer">
              <span>📅 ${item.date}</span>
              <button class="feed-like-btn" data-id="${item.id}">
                <span>❤️</span> <strong class="like-count">${item.likes || 0}</strong>
              </button>
            </div>
          </div>
        </div>
      `;
    });

    dom.communityPhotosFeed.innerHTML = html;

    // Like tugmalari
    dom.communityPhotosFeed.querySelectorAll('.feed-like-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const countEl = this.querySelector('.like-count');
        let currentLikes = parseInt(countEl.textContent, 10) || 0;
        if (!this.classList.contains('liked')) {
          this.classList.add('liked');
          countEl.textContent = currentLikes + 1;
          this.style.color = '#fda4af';
          playCorrectSound();
        } else {
          this.classList.remove('liked');
          countEl.textContent = Math.max(0, currentLikes - 1);
          this.style.color = '';
        }
      });
    });
  }

  // ================= 14. LEVELS TOP SAHIFASI LOGIKASI =================
  let currentLbGradeFilter = 'all';
  let currentLbTab = 'students'; // 'students' yoki 'classes'

  function renderLevelsView() {
    renderMyLevelCard();
    renderLevelTiersRoadmap();
    renderLevelsLeaderboard();
  }

  // Foydalanuvchining shaxsiy kartasi
  function renderMyLevelCard() {
    if (!userProfile) userProfile = getUserProfile();
    const currentLevel = getLevelByScore(userProfile.totalScore);
    const nextInfo = getNextLevelInfo(userProfile.totalScore);

    if (dom.myCardIcon) dom.myCardIcon.textContent = currentLevel.badgeIcon;
    if (dom.myCardName) dom.myCardName.textContent = userProfile.name || "Ali Valiyev";
    if (dom.myCardGrade) dom.myCardGrade.textContent = `${userProfile.gradeNum}-${userProfile.classLetter || 'A'} sinf`;
    if (dom.myCardSchool) dom.myCardSchool.textContent = userProfile.school || "Maktab";
    if (dom.myCardTierTitle) dom.myCardTierTitle.textContent = `${currentLevel.badgeIcon} ${currentLevel.name} (${currentLevel.uzTitle})`;
    if (dom.myCardDesc) dom.myCardDesc.textContent = currentLevel.desc;
    if (dom.myCardScore) dom.myCardScore.textContent = userProfile.totalScore || 0;

    if (nextInfo.isMax) {
      if (dom.nextLevelTitle) dom.nextLevelTitle.textContent = '👑 Maksimal daraja (Legend!)';
      if (dom.nextNeededLabel) dom.nextNeededLabel.textContent = 'Siz mutlaq chempionsiz!';
      if (dom.myLevelProgressFill) dom.myLevelProgressFill.style.width = '100%';
      if (dom.myLevelPercentText) dom.myLevelPercentText.textContent = '100% Cheksiz cho\'qqi!';
    } else {
      if (dom.nextLevelTitle) dom.nextLevelTitle.textContent = `${nextInfo.next.badgeIcon} ${nextInfo.next.name} (${nextInfo.next.uzTitle})`;
      if (dom.nextLevelNeeded) dom.nextLevelNeeded.textContent = `Yana ${nextInfo.needed} ball kerak`;
      if (dom.myLevelProgressFill) dom.myLevelProgressFill.style.width = `${nextInfo.progress}%`;
      if (dom.myLevelPercentText) dom.myLevelPercentText.textContent = `${nextInfo.progress}% bajarildi`;
    }
  }

  // 6 Darajalar xaritasi (Roadmap)
  function renderLevelTiersRoadmap() {
    if (!dom.levelTiersContainer) return;
    const currentScore = userProfile.totalScore || 0;
    const currentLevel = getLevelByScore(currentScore);

    let html = '';
    LEVEL_DEFINITIONS.forEach(tier => {
      const isCurrent = tier.id === currentLevel.id;
      const isReached = currentScore >= tier.minScore;

      html += `
        <div class="tier-card ${isCurrent ? 'active-user-tier' : ''}" style="border-top: 3px solid ${tier.color};">
          ${isCurrent ? '<span class="tier-user-indicator">📍 SIZ SHU YERDASIZ!</span>' : ''}
          <div class="tier-card-head">
            <span class="tier-badge-icon">${tier.badgeIcon}</span>
            <div class="tier-titles-wrap">
              <h4>${tier.name}</h4>
              <span class="tier-uz-title">${tier.uzTitle}</span>
            </div>
          </div>

          <span class="tier-score-pill">${tier.minScore} - ${tier.maxScore > 90000 ? '∞' : tier.maxScore} ball</span>
          <p class="tier-desc">${tier.desc}</p>
          <span class="tier-reward-note">🎁 ${tier.rewardNote}</span>
          <small style="font-size:0.7rem; color:var(--text-dim); margin-top:4px;">${tier.forGrades}</small>
        </div>
      `;
    });

    dom.levelTiersContainer.innerHTML = html;
  }

  // Reytingni chizish
  function renderLevelsLeaderboard() {
    if (currentLbTab === 'students') {
      renderStudentsLeaderboard();
    } else {
      renderClassesLeaderboard();
    }
  }

  function renderStudentsLeaderboard() {
    dom.tableViewTitle.textContent = "Levels Top — O'quvchilar Reytingi (1-5 Sinflar)";

    if (dom.leaderboardThead) {
      dom.leaderboardThead.innerHTML = `
        <tr>
          <th>O'rin</th>
          <th>O'quvchi & Sinf</th>
          <th>Maktab</th>
          <th>Darajasi (Level)</th>
          <th>Aniqlik</th>
          <th>Eko-Ball</th>
          <th>Faollik</th>
        </tr>
      `;
    }

    let list = getLevelsTopData();

    // Foydalanuvchining o'zini ham ro'yxatga qo'shish/yangilash
    if (userProfile && userProfile.name) {
      const userLevel = getLevelByScore(userProfile.totalScore);
      const userItem = {
        rank: 0,
        studentName: userProfile.name + " (Siz)",
        isUser: true,
        gradeNum: userProfile.gradeNum,
        className: `${userProfile.gradeNum}-${userProfile.classLetter || 'A'}`,
        school: userProfile.school || "Maktab",
        score: userProfile.totalScore,
        levelId: userLevel.id,
        accuracy: "96%",
        actionsCount: (userProfile.watchedVideos ? userProfile.watchedVideos.length : 0) + (userProfile.photos ? userProfile.photos.length : 0) + 1,
        badgeText: `${userLevel.badgeIcon} ${userLevel.name}`
      };

      // Eski o'zining yozuvini olib tashlab yangilaymiz
      list = list.filter(item => !item.isUser && item.studentName !== userProfile.name);
      list.push(userItem);
    }

    // Ball bo'yicha saralash
    list.sort((a, b) => b.score - a.score);

    // Sinf filtri
    if (currentLbGradeFilter !== 'all') {
      const g = parseInt(currentLbGradeFilter, 10);
      list = list.filter(item => item.gradeNum === g);
    }

    list.forEach((item, idx) => { item.rank = idx + 1; });

    // Podium (Top 3)
    renderLevelsPodium(list.slice(0, 3), 'student');

    // Jadval
    let rowsHtml = '';
    list.forEach(item => {
      const rank = item.rank;
      const rankBadge = rank === 1 ? 'rank-1' : (rank === 2 ? 'rank-2' : (rank === 3 ? 'rank-3' : 'rank-other'));
      const level = LEVEL_DEFINITIONS.find(l => l.id === item.levelId) || LEVEL_DEFINITIONS[0];

      rowsHtml += `
        <tr class="${item.isUser ? 'user-highlight-row' : ''}" style="${item.isUser ? 'background: rgba(16, 185, 129, 0.15); border-left: 3px solid var(--primary-mint);' : ''}">
          <td><span class="rank-badge ${rankBadge}">${rank}</span></td>
          <td>
            <strong>${item.studentName}</strong>
            <span class="class-tag" style="margin-left:0.5rem; font-size:0.75rem;">${item.className}</span>
          </td>
          <td>${item.school}</td>
          <td>
            <span class="level-badge-tag" style="background:${level.color}20; color:${level.color}; border:1px solid ${level.color}40;">
              ${level.badgeIcon} ${level.name}
            </span>
          </td>
          <td><span style="color:var(--primary-mint); font-weight:700;">${item.accuracy}</span></td>
          <td><strong class="score-highlight">${item.score}</strong> ball</td>
          <td>${rank === 1 ? '🥇 Yetakchi' : (item.actionsCount > 10 ? '🔥 Faol' : '⭐ Yangi')}</td>
        </tr>
      `;
    });

    if (list.length === 0) {
      rowsHtml = `<tr><td colspan="7" style="text-align:center; padding:2.5rem; color:var(--text-dim);">Ushbu sinf bo'yicha hali natijalar yo'q. Birinchi bo'lib ball to'plang!</td></tr>`;
    }

    dom.leaderboardTbody.innerHTML = rowsHtml;
  }

  function renderClassesLeaderboard() {
    dom.tableViewTitle.textContent = "Levels Top — Sinflar Chempionati (1-5 Sinflar)";

    if (dom.leaderboardThead) {
      dom.leaderboardThead.innerHTML = `
        <tr>
          <th>O'rin</th>
          <th>Sinf & Yetakchi</th>
          <th>Maktab</th>
          <th>Sinf Darajasi</th>
          <th>Faollik</th>
          <th>Jami Ball</th>
          <th>Holat</th>
        </tr>
      `;
    }

    let classList = getClassesTopData();

    if (currentLbGradeFilter !== 'all') {
      const g = parseInt(currentLbGradeFilter, 10);
      classList = classList.filter(item => item.gradeNum === g);
    }

    classList.sort((a, b) => b.totalScore - a.totalScore);
    classList.forEach((item, idx) => { item.rank = idx + 1; });

    renderLevelsPodium(classList.slice(0, 3), 'class');

    let rowsHtml = '';
    classList.forEach(cls => {
      const rank = cls.rank;
      const rankBadge = rank === 1 ? 'rank-1' : (rank === 2 ? 'rank-2' : (rank === 3 ? 'rank-3' : 'rank-other'));

      rowsHtml += `
        <tr>
          <td><span class="rank-badge ${rankBadge}">${rank}</span></td>
          <td>
            <span class="class-tag" style="font-size:0.9rem;">${cls.className}</span>
            <small style="display:block; color:var(--text-dim); margin-top:2px;">Top o'quvchi: ${cls.topStudent}</small>
          </td>
          <td>${cls.school}</td>
          <td><span style="color:#fbbf24; font-weight:800;">${cls.levelBadge}</span></td>
          <td><span style="color:var(--primary-mint); font-weight:700;">${cls.membersCount} ta o'quvchi</span></td>
          <td><strong class="score-highlight">${cls.totalScore}</strong> ball</td>
          <td>${rank === 1 ? '🥇 Chempion Sinf' : '⭐ Faol Sinf'}</td>
        </tr>
      `;
    });

    if (classList.length === 0) {
      rowsHtml = `<tr><td colspan="7" style="text-align:center; padding:2.5rem; color:var(--text-dim);">Ushbu sinf bo'yicha ma'lumotlar yo'q.</td></tr>`;
    }

    dom.leaderboardTbody.innerHTML = rowsHtml;
  }

  // 3D Podium render qilish
  function renderLevelsPodium(top3, type) {
    if (!dom.levelsPodiumWrapper) return;
    if (top3.length === 0) {
      dom.levelsPodiumWrapper.innerHTML = '';
      return;
    }

    const first = top3[0] || null;
    const second = top3[1] || null;
    const third = top3[2] || null;

    let html = '';

    // 2-o'rin (Kumush)
    if (second) {
      const title = type === 'class' ? second.className : second.studentName;
      const sub = type === 'class' ? second.school : `${second.className} | ${second.school}`;
      const score = type === 'class' ? second.totalScore : second.score;
      const badge = type === 'class' ? second.levelBadge : (second.badgeText || '🥈 Kumush');
      html += `
        <div class="podium-step step-silver">
          <div class="podium-avatar">🥈</div>
          <div class="podium-pillar">
            <span class="podium-rank-tag">2-O'RIN</span>
            <span class="podium-name">${title}</span>
            <span class="podium-sub">${sub}</span>
            <span style="font-size:0.75rem; color:#93c5fd; margin-bottom:4px;">${badge}</span>
            <strong class="podium-score">${score} ball</strong>
          </div>
        </div>
      `;
    }

    // 1-o'rin (Oltin)
    if (first) {
      const title = type === 'class' ? first.className : first.studentName;
      const sub = type === 'class' ? first.school : `${first.className} | ${first.school}`;
      const score = type === 'class' ? first.totalScore : first.score;
      const badge = type === 'class' ? first.levelBadge : (first.badgeText || '👑 Legend');
      html += `
        <div class="podium-step step-gold">
          <div class="podium-avatar">
            <span class="podium-crown">👑</span>
            🥇
          </div>
          <div class="podium-pillar">
            <span class="podium-rank-tag" style="color:#fbbf24;">1-O'RIN CHEMPION</span>
            <span class="podium-name" style="font-size:1.15rem; color:#fff;">${title}</span>
            <span class="podium-sub">${sub}</span>
            <span style="font-size:0.75rem; color:#fbbf24; margin-bottom:4px;">${badge}</span>
            <strong class="podium-score" style="font-size:1.4rem; color:#fbbf24;">${score} ball</strong>
          </div>
        </div>
      `;
    }

    // 3-o'rin (Bronza)
    if (third) {
      const title = type === 'class' ? third.className : third.studentName;
      const sub = type === 'class' ? third.school : `${third.className} | ${third.school}`;
      const score = type === 'class' ? third.totalScore : third.score;
      const badge = type === 'class' ? third.levelBadge : (third.badgeText || '🥉 Bronza');
      html += `
        <div class="podium-step step-bronze">
          <div class="podium-avatar">🥉</div>
          <div class="podium-pillar">
            <span class="podium-rank-tag">3-O'RIN</span>
            <span class="podium-name">${title}</span>
            <span class="podium-sub">${sub}</span>
            <span style="font-size:0.75rem; color:#fed7aa; margin-bottom:4px;">${badge}</span>
            <strong class="podium-score">${score} ball</strong>
          </div>
        </div>
      `;
    }

    dom.levelsPodiumWrapper.innerHTML = html;
  }

  // ================= 15. PROFILNI TAHRIRLASH MODALI =================
  function openProfileEditModal() {
    if (!dom.editProfileModal) return;
    if (!userProfile) userProfile = getUserProfile();

    if (dom.editProfileName) dom.editProfileName.value = userProfile.name || "Ali Valiyev";
    if (dom.editProfileGrade) dom.editProfileGrade.value = userProfile.gradeNum || 3;
    if (dom.editProfileLetter) dom.editProfileLetter.value = userProfile.classLetter || "A";
    if (dom.editProfileSchool) dom.editProfileSchool.value = userProfile.school || "21-maktab";

    dom.editProfileModal.classList.add('active');
  }

  if (dom.userHeaderWidget) dom.userHeaderWidget.addEventListener('click', openProfileEditModal);
  if (dom.btnEditProfileQuick) dom.btnEditProfileQuick.addEventListener('click', (e) => {
    e.stopPropagation();
    openProfileEditModal();
  });

  if (dom.btnCloseProfileModal) {
    dom.btnCloseProfileModal.addEventListener('click', () => {
      dom.editProfileModal.classList.remove('active');
    });
  }

  if (dom.profileEditForm) {
    dom.profileEditForm.addEventListener('submit', function (e) {
      e.preventDefault();
      userProfile.name = dom.editProfileName.value.trim() || "Ali Valiyev";
      userProfile.gradeNum = parseInt(dom.editProfileGrade.value, 10) || 3;
      userProfile.classLetter = (dom.editProfileLetter.value.trim() || "A").toUpperCase();
      userProfile.school = dom.editProfileSchool.value.trim() || "Maktab";

      saveUserProfile(userProfile);
      updateUserHeaderUI();
      renderLevelsView();

      dom.editProfileModal.classList.remove('active');
      playCorrectSound();
    });
  }

  // ================= 16. SAHIFALARNI ALMASHTIRISH (ROUTING) =================
  function switchView(viewId) {
    dom.sections.forEach(sec => {
      sec.classList.remove('active');
      if (sec.id === viewId) {
        sec.classList.add('active');
      }
    });

    dom.tabs.forEach(tab => {
      tab.classList.remove('active');
      if (tab.dataset.view === viewId) {
        tab.classList.add('active');
      }
    });

    if (viewId === 'video-view') {
      renderVideoLessons();
    } else if (viewId === 'photo-view') {
      renderPhotoFeed();
    } else if (viewId === 'levels-view') {
      renderLevelsView();
    }
  }

  // ================= 17. TUGMALAR VA HODISALAR (EVENT LISTENERS) =================

  // Navigatsiya tablari
  dom.tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchView(tab.dataset.view);
    });
  });

  if (dom.brandLogoBtn) {
    dom.brandLogoBtn.addEventListener('click', () => {
      switchView('game-view');
    });
  }

  // Video darslik sinf filtrlari
  if (dom.videoGradeFilters) {
    dom.videoGradeFilters.querySelectorAll('.grade-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        dom.videoGradeFilters.querySelectorAll('.grade-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentVideoGrade = pill.dataset.grade;
        renderVideoLessons();
      });
    });
  }

  // Levels Top sinf filtrlari
  if (dom.lbGradeFilters) {
    dom.lbGradeFilters.querySelectorAll('.lb-grade-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        dom.lbGradeFilters.querySelectorAll('.lb-grade-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentLbGradeFilter = pill.dataset.grade;
        renderLevelsLeaderboard();
      });
    });
  }

  // Levels Top tablari (O'quvchilar / Sinflar)
  if (dom.lbTabStudents) {
    dom.lbTabStudents.addEventListener('click', () => {
      dom.lbTabStudents.classList.add('active');
      dom.lbTabClasses.classList.remove('active');
      currentLbTab = 'students';
      renderLevelsLeaderboard();
    });
  }

  if (dom.lbTabClasses) {
    dom.lbTabClasses.addEventListener('click', () => {
      dom.lbTabClasses.classList.add('active');
      dom.lbTabStudents.classList.remove('active');
      currentLbTab = 'classes';
      renderLevelsLeaderboard();
    });
  }

  if (dom.btnOpenGameFromLb) {
    dom.btnOpenGameFromLb.addEventListener('click', () => {
      switchView('game-view');
    });
  }

  // O'yin boshqaruv tugmalari (Tugmalar orqali surish)
  if (dom.btnLeft) {
    dom.btnLeft.addEventListener('click', () => {
      if (gameState.isInteracting || gameState.currentIndex >= gameState.cards.length) return;
      const activeCard = dom.cardDeck.querySelector('.swipe-card.is-active');
      if (activeCard) {
        executeSwipe(activeCard, gameState.cards[gameState.currentIndex], 'general', 'left');
      }
    });
  }

  if (dom.btnRight) {
    dom.btnRight.addEventListener('click', () => {
      if (gameState.isInteracting || gameState.currentIndex >= gameState.cards.length) return;
      const activeCard = dom.cardDeck.querySelector('.swipe-card.is-active');
      if (activeCard) {
        executeSwipe(activeCard, gameState.cards[gameState.currentIndex], 'recycle', 'right');
      }
    });
  }

  if (dom.btnHint) dom.btnHint.addEventListener('click', showHintModal);

  // Ovozni yoqish / o'chirish
  if (dom.soundToggle) {
    dom.soundToggle.addEventListener('click', () => {
      gameState.soundEnabled = !gameState.soundEnabled;
      dom.soundIcon.textContent = gameState.soundEnabled ? '🔊' : '🔇';
      if (gameState.soundEnabled) {
        initAudio();
        playCorrectSound();
      }
    });
  }

  // Yordam modali
  if (dom.helpBtn) dom.helpBtn.addEventListener('click', () => { dom.helpModal.classList.add('active'); });
  if (dom.closeHelpBtn) dom.closeHelpBtn.addEventListener('click', () => { dom.helpModal.classList.remove('active'); });
  if (dom.closeHelpConfirmBtn) dom.closeHelpConfirmBtn.addEventListener('click', () => { dom.helpModal.classList.remove('active'); });

  // Dars rejimi tugmalari
  if (dom.startClassBtn) {
    dom.startClassBtn.addEventListener('click', () => {
      switchView('game-view');
      startNewGame('class');
      triggerConfetti(60);
    });
  }

  if (dom.viewLessonBtn) {
    dom.viewLessonBtn.addEventListener('click', () => {
      dom.lessonPlanContainer.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Klaviaturada o'ynash (ArrowLeft, ArrowRight, A, D, Space)
  window.addEventListener('keydown', (e) => {
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;

    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      if (dom.btnLeft) dom.btnLeft.click();
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      if (dom.btnRight) dom.btnRight.click();
    } else if (e.key === ' ' || e.key === 'h' || e.key === 'H') {
      showHintModal();
    }
  });

  // ================= 18. EKO-FAKT TICKER ROTATOR =================
  let currentFactIdx = 0;
  function updateTicker() {
    if (typeof ECO_FACTS !== 'undefined' && ECO_FACTS.length > 0 && dom.tickerText) {
      dom.tickerText.style.opacity = '0';
      setTimeout(() => {
        dom.tickerText.textContent = ECO_FACTS[currentFactIdx];
        dom.tickerText.style.opacity = '1';
        currentFactIdx = (currentFactIdx + 1) % ECO_FACTS.length;
      }, 300);
    }
  }

  // ================= 19. DASTURNI BOSHLASH (STARTUP) =================
  function initApp() {
    updateTicker();
    setInterval(updateTicker, 10000);

    // O'quvchi profili va levellarni yuklash
    updateUserHeaderUI();
    setupPhotoUploadAndScanner();
    renderVideoLessons();
    renderPhotoFeed();
    renderLevelsView();

    // O'yinni standart rejimda boshlash
    startNewGame('standard');

    // Foydalanuvchi birinchi marta bosganda audio kontekstini uyg'otish
    document.addEventListener('click', function unlockAudio() {
      initAudio();
      document.removeEventListener('click', unlockAudio);
    }, { once: true });
  }

  // DOM yuklangach ishga tushirish
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
