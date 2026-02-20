// Uses js/questionBank.js (window.TESTS)
// NOTE: options are shuffled per attempt; correct answer stays the same string.
function getExamConfig(){
  const id = (window.getSelectedTestId ? window.getSelectedTestId() : (localStorage.getItem("selectedTest") || "DSA"));
  const tests = window.TESTS || {};
  const t = tests[id] || tests.DSA;
  return {
    testId: tests[id] ? id : "DSA",
    testName: (t && t.name) ? t.name : "DSA",
    durationSeconds: (t && Number.isFinite(t.durationSeconds)) ? t.durationSeconds : 10*60,
    questions: (t && Array.isArray(t.questions)) ? t.questions : []
  };
}

// Persist current exam state (prevents losing answers on refresh)
function stateKey(){
  const u = localStorage.getItem("user") || "Student";
  const cfg = getExamConfig();
  return "examState_" + u + "_" + cfg.testId;
}

function saveState(){
  try{
    const cfg = getExamConfig();
    const payload = {
      v: 1,
      testId: cfg.testId,
      testName: cfg.testName,
      durationSeconds: cfg.durationSeconds,
      questions,
      current,
      answers,
      timeLeft,
      // used to detect very old states
      savedAt: Date.now()
    };
    sessionStorage.setItem(stateKey(), JSON.stringify(payload));
  }catch(e){ /* ignore */ }
}

function clearState(){
  try{ sessionStorage.removeItem(stateKey()); }catch(e){ /* ignore */ }
}

function loadState(){
  try{
    const raw = sessionStorage.getItem(stateKey());
    if(!raw) return false;
    const st = JSON.parse(raw);
    if(!st || st.v !== 1 || !Array.isArray(st.questions)) return false;

    // consider state invalid if it looks too old (2 hours) to avoid surprise resumes
    if(typeof st.savedAt === "number" && Date.now() - st.savedAt > 2*60*60*1000){
      clearState();
      return false;
    }

    questions = st.questions;
    current = Number.isFinite(st.current) ? st.current : 0;
    answers = st.answers && typeof st.answers === "object" ? st.answers : {};
    const cfg = getExamConfig();
    const fallback = Number.isFinite(st.durationSeconds) ? st.durationSeconds : cfg.durationSeconds;
    timeLeft = Number.isFinite(st.timeLeft) ? st.timeLeft : fallback;
    return true;
  }catch(e){
    return false;
  }
}

let questions = [];
let current = 0;
let answers = {}; // index -> selected option string
let timeLeft = 10 * 60;
let timerHandle = null;

