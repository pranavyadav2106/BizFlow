// BizFlow Router — loads page fragments into #content
function loadPage(page) {
  const content = document.getElementById('content');

  document.querySelectorAll('#nav li').forEach(li => {
    li.classList.toggle('active', li.dataset.page === page);
  });

  content.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
  content.style.opacity = '0';
  content.style.transform = 'translateY(6px)';

  fetch(`pages/${page}.html`)
    .then(r => { if (!r.ok) throw new Error('Not found'); return r.text(); })
    .then(html => {
      setTimeout(() => {
        content.innerHTML = html;
        // Execute any inline scripts in the loaded HTML
        content.querySelectorAll('script').forEach(oldScript => {
          const newScript = document.createElement('script');
          newScript.textContent = oldScript.textContent;
          oldScript.parentNode.replaceChild(newScript, oldScript);
        });
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
      }, 150);
    })
    .catch(() => {
      setTimeout(() => {
        content.innerHTML = `
          <div class="welcome-screen">
            <div class="welcome-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h1>Page Not Found</h1>
            <p>Could not load the "${page}" module.</p>
          </div>`;
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
      }, 150);
    });
}

window.addEventListener('DOMContentLoaded', () => loadPage('dashboard'));