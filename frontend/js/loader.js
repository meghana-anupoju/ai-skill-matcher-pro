(function() {
  const parts = [
    { url: 'partials/voice-status.html', target: '#voice-placeholder' },
    { url: 'partials/accessibility.html', target: '#accessibility-placeholder' },
    { url: 'partials/nav.html', target: '#nav-placeholder' },
    { url: 'partials/landing.html', target: '#app' },
    { url: 'partials/upload.html', target: '#app' },
    { url: 'partials/dashboard.html', target: '#app' },
    { url: 'partials/roadmap.html', target: '#app' },
    { url: 'partials/interview.html', target: '#app' },
    { url: 'partials/collaboration.html', target: '#app' },
    { url: 'partials/profile.html', target: '#app' },
    { url: 'partials/loading-overlay.html', target: '#loading-overlay-placeholder' },
    { url: 'partials/notification-container.html', target: '#notification-container-placeholder' }
  ];

  async function loadPart(part) {
    try {
      const res = await fetch(part.url);
      if (!res.ok) throw new Error('Failed to load ' + part.url);
      const html = await res.text();
      const container = document.querySelector(part.target);
      if (container) {
        
        if (part.target === '#app') container.insertAdjacentHTML('beforeend', html);
        else container.innerHTML = html;
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

    async function init() {
    const promises = parts.map(p => loadPart(p));
    const results = await Promise.all(promises);

    const loadingEl = document.getElementById('sections-loading');
    if (loadingEl) loadingEl.remove();

  // Load Chart.js first (from CDN) then the app script
  const chartScript = document.createElement('script');
  chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
  chartScript.onload = () => {
    const script = document.createElement('script');
    script.src = '/app.js';
    script.defer = true;
    document.body.appendChild(script);
  };
  chartScript.onerror = () => {
    console.error('Failed to load Chart.js from CDN. Charts may not render.');
    const script = document.createElement('script');
    script.src = '/app.js';
    script.defer = true;
    document.body.appendChild(script);
  };
  document.head.appendChild(chartScript);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