// ---------- helpers ----------
function shuffle(arr){
  // Fisher–Yates
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fmtTime(sec){
  const m = Math.floor(sec/60);
  const s = sec%60;
  return `${m}:${s<10?"0":""}${s}`;
}

function qs(id){ return document.getElementById(id); }

function escapeHtml(str){
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ---------- init ----------
document.addEventListener("DOMContentLoaded", () => {
  // Only run on exam page
  if(!qs("palette") || !qs("questionContainer")) return;

  const cfg = getExamConfig();
  const testNameEl = qs("testName");
  if(testNameEl) testNameEl.textContent = cfg.testName;

  // restore previous in-progress attempt if present, otherwise start fresh
  const restored = loadState();
  if(!restored){
    // build per-attempt questions with shuffled options
    questions = cfg.questions.map(item => ({
      q: item.q,
      a: item.a,
      o: shuffle(item.o)
    }));
    current = 0;
    answers = {};
    timeLeft = cfg.durationSeconds;
    saveState();
  }

  qs("totalQuestions").innerText = questions.length;

  loadPalette();
  renderQuestion();
  updateProgress();
  startTimer();
});

function loadPalette(){
  const palette = qs("palette");
  palette.innerHTML = "";

  questions.forEach((_, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pal-btn";
    btn.textContent = i + 1;
    btn.addEventListener("click", () => {
      current = i;
      renderQuestion();
    });
    palette.appendChild(btn);
  });

  updatePalette();
}

function renderQuestion(){
  const q = questions[current];
  const container = qs("questionContainer");

  // NOTE: previously this used data-* with JSON.stringify without quotes, which breaks
  // when an option contains spaces/symbols. We now use the radio value safely.
  const optionsHtml = q.o.map(opt => {
    const checked = answers[current] === opt ? "checked" : "";
    const safeVal = escapeHtml(opt);
    return `
      <label class="opt">
        <input type="radio" name="opt" value="${safeVal}" ${checked}>
        <span>${safeVal}</span>
      </label>
    `;
  }).join("");

  container.innerHTML = `
    <div class="q-meta muted">Question ${current+1} of ${questions.length}</div>
    <div class="q-text">${escapeHtml(q.q)}</div>
    <div class="opts">${optionsHtml}</div>
  `;

  // attach listeners after render
  container.querySelectorAll('input[type="radio"][name="opt"]').forEach(inp => {
    inp.addEventListener("change", (e) => {
      selectAnswer(current, e.target.value);
    });
  });

  // Next button text becomes Finish on last question
  const nextBtn = qs("nextBtn");
  if(nextBtn){
    nextBtn.textContent = (current === questions.length - 1) ? "Finish" : "Next";
  }

  updatePalette();
}

function selectAnswer(index, opt){
  answers[index] = opt;
  saveState();
  updateProgress();
  updatePalette();
}

window.nextQ = function(){
  if(current === questions.length - 1){
    submitExam(true);
    return;
  }
  current = Math.min(current + 1, questions.length - 1);
  saveState();
  renderQuestion();
};

window.prevQ = function(){
  current = Math.max(current - 1, 0);
  saveState();
  renderQuestion();
};

function updatePalette(){
  const btns = document.querySelectorAll("#palette .pal-btn");
  btns.forEach((b, i) => {
    b.classList.remove("active", "answered");
    if(i === current) b.classList.add("active");
    if(answers[i] !== undefined) b.classList.add("answered");
  });
}

function updateProgress(){
  const answeredCount = Object.keys(answers).length;
  qs("answered").innerText = answeredCount;

  const percent = (answeredCount / questions.length) * 100;
  qs("progressFill").style.width = percent + "%";
  qs("progressFill").setAttribute("aria-valuenow", String(Math.round(percent)));

  const progressText = qs("progressText");
  if(progressText) progressText.textContent = `${Math.round(percent)}% complete`;
}

// ---------- timer ----------
function startTimer(){
  qs("timer").innerText = fmtTime(timeLeft);

  timerHandle = setInterval(() => {
    timeLeft--;
    qs("timer").innerText = fmtTime(Math.max(timeLeft, 0));

    // persist every 5 seconds to reduce write churn
    if(timeLeft % 5 === 0) saveState();

    if(timeLeft <= 0){
      clearInterval(timerHandle);
      submitExam(false); // auto submit (no confirm)
    }
  }, 1000);
}

// ---------- submit + store attempt ----------
window.submitExam = function(withConfirm){
  if(withConfirm){
    const ok = confirm("Submit the test now?");
    if(!ok) return;
  }

  if(timerHandle) clearInterval(timerHandle);

  // Score + breakdown
  let correct = 0;
  const review = questions.map((q, i) => {
    const selected = answers[i]; // string or undefined
    const isCorrect = selected !== undefined && selected === q.a;
    if(isCorrect) correct++;
    return {
      index: i+1,
      question: q.q,
      options: q.o,
      correctAnswer: q.a,
      selectedAnswer: selected ?? null,
      status: selected === undefined ? "unanswered" : (isCorrect ? "correct" : "wrong")
    };
  });

  const total = questions.length;
  const wrong = review.filter(r => r.status === "wrong").length;
  const unanswered = review.filter(r => r.status === "unanswered").length;
  const percent = total ? (correct/total)*100 : 0;

  // Grade based on percentage (A/B/C/D/Fail)
  // A: 80%+  |  B: 70-79%  |  C: 60-69%  |  D: 50-59%  |  Fail: <50%
  let grade = "Fail";
  if(percent >= 80) grade = "A";
  else if(percent >= 70) grade = "B";
  else if(percent >= 60) grade = "C";
  else if(percent >= 50) grade = "D";

  const cfg = getExamConfig();

  const attempt = {
    user: localStorage.getItem("user") || "Student",
    testId: cfg.testId,
    testName: cfg.testName,
    date: new Date().toLocaleString(),
    total,
    correct,
    wrong,
    unanswered,
    percent,
    grade,
    durationSeconds: cfg.durationSeconds,
    remainingSeconds: Math.max(timeLeft, 0),
    review
  };

  localStorage.setItem("lastAttempt", JSON.stringify(attempt));
  clearState();

  // Also keep history per user (optional)
  const key = "attemptHistory_" + attempt.user;
  const hist = JSON.parse(localStorage.getItem(key) || "[]");
  hist.unshift(attempt);
  localStorage.setItem(key, JSON.stringify(hist.slice(0, 20)));

  // Global attempts list for leaderboard (device-local)
  const all = JSON.parse(localStorage.getItem("allAttempts") || "[]");
  all.unshift(attempt);
  localStorage.setItem("allAttempts", JSON.stringify(all.slice(0, 200)));

  window.location.href = "./result.html";
};
