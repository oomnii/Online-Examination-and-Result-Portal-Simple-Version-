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
    if(!$('lbList') || !$('lbFilter')) return;

    if(typeof requireLogin === 'function') requireLogin();

    const meta = $('lbMeta');
    const list = $('lbList');
    const filter = $('lbFilter');

    function readAll(){
      try{ return JSON.parse(localStorage.getItem('allAttempts') || '[]'); }catch(e){ return []; }
    }

    function initFilter(){
      filter.innerHTML = '';
      const optAll = document.createElement('option');
      optAll.value = 'ALL';
      optAll.textContent = 'Overall (all tests)';
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
      const all = readAll();
      const fid = filter.value || 'ALL';
      const rows = (fid === 'ALL') ? all : all.filter(a => a.testId === fid);

      // Best attempt per user (and per test if overall)
      const best = new Map();
      rows.forEach(a => {
        const k = (fid === 'ALL') ? `${a.user}::${a.testId||''}` : (a.user || '');
        const cur = best.get(k);
        if(!cur || (a.percent||0) > (cur.percent||0) || ((a.percent||0) === (cur.percent||0) && (a.correct||0) > (cur.correct||0))){
          best.set(k, a);
        }
      });

      const out = Array.from(best.values()).sort((a,b) => {
        const dp = (b.percent||0) - (a.percent||0);
        if(dp !== 0) return dp;
        const dc = (b.correct||0) - (a.correct||0);
        if(dc !== 0) return dc;
        return String(b.date||'').localeCompare(String(a.date||''));
      }).slice(0, 12);

      if(meta) meta.textContent = `Entries: ${out.length} • Source attempts saved: ${rows.length}`;

      if(out.length === 0){
        list.innerHTML = `<div class="muted">No attempts found yet. Take a test first.</div>`;
        return;
      }

      list.innerHTML = out.map((a, i) => {
        const t = a.testName || a.testId || 'Test';
        return `
          <div class="review-card correct">
            <div class="review-q">#${i+1} • ${escapeHtml(a.user||'Student')}</div>
            <div class="review-a">
              <div><span class="tag">Test</span> <span class="ans">${escapeHtml(t)}</span></div>
              <div><span class="tag">Best Score</span> <span class="ans"><b>${a.correct}</b>/${a.total} (${Number(a.percent||0).toFixed(1)}%) • Grade ${escapeHtml(a.grade||'-')}</span></div>
              <div><span class="tag">Date</span> <span class="ans">${escapeHtml(a.date||'')}</span></div>
            </div>
          </div>
        `;
      }).join('');
    }

    window.clearBoard = function(){
      const ok = confirm('Clear the device leaderboard data (allAttempts)?');
      if(!ok) return;
      localStorage.removeItem('allAttempts');
      render();
    };

    window.goDashboard = function(){
      window.location.href = './dashboard.html';
    };

    initFilter();
    render();
  });
})();
