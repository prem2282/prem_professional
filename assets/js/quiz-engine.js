/**
 * Gamified quiz engine — mobile-first, popup feedback
 * Expects window.QUIZ_CONFIG
 */
(function () {
  'use strict';

  var CORRECT_REMARKS = [
    'Great job!', 'Super!', 'Nailed it!', 'Spot on!', 'You got it!',
    'Crushed it!', 'Exactly right!', 'Brilliant!'
  ];

  var WRONG_REMARKS = [
    'Oh no!', 'Not quite!', "That's not right", 'Close, but no',
    'Missed it!', 'Good try!', 'Almost…'
  ];

  var RANKS = [
    { min: 5, title: 'GenAI Architect', emoji: '🏆' },
    { min: 4, title: 'Production Practitioner', emoji: '⚡' },
    { min: 3, title: 'Curious Builder', emoji: '🔧' },
    { min: 0, title: 'Explorer — replay?', emoji: '🧭' },
  ];

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function getRank(correct) {
    for (var i = 0; i < RANKS.length; i++) {
      if (correct >= RANKS[i].min) return RANKS[i];
    }
    return RANKS[RANKS.length - 1];
  }

  function spawnConfetti() {
    var container = document.getElementById('quiz-confetti');
    if (!container) return;
    container.innerHTML = '';
    var colors = ['#22d3ee', '#a78bfa', '#34d399', '#e879f9', '#fbbf24', '#fb7185'];
    for (var i = 0; i < 36; i++) {
      var piece = document.createElement('span');
      piece.className = 'quiz-confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = Math.random() * 0.4 + 's';
      piece.style.animationDuration = (1.2 + Math.random() * 1.2) + 's';
      piece.style.width = (5 + Math.random() * 6) + 'px';
      piece.style.height = piece.style.width;
      container.appendChild(piece);
    }
    setTimeout(function () { container.innerHTML = ''; }, 2200);
  }

  function initQuiz() {
    var cfg = window.QUIZ_CONFIG;
    if (!cfg || !cfg.questions || !cfg.questions.length) return;

    var root = document.getElementById('quiz-root');
    if (!root) return;

    var state = {
      index: 0,
      correct: 0,
      xp: 0,
      streak: 0,
      answered: false,
    };

    var els = {
      progressFill: document.getElementById('quiz-progress-fill'),
      xp: document.getElementById('quiz-xp'),
      playScreen: document.getElementById('quiz-play'),
      resultsScreen: document.getElementById('quiz-results'),
      questionStage: document.getElementById('quiz-question-stage'),
      questionText: document.getElementById('quiz-question-text'),
      options: document.getElementById('quiz-options'),
      feedback: document.getElementById('quiz-feedback'),
      feedbackCard: document.getElementById('quiz-feedback-card'),
      feedbackIcon: document.getElementById('quiz-feedback-icon'),
      feedbackRemark: document.getElementById('quiz-feedback-remark'),
      feedbackInsight: document.getElementById('quiz-feedback-insight'),
      nextBtn: document.getElementById('quiz-next-btn'),
      resultsBadge: document.getElementById('quiz-results-badge'),
      resultsRank: document.getElementById('quiz-results-rank'),
      resultsScore: document.getElementById('quiz-results-score'),
      replayBtn: document.getElementById('quiz-replay-btn'),
    };

    function updateProgress() {
      var pct = (state.index / cfg.questions.length) * 100;
      if (els.progressFill) els.progressFill.style.width = pct + '%';
    }

    function animateQuestionIn() {
      if (!els.questionStage) return;
      els.questionStage.classList.remove('is-entering');
      void els.questionStage.offsetWidth;
      els.questionStage.classList.add('is-entering');
    }

    function renderQuestion() {
      var q = cfg.questions[state.index];
      state.answered = false;
      els.options.innerHTML = '';
      if (els.questionText) els.questionText.textContent = q.text;
      updateProgress();

      q.choices.forEach(function (choice) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quiz-option';
        btn.dataset.id = choice.id;
        btn.innerHTML =
          '<span class="quiz-option-letter">' + choice.id + '</span>' +
          '<span class="quiz-option-text">' + choice.text + '</span>';
        btn.addEventListener('click', function () {
          onSelect(choice.id);
        });
        els.options.appendChild(btn);
      });

      animateQuestionIn();
    }

    function closeFeedback() {
      if (els.feedback) {
        els.feedback.classList.remove('is-open');
        els.feedback.setAttribute('aria-hidden', 'true');
      }
      if (els.feedbackCard) {
        els.feedbackCard.classList.remove('is-correct', 'is-wrong');
      }
      if (els.nextBtn) {
        els.nextBtn.classList.remove('is-correct-btn', 'is-wrong-btn');
      }
    }

    function openFeedback(isCorrect, insight) {
      if (!els.feedback || !els.feedbackCard) return;

      els.feedbackCard.classList.remove('is-correct', 'is-wrong');
      els.feedbackCard.classList.add(isCorrect ? 'is-correct' : 'is-wrong');

      if (els.feedbackRemark) els.feedbackRemark.textContent = isCorrect ? pick(CORRECT_REMARKS) : pick(WRONG_REMARKS);
      if (els.feedbackInsight) els.feedbackInsight.textContent = insight;

      if (els.nextBtn) {
        var isLast = state.index >= cfg.questions.length - 1;
        els.nextBtn.textContent = isLast ? 'See results →' : 'Continue →';
        els.nextBtn.classList.toggle('is-correct-btn', isCorrect);
        els.nextBtn.classList.toggle('is-wrong-btn', !isCorrect);
      }

      if (els.feedbackIcon) els.feedbackIcon.textContent = isCorrect ? '✨' : '🔥';

      els.feedback.classList.add('is-open');
      els.feedback.setAttribute('aria-hidden', 'false');
      if (isCorrect) spawnConfetti();
    }

    function onSelect(selectedId) {
      if (state.answered) return;
      state.answered = true;

      var q = cfg.questions[state.index];
      var isCorrect = selectedId === q.answer;
      var buttons = els.options.querySelectorAll('.quiz-option');

      buttons.forEach(function (b) {
        b.disabled = true;
        var id = b.dataset.id;
        if (id === q.answer) b.classList.add('correct');
        else if (id === selectedId && !isCorrect) b.classList.add('wrong');
        else if (id !== q.answer) b.classList.add('dimmed');
      });

      if (isCorrect) {
        state.correct += 1;
        state.streak += 1;
        var bonus = state.streak >= 2 ? 25 : 0;
        state.xp += 100 + bonus;
        if (els.xp) {
          els.xp.textContent = state.xp;
          var chip = els.xp.closest('.quiz-xp-chip');
          if (chip) {
            chip.classList.add('bump');
            setTimeout(function () { chip.classList.remove('bump'); }, 350);
          }
        }
      } else {
        state.streak = 0;
      }

      openFeedback(isCorrect, q.insight);
    }

    function showResults() {
      closeFeedback();
      if (els.progressFill) els.progressFill.style.width = '100%';
      els.playScreen.classList.add('hidden');
      els.resultsScreen.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      var rank = getRank(state.correct);
      if (els.resultsBadge) els.resultsBadge.textContent = rank.emoji;
      if (els.resultsRank) els.resultsRank.textContent = rank.title;
      if (els.resultsScore) {
        els.resultsScore.textContent =
          state.correct + ' / ' + cfg.questions.length + ' correct · ' + state.xp + ' XP';
      }
      if (state.correct >= 4) spawnConfetti();
    }

    function replay() {
      state.index = 0;
      state.correct = 0;
      state.xp = 0;
      state.streak = 0;
      if (els.xp) els.xp.textContent = '0';
      closeFeedback();
      els.resultsScreen.classList.add('hidden');
      els.playScreen.classList.remove('hidden');
      renderQuestion();
    }

    if (els.nextBtn) {
      els.nextBtn.addEventListener('click', function () {
        if (!state.answered) return;
        closeFeedback();
        if (state.index >= cfg.questions.length - 1) {
          showResults();
          return;
        }
        state.index += 1;
        renderQuestion();
      });
    }

    if (els.replayBtn) els.replayBtn.addEventListener('click', replay);

    var linkedInSlot = document.getElementById('quiz-linkedin-cta');
    if (linkedInSlot) {
      var linkedInUrl = cfg.linkedInUrl || 'https://www.linkedin.com/in/prem2282/';
      var profileImg = cfg.profileImage || (cfg.assetRoot || '../') + 'Prem_2026.webp';
      linkedInSlot.innerHTML =
        '<p class="quiz-linkedin-note">Enjoyed this? I post quizzes &amp; insights daily.</p>' +
        '<a href="' + linkedInUrl + '" class="quiz-linkedin-link" target="_blank" rel="noopener noreferrer">' +
        '<img src="' + profileImg + '" alt="" class="quiz-linkedin-avatar" width="24" height="24" decoding="async" />' +
        '<span>Follow me on LinkedIn</span></a>';
    }

    renderQuestion();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuiz);
  } else {
    initQuiz();
  }
})();
