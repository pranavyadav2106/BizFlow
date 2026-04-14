// ─── Modal System ─────────────────────────────────────────────────────────────
// Shared modal used by all pages. Call Modal.open(title, bodyHTML, onSubmit)

const Modal = {
  _el: null,

  init() {
    if (document.getElementById('biz-modal')) return;
    const el = document.createElement('div');
    el.id = 'biz-modal';
    el.innerHTML = `
      <div id="biz-modal-backdrop"></div>
      <div id="biz-modal-box">
        <div id="biz-modal-header">
          <span id="biz-modal-title"></span>
          <button id="biz-modal-close" onclick="Modal.close()">✕</button>
        </div>
        <div id="biz-modal-body"></div>
      </div>
    `;
    document.body.appendChild(el);
    document.getElementById('biz-modal-backdrop').onclick = () => Modal.close();
    this._el = el;

    const style = document.createElement('style');
    style.textContent = `
      #biz-modal { position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center; }
      #biz-modal.open { display:flex; }
      #biz-modal-backdrop { position:fixed;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(2px); }
      #biz-modal-box {
        position:relative;z-index:1;background:#161a21;border:1px solid rgba(255,255,255,0.1);
        border-radius:16px;width:90%;max-width:560px;max-height:88vh;overflow-y:auto;
        box-shadow:0 20px 60px rgba(0,0,0,0.6);animation:modalIn .18s ease;
      }
      @keyframes modalIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      #biz-modal-header {
        display:flex;align-items:center;justify-content:space-between;
        padding:20px 24px 16px;border-bottom:1px solid rgba(255,255,255,0.06);
      }
      #biz-modal-title { font-family:'Syne',sans-serif;font-size:18px;font-weight:700;color:#e8eaf0; }
      #biz-modal-close {
        background:rgba(255,255,255,0.06);border:none;color:#8b90a0;width:30px;height:30px;
        border-radius:6px;cursor:pointer;font-size:14px;transition:all .15s;
      }
      #biz-modal-close:hover { background:rgba(255,255,255,0.12);color:#e8eaf0; }
      #biz-modal-body { padding:24px; }

      /* Form styles inside modal */
      .form-group { margin-bottom:18px; }
      .form-group label {
        display:block;font-size:12px;font-weight:600;color:#545970;
        text-transform:uppercase;letter-spacing:1px;margin-bottom:7px;
      }
      .form-group input, .form-group select, .form-group textarea {
        width:100%;padding:10px 13px;background:#1c2130;border:1px solid rgba(255,255,255,0.09);
        border-radius:8px;color:#e8eaf0;font-family:'Outfit',sans-serif;font-size:14px;outline:none;
        transition:border-color .15s,box-shadow .15s;
      }
      .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
        border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,0.15);
      }
      .form-group select option { background:#1c2130; }
      .form-group textarea { resize:vertical;min-height:72px; }
      .form-row { display:grid;grid-template-columns:1fr 1fr;gap:14px; }
      .form-actions { display:flex;justify-content:flex-end;gap:10px;margin-top:24px;padding-top:18px;border-top:1px solid rgba(255,255,255,0.06); }
      .btn-cancel {
        padding:9px 18px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.09);
        border-radius:6px;color:#8b90a0;font-family:'Outfit',sans-serif;font-size:14px;cursor:pointer;transition:all .15s;
      }
      .btn-cancel:hover { background:rgba(255,255,255,0.1);color:#e8eaf0; }
      .btn-save {
        padding:9px 22px;background:#3b82f6;border:none;border-radius:6px;color:#0b0d10;
        font-family:'Outfit',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all .15s;
      }
      .btn-save:hover { background:#2563eb;box-shadow:0 4px 14px rgba(59,130,246,0.35); }
      .btn-danger {
        padding:9px 18px;background:rgba(248,113,113,0.12);border:1px solid rgba(248,113,113,0.2);
        border-radius:6px;color:#f87171;font-family:'Outfit',sans-serif;font-size:14px;cursor:pointer;transition:all .15s;
      }
      .btn-danger:hover { background:rgba(248,113,113,0.2); }

      /* Order item rows */
      .order-items-list { margin-bottom:12px; }
      .order-item-row {
        display:grid;grid-template-columns:1fr 90px 80px 28px;gap:8px;
        align-items:center;margin-bottom:8px;
      }
      .order-item-row select, .order-item-row input { padding:8px 10px;font-size:13px; }
      .remove-item-btn {
        background:rgba(248,113,113,0.12);border:1px solid rgba(248,113,113,0.2);
        border-radius:6px;color:#f87171;cursor:pointer;font-size:16px;width:28px;height:34px;
        display:flex;align-items:center;justify-content:center;transition:all .15s;
      }
      .remove-item-btn:hover { background:rgba(248,113,113,0.22); }
      .add-item-btn {
        background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.2);
        border-radius:6px;color:#3b82f6;cursor:pointer;font-size:13px;font-weight:500;
        padding:7px 14px;font-family:'Outfit',sans-serif;transition:all .15s;
      }
      .add-item-btn:hover { background:rgba(59,130,246,0.18); }
      .order-total-preview {
        background:#1c2130;border-radius:8px;padding:12px 16px;margin-top:12px;
        display:flex;justify-content:space-between;align-items:center;
      }
      .order-total-preview span { font-size:13px;color:#545970; }
      .order-total-preview strong { font-family:'Syne',sans-serif;font-size:20px;font-weight:700;color:#3b82f6; }

      /* Confirm dialog */
      .confirm-msg { font-size:15px;color:#8b90a0;line-height:1.6;margin-bottom:4px; }
      .confirm-name { color:#e8eaf0;font-weight:600; }

      /* Toast */
      #biz-toast {
        position:fixed;bottom:28px;right:28px;z-index:2000;
        background:#1c2130;border:1px solid rgba(59,130,246,0.3);border-radius:10px;
        padding:12px 20px;color:#e8eaf0;font-family:'Outfit',sans-serif;font-size:14px;
        box-shadow:0 8px 30px rgba(0,0,0,0.4);
        opacity:0;transform:translateY(8px);transition:all .2s;pointer-events:none;
      }
      #biz-toast.show { opacity:1;transform:translateY(0); }
      #biz-toast.success { border-color:rgba(52,211,153,0.3); }
      #biz-toast.error { border-color:rgba(248,113,113,0.3); }
    `;
    document.head.appendChild(style);

    // Toast element
    const toast = document.createElement('div');
    toast.id = 'biz-toast';
    document.body.appendChild(toast);
  },

  open(title, bodyHTML) {
    this.init();
    document.getElementById('biz-modal-title').textContent = title;
    document.getElementById('biz-modal-body').innerHTML = bodyHTML;
    document.getElementById('biz-modal').classList.add('open');
  },

  close() {
    const el = document.getElementById('biz-modal');
    if (el) el.classList.remove('open');
  },

  toast(msg, type = 'success') {
    this.init();
    const t = document.getElementById('biz-toast');
    t.textContent = (type === 'success' ? '✓  ' : '✕  ') + msg;
    t.className = 'show ' + type;
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => { t.className = ''; }, 3000);
  }
};