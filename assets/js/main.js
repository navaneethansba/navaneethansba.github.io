(() => {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open'); navToggle.setAttribute('aria-expanded','false');
    }));
  }

  const year = document.getElementById('year'); if (year) year.textContent = new Date().getFullYear();

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  let countersStarted = false;
  const impact = document.getElementById('impact');
  const countObserver = new IntersectionObserver((entries) => {
    if (!countersStarted && entries.some(e => e.isIntersecting)) {
      countersStarted = true; document.querySelectorAll('.stat-value').forEach(animateCounter); countObserver.disconnect();
    }
  }, { threshold: 0.2 });
  if (impact) countObserver.observe(impact);

  function animateCounter(el) {
    const target = parseFloat(el.dataset.count || '0'); const decimals = parseInt(el.dataset.decimals || '0', 10);
    const prefix = el.dataset.prefix || ''; const suffix = el.dataset.suffix || ''; const format = el.dataset.format || '';
    const duration = 1100; const start = performance.now();
    function frame(now) {
      const p = Math.min((now - start) / duration, 1); const eased = 1 - Math.pow(1 - p, 3); let value = target * eased;
      let output = decimals ? value.toFixed(decimals) : Math.round(value).toString(); if (format === 'comma' && !decimals) output = Number(output).toLocaleString('en-US');
      el.textContent = `${prefix}${output}${suffix}`; if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const sections = [...document.querySelectorAll('main section[id]')]; const links = [...document.querySelectorAll('.site-nav a')];
  const activeObserver = new IntersectionObserver(entries => {
    const visible = entries.filter(e => e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if (!visible) return; links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${visible.target.id}`));
  }, {rootMargin:'-25% 0px -60% 0px', threshold:[0,.2,.5]});
  sections.forEach(s => activeObserver.observe(s));

  const bar = document.querySelector('.progress-bar span');
  window.addEventListener('scroll', () => { const max = document.documentElement.scrollHeight - window.innerHeight; if (bar) bar.style.width = `${max ? (window.scrollY/max)*100 : 0}%`; }, {passive:true});

  drawRadar(); window.addEventListener('resize', debounce(drawRadar, 180));
  function debounce(fn, delay) { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); }; }
  function drawRadar() {
    const canvas = document.getElementById('leadershipRadar'); if (!canvas) return; const rect = canvas.getBoundingClientRect(); const dpr = window.devicePixelRatio || 1;
    const size = Math.max(300, Math.min(520, rect.width || 520)); canvas.width = size*dpr; canvas.height = size*dpr; const ctx = canvas.getContext('2d'); ctx.scale(dpr,dpr);
    const labels=['EA','GCC','Strategy','Cyber','Cloud','AI','M&A','Global Ops']; const values=[95,98,96,92,96,90,97,97]; const cx=size/2,cy=size/2,radius=size*.34; ctx.clearRect(0,0,size,size); ctx.font=`${Math.max(10,size*.027)}px Segoe UI, Arial`;ctx.textAlign='center';ctx.textBaseline='middle';
    for(let ring=1;ring<=5;ring++){ctx.beginPath();labels.forEach((_,i)=>{const a=-Math.PI/2+i*2*Math.PI/labels.length,r=radius*ring/5,x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.closePath();ctx.strokeStyle='#d8e4eb';ctx.lineWidth=1;ctx.stroke()}
    labels.forEach((lab,i)=>{const a=-Math.PI/2+i*2*Math.PI/labels.length;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*radius,cy+Math.sin(a)*radius);ctx.strokeStyle='#e2ebf0';ctx.stroke();const lr=radius*1.18;ctx.fillStyle='#486377';ctx.fillText(lab,cx+Math.cos(a)*lr,cy+Math.sin(a)*lr)});
    ctx.beginPath();values.forEach((v,i)=>{const a=-Math.PI/2+i*2*Math.PI/values.length,r=radius*v/100,x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.closePath();ctx.fillStyle='rgba(27,120,173,.16)';ctx.fill();ctx.strokeStyle='#1b78ad';ctx.lineWidth=2;ctx.stroke();values.forEach((v,i)=>{const a=-Math.PI/2+i*2*Math.PI/values.length,r=radius*v/100;ctx.beginPath();ctx.arc(cx+Math.cos(a)*r,cy+Math.sin(a)*r,4,0,Math.PI*2);ctx.fillStyle='#1b78ad';ctx.fill()});
  }



  // Voice narration: section links scroll and narrate concise executive summaries.
  const voiceToggle = document.getElementById('voiceToggle');
  const voiceStop = document.getElementById('voiceStop');
  const speechSupported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  let narrationEnabled = speechSupported;
  let activeNarrationId = null;
  let preferredVoice = null;

  const narration = {
    impact: `Career impact at a glance. Dr. Navaneethan Srinivasan brings more than twenty-five years of technology leadership. His experience includes one hundred million dollars in I T P and L responsibility, more than five point five billion dollars in merger and acquisition integration, a twenty-two million dollar hyperscale data center, support for a ten-thousand-employee technology ecosystem, more than twenty-five global centers of excellence, and building global I T teams of more than one thousand people.`,
    about: `Dr. Navaneethan Srinivasan is a senior technology executive whose work spans enterprise infrastructure, cloud, E R P, cybersecurity, artificial intelligence, global service delivery, and enterprise architecture. As Qualcomm India's founding I T employee, he helped scale the technology ecosystem from a single-person setup to support a ten-thousand-employee, five-city research and engineering enterprise. His current interests include mission-critical technology, artificial intelligence, computer vision, quantum readiness, post-quantum cryptography, and board governance.`,
    transformations: `Signature transformations. At Qualcomm India, Dr. Srinivasan built enterprise technology capabilities from the ground up and supported growth from one to ten thousand employees. He led technology integration for Spike, Atheros, and C S R, representing more than five point five billion dollars in combined acquisition value. At DecisionOne, he led digital delivery across three continents. As co-founder and C T O of PropVision, he helped build a cloud-native platform and raise five million dollars in Series A funding.`,
    capabilities: `Executive technology capabilities span strategy and enterprise architecture, G C C and global operating models, hybrid and multi-cloud platforms, cybersecurity and zero trust, data and artificial intelligence, enterprise applications, DevSecOps, service management, financial governance, and post-merger integration. The portfolio combines technical depth with operating-model design, P and L accountability, and board-level stakeholder management.`,
    research: `Research and future technology themes include artificial intelligence, machine learning, generative and agentic A I, computer vision, quantum computing readiness, post-quantum cryptography, data governance, intelligent automation, I o T, and edge technologies. The focus is on enterprise readiness, resilience, governance, and responsible adoption of emerging technology.`,
    career: `Career journey. Dr. Srinivasan currently serves as S V P and Chief Information Officer in a venture-backed defence technology start-up. His earlier roles include strategic technology and management consulting, doctoral research, Vice President of Global Client Management at DecisionOne, co-founder and Chief Technology Officer of PropVision, Director of I T and founding I T leader at Qualcomm India, and senior I T leadership at Samtech Infonet.`,
    board: `Board and advisory. As a Certified Independent Director, Dr. Srinivasan brings technology governance and executive advisory experience across cyber risk, digital transformation, artificial intelligence governance, technology investment, G C C strategy, merger and acquisition technology due diligence, and quantum readiness. His perspective connects enterprise technology decisions with risk, resilience, business value, and long-term governance.`,
    contact: `Thank you for visiting the executive technology portfolio of Dr. Navaneethan Srinivasan. He is open to conversations around C I O, C D I O, and C T O leadership, G C C transformation, enterprise architecture, board advisory, merger and acquisition integration, cybersecurity, artificial intelligence, and emerging technology strategy. Contact links for email, LinkedIn, and the résumé are available in this section.`
  };

  function refreshVoices() {
    if (!speechSupported) return;
    const voices = window.speechSynthesis.getVoices();
    preferredVoice = voices.find(v => /en-IN/i.test(v.lang)) || voices.find(v => /^en-GB/i.test(v.lang)) || voices.find(v => /^en-US/i.test(v.lang)) || voices.find(v => /^en/i.test(v.lang)) || voices[0] || null;
  }
  if (speechSupported) {
    refreshVoices();
    window.speechSynthesis.addEventListener?.('voiceschanged', refreshVoices);
  }

  const status = document.createElement('div');
  status.className = 'voice-status'; status.setAttribute('role','status'); status.setAttribute('aria-live','polite');
  document.body.appendChild(status);
  let statusTimer;
  function showVoiceStatus(text) { status.textContent=text; status.classList.add('show'); clearTimeout(statusTimer); statusTimer=setTimeout(()=>status.classList.remove('show'),2600); }

  function updateVoiceUI() {
    if (!voiceToggle) return;
    voiceToggle.setAttribute('aria-pressed', String(narrationEnabled));
    const label = voiceToggle.querySelector('.voice-label'); if (label) label.textContent = narrationEnabled ? 'Voice On' : 'Voice Off';
    voiceToggle.title = narrationEnabled ? 'Turn voice narration off' : 'Turn voice narration on';
    if (!speechSupported) { voiceToggle.disabled = true; voiceToggle.title='Voice narration is not supported by this browser'; if (label) label.textContent='Voice unavailable'; }
  }
  updateVoiceUI();

  function stopNarration(silent=false) {
    if (speechSupported) window.speechSynthesis.cancel();
    activeNarrationId = null;
    document.querySelectorAll('.listen-section').forEach(b => b.classList.remove('speaking'));
    if (voiceStop) voiceStop.disabled = true;
    if (!silent) showVoiceStatus('Narration stopped');
  }

  function speakSection(id) {
    const text = narration[id];
    if (!text || !speechSupported || !narrationEnabled) return;
    stopNarration(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = preferredVoice?.lang || 'en-IN';
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.rate = 0.94; utterance.pitch = 1; utterance.volume = 1;
    activeNarrationId = id;
    const localButton = document.querySelector(`.listen-section[data-narrate="${id}"]`);
    if (localButton) localButton.classList.add('speaking');
    if (voiceStop) voiceStop.disabled = false;
    utterance.onstart = () => showVoiceStatus(`Narrating: ${document.getElementById(id)?.querySelector('h2')?.textContent || id}`);
    utterance.onend = utterance.onerror = () => { if (activeNarrationId===id) { activeNarrationId=null; if (voiceStop) voiceStop.disabled=true; if (localButton) localButton.classList.remove('speaking'); } };
    window.speechSynthesis.speak(utterance);
  }

  voiceToggle?.addEventListener('click', () => {
    narrationEnabled = !narrationEnabled;
    if (!narrationEnabled) stopNarration(true);
    updateVoiceUI(); showVoiceStatus(narrationEnabled ? 'Voice narration on' : 'Voice narration off');
  });
  voiceStop?.addEventListener('click', () => stopNarration());

  // Primary navigation and internal call-to-action links narrate after the user clicks.
  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => {
    const id = link.getAttribute('href').slice(1);
    if (narration[id] && narrationEnabled) setTimeout(() => speakSection(id), 420);
  }));

  // Add a compact Listen button to every narrated section, so narration can be replayed without navigating away.
  Object.keys(narration).forEach(id => {
    const section = document.getElementById(id); if (!section) return;
    const heading = section.querySelector('.section-heading') || section.querySelector('.impact-head'); if (!heading) return;
    const button = document.createElement('button'); button.type='button'; button.className='listen-section'; button.dataset.narrate=id; button.textContent='Listen to this section';
    button.addEventListener('click', () => { activeNarrationId===id ? stopNarration() : speakSection(id); });
    heading.appendChild(button);
  });

  // Stop narration when the page is hidden or when an embedded executive video starts playing.
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopNarration(true); });
  document.getElementById('executiveVideo')?.addEventListener('play', () => stopNarration(true));


  // The introduction section remains invisible until the optional MP4 exists.
  fetch('assets/video/executive-introduction.mp4', { method: 'HEAD', cache: 'no-store' }).then(r => {
    if (r.ok) { const section = document.getElementById('intro-video'); if (section) section.hidden = false; }
  }).catch(() => {});
})();
