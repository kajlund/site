import {
  LitElement,
  html,
  css,
} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class AlertToast extends LitElement {
  static properties = {
    message: { type: String },
    type: { type: String }, // 'success', 'error', 'info', 'warn'
    open: { type: Boolean, reflect: true },
  };

  static styles = css`
    :host {
      position: fixed;
      top: 2rem;
      right: 2rem;
      z-index: 9999;
      pointer-events: none;
      /* Ensure the host itself doesn't cause scrollbars */
      overflow: visible;
    }
    .toast {
      padding: 1.2rem 2.4rem;
      border-radius: 0.8rem;
      color: white;
      font-weight: 600;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);

      /* The Fix: Start hidden and shifted */
      opacity: 0;
      visibility: hidden;
      transform: translateX(100%);

      transition:
        transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275),
        opacity 0.3s ease,
        visibility 0.3s;

      pointer-events: auto;
      display: flex;
      align-items: center;
      gap: 1rem;
      border-left: 5px solid rgba(0, 0, 0, 0.2);
    }

    /* When open, bring it back and make it visible */
    :host([open]) .toast {
      opacity: 1;
      visibility: visible;
      transform: translateX(0);
    }

    .success {
      background: #10b981;
    }
    .error {
      background: #ef4444;
    }
    .warn {
      background: #f59e0b;
    }
    .info {
      background: var(--color-primary);
    }
  `;

  updated(changedProperties) {
    if (changedProperties.has('open') && this.open) {
      setTimeout(() => (this.open = false), 5000);
    }
  }

  show(message, type = 'info') {
    this.open = false; // Reset in case it's already open
    // Tiny delay to allow the "close" to register before "re-opening"
    // if you want the animation to re-run
    setTimeout(() => {
      this.message = message;
      this.type = type;
      this.open = true;
    }, 50);
  }

  render() {
    return html`
      <div class="toast ${this.type}">
        <span class="msg">${this.message}</span>
      </div>
    `;
  }
}
customElements.define('alert-toast', AlertToast);
