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

  document.addEventListener('DOMContentLoaded', () => {
    if(!$('histList') || !$('filterTest')) return;

    if(typeof requireLogin === 'function') requireLogin();

    const user = localStorage.getItem('user') || 'Student';
    const key = 'attemptHistory_' + user;

    const meta = $('histMeta');
    const list = $('histList');
    const filter = $('filterTest');

    function loadHistory(){
      try{ return JSON.parse(localStorage.getItem(key) || '[]'); }catch(e){ return []; }
    }

    function initFilter(){
      filter.innerHTML = '';

      const optAll = document.createElement('option');
      optAll.value = 'ALL';
      optAll.textContent = 'All tests';
      filter.appendChild(optAll);

      const ids = window.TESTS ? Object.keys(window.TESTS) : [];
      ids.forEach(id => {
        const opt = document.createElement('option');
        opt.value = id;
        opt.textContent = window.TESTS[id].name;
        filter.appendChild(opt);
      });

      filter.addEventListener('change', render);
    }

    function render(){
      const hist = loadHistory();
      if(meta) meta.textContent = `Student: ${user} • Total attempts saved: ${hist.length}`;

      const fid = filter.value || 'ALL';
      const filtered = fid === 'ALL' ? hist : hist.filter(a => a.testId === fid);

      if(filtered.length === 0){
        list.innerHTML = `<div class="muted">No attempts found for this filter.</div>`;
        return;
      }

      list.innerHTML = filtered.map((a, idx) => {
        const badge = a.grade === 'A' ? 'pill pill-correct' : a.grade === 'Fail' ? 'pill' : 'pill pill-selected';
        const t = a.testName || a.testId || 'Test';
        const statusClass = (a.grade === 'Fail') ? 'wrong' : 'correct';
        return `
          <div class="review-card ${statusClass}">
            <div class="review-q">
              ${idx+1}. ${escapeHtml(t)} <span class="${badge}">Grade ${escapeHtml(a.grade||'-')}</span>
            </div>
            <div class="review-a">
              <div><span class="tag">Score</span> <span class="ans"><b>${a.correct}</b>/${a.total} (${Number(a.percent||0).toFixed(1)}%)</span></div>
              <div><span class="tag">Date</span> <span class="ans">${escapeHtml(a.date||'')}</span></div>
              <div class="row gap" style="margin-top:6px; flex-wrap:wrap;">
                <button class="btn btn-primary" onclick="openAttempt(${idx})">Open Review</button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    window.openAttempt = function(index){
      const hist = loadHistory();
      const fid = filter.value || 'ALL';
      const filtered = fid === 'ALL' ? hist : hist.filter(a => a.testId === fid);
      const picked = filtered[index];
      if(!picked) return;
      localStorage.setItem('lastAttempt', JSON.stringify(picked));
      if(picked.testId) localStorage.setItem('selectedTest', picked.testId);
      window.location.href = './result.html';
    };

    window.clearHistory = function(){
      const ok = confirm('Clear your attempt history on this device?');
      if(!ok) return;
      localStorage.removeItem(key);
      render();
    };

    window.goDashboard = function(){
      window.location.href = './dashboard.html';
    };

    initFilter();
    render();
  });
})();
