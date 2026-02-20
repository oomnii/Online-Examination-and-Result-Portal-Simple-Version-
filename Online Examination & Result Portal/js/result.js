(function(){
  function $(id){ return document.getElementById(id); }

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function render(){
    const meta = $('attemptMeta');
    const reviewList = $('reviewList');

    let attempt = null;
    try{ attempt = JSON.parse(localStorage.getItem('lastAttempt') || 'null'); }catch(e){ attempt = null; }

    if(!attempt){
      if(meta) meta.textContent = 'No attempt found. Start a test first.';
      if(reviewList) reviewList.innerHTML = '';
      return;
    }

    const tname = attempt.testName ? ` • Test: ${attempt.testName}` : '';
    if(meta) meta.textContent = `Student: ${attempt.user} • Date: ${attempt.date}${tname}`;

    $('scoreVal').textContent = attempt.correct;
    $('totalVal').textContent = attempt.total;
    $('percentVal').textContent = Number(attempt.percent || 0).toFixed(1);
    $('gradeVal').textContent = attempt.grade;
    $('correctVal').textContent = attempt.correct;
    $('wrongVal').textContent = attempt.wrong;
    $('unansweredVal').textContent = attempt.unanswered;

    $('barFill').style.width = Number(attempt.percent || 0) + '%';

    // Render review cards
    const review = Array.isArray(attempt.review) ? attempt.review : [];
    if(reviewList){
      reviewList.innerHTML = review.map(r => {
        const statusClass = r.status || 'unanswered';
        const your = (r.selectedAnswer === null || r.selectedAnswer === undefined) ? 'Not answered' : r.selectedAnswer;
        const options = Array.isArray(r.options) ? r.options : [];

        const optsHtml = options.map(opt => {
          const safe = escapeHtml(opt);
          const isCorrect = opt === r.correctAnswer;
          const isSelected = (r.selectedAnswer !== null && r.selectedAnswer !== undefined && opt === r.selectedAnswer);
          const cls = isCorrect ? 'optline correct' : isSelected ? 'optline selected' : 'optline';
          const badge = isCorrect ? "<span class='pill pill-correct'>Correct</span>" : isSelected ? "<span class='pill pill-selected'>Your pick</span>" : '';
          return `<div class="${cls}">${safe} ${badge}</div>`;
        }).join('');

        return `
          <div class="review-card ${statusClass}">
            <div class="review-q">Q${r.index}. ${escapeHtml(r.question)}</div>
            <div class="review-a">
              <div><span class="tag">Your Answer</span> <span class="ans">${escapeHtml(your)}</span></div>
              <div><span class="tag">Correct</span> <span class="ans"><b>${escapeHtml(r.correctAnswer)}</b></span></div>
              <div class="optlist">${optsHtml}</div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Only run on result page
    if(!$('reviewList')) return;

    if(typeof requireLogin === 'function') requireLogin();

    render();
  });

  window.retest = function(){
    localStorage.removeItem('lastAttempt');
    window.location.href = './exam.html';
  };
})();
