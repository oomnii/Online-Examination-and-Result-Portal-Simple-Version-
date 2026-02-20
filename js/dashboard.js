// Dashboard logic (runs after auth.js + questionBank.js)
(function(){
  function $(id){ return document.getElementById(id); }

  document.addEventListener('DOMContentLoaded', () => {
    // Ensure we are on dashboard page
    if(!$('testSelect') || !$('userName')) return;

    if(typeof requireLogin === 'function') requireLogin();

    const user = localStorage.getItem('user') || 'Student';
    $('userName').textContent = user;

    // Last attempt summary
    try{
      const last = JSON.parse(localStorage.getItem('lastAttempt') || 'null');
      if(last && last.user === user && $('lastResultText')){
        $('lastResultText').textContent = `Latest: ${last.correct}/${last.total} (${Number(last.percent||0).toFixed(1)}%) • Grade ${last.grade}`;
      }
    }catch(e){}

    // Populate test selector
    const tests = window.TESTS || {};
    const ids = Object.keys(tests);
    const sel = $('testSelect');
    const meta = $('testMeta');

    sel.innerHTML = '';
    ids.forEach(id => {
      const opt = document.createElement('option');
      opt.value = id;
      opt.textContent = (tests[id] && tests[id].name) ? tests[id].name : id;
      sel.appendChild(opt);
    });

    const saved = localStorage.getItem('selectedTest');
    if(saved && ids.includes(saved)) sel.value = saved;
    else if(ids.length) sel.value = ids[0];

    function refreshMeta(){
      const id = sel.value || (ids[0] || 'DSA');
      const t = tests[id];
      const qn = (t && Array.isArray(t.questions)) ? t.questions.length : 0;
      const mins = (t && Number.isFinite(t.durationSeconds)) ? Math.round(t.durationSeconds/60) : 10;
      if(meta) meta.textContent = `${qn} questions • ${mins} minutes • auto-submit`;
      localStorage.setItem('selectedTest', id);
    }

    sel.addEventListener('change', refreshMeta);
    refreshMeta();
  });

  // Functions used by onclick attributes
  window.startExam = function(){
    const sel = document.getElementById('testSelect');
    const id = sel && sel.value ? sel.value : 'DSA';
    localStorage.setItem('selectedTest', id);
    window.location.href = './exam.html';
  };

  window.viewResult = function(){
    window.location.href = './result.html';
  };

  window.goHistory = function(){
    window.location.href = './history.html';
  };

  window.goLeaderboard = function(){
    window.location.href = './leaderboard.html';
  };

  window.goCreateQuiz = function(){
    window.location.href = './create-quiz.html';
  };
})();
