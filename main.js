(() => {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded','false');
    }));
  }

  document.getElementById('year').textContent = new Date().getFullYear();

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  let countersStarted = false;
  const impact = document.getElementById('impact');
  const countObserver = new IntersectionObserver((entries) => {
    if (!countersStarted && entries.some(e => e.isIntersecting)) {
      countersStarted = true;
      document.querySelectorAll('.stat-value').forEach(animateCounter);
      countObserver.disconnect();
    }
  }, { threshold: 0.25 });
  if (impact) countObserver.observe(impact);

  function animateCounter(el) {
    const target = parseFloat(el.dataset.count || '0');
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const format = el.dataset.format || '';
    const duration = 1200;
    const start = performance.now();
    function frame(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      let value = target * eased;
      let output = decimals ? value.toFixed(decimals) : Math.round(value).toString();
      if (format === 'comma' && !decimals) output = Number(output).toLocaleString('en-US');
      el.textContent = `${prefix}${output}${suffix}`;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  drawRadar();
  window.addEventListener('resize', debounce(drawRadar, 200));

  function debounce(fn, delay) {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
  }

  function drawRadar() {
    const canvas = document.getElementById('leadershipRadar');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const size = Math.max(300, Math.min(520, rect.width || 520));
    canvas.width = size * dpr; canvas.height = size * dpr;
    const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
    const labels = ['EA','GCC','Strategy','Cyber','Cloud','AI','M&A','Global Ops'];
    const values = [95,98,96,92,96,90,97,97];
    const cx = size/2, cy = size/2, radius = size*0.34;
    ctx.clearRect(0,0,size,size);
    ctx.font = `${Math.max(10,size*.027)}px Segoe UI, Arial`;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    for (let ring=1; ring<=5; ring++) {
      ctx.beginPath();
      labels.forEach((_,i)=>{
        const a=-Math.PI/2+i*2*Math.PI/labels.length;
        const r=radius*ring/5;
        const x=cx+Math.cos(a)*r, y=cy+Math.sin(a)*r;
        i?ctx.lineTo(x,y):ctx.moveTo(x,y);
      });
      ctx.closePath(); ctx.strokeStyle='#d8e4eb'; ctx.lineWidth=1; ctx.stroke();
    }
    labels.forEach((lab,i)=>{
      const a=-Math.PI/2+i*2*Math.PI/labels.length;
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(a)*radius,cy+Math.sin(a)*radius); ctx.strokeStyle='#e2ebf0'; ctx.stroke();
      const lr=radius*1.17; ctx.fillStyle='#486377'; ctx.fillText(lab,cx+Math.cos(a)*lr,cy+Math.sin(a)*lr);
    });
    ctx.beginPath();
    values.forEach((v,i)=>{
      const a=-Math.PI/2+i*2*Math.PI/values.length; const r=radius*v/100;
      const x=cx+Math.cos(a)*r, y=cy+Math.sin(a)*r;
      i?ctx.lineTo(x,y):ctx.moveTo(x,y);
    });
    ctx.closePath(); ctx.fillStyle='rgba(29,109,158,.16)'; ctx.fill(); ctx.strokeStyle='#1d6d9e'; ctx.lineWidth=2; ctx.stroke();
    values.forEach((v,i)=>{
      const a=-Math.PI/2+i*2*Math.PI/values.length; const r=radius*v/100;
      ctx.beginPath(); ctx.arc(cx+Math.cos(a)*r,cy+Math.sin(a)*r,4,0,Math.PI*2); ctx.fillStyle='#1d6d9e'; ctx.fill();
    });
  }
})();
