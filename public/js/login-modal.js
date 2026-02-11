import {
  LitElement,
  html,
  css,
} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class LoginModal extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    error: { type: String },
  };

  static styles = css`
    :host {
      display: contents; /* Ensures the component doesn't break layout */
    }

    .dialog-overlay {
      position: fixed;
      inset: 0;
      background: var(--color-overlay, rgba(0, 0, 0, 0.5));
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 3000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    :host([open]) .dialog-overlay {
      opacity: 1;
      visibility: visible;
    }

    .dialog {
      background: var(--color-background, #20043d);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      padding: 2.5rem;
      width: 90%;
      max-width: 400px;
      position: relative;
      transform: scale(0.9);
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    :host([open]) .dialog {
      transform: scale(1);
    }

    .close-btn {
      position: absolute;
      top: 1rem;
      right: 1.5rem;
      background: none;
      border: none;
      color: var(--color-text-muted);
      font-size: 2rem;
      cursor: pointer;
    }

    .error-msg {
      color: #ff4444;
      font-size: 0.9rem;
      margin-top: 1rem;
    }
  `;

  close() {
    this.open = false;
    this.error = '';
    // Unlock body scroll
    document.body.style.overflow = '';
  }

  handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Simulate API call
    console.log('Logging in with:', data);
    this.error = 'Invalid credentials. Please try again.';
  }

  render() {
    return html`
      <div
        class="dialog-overlay"
        @click="${(e) =>
          e.target.classList.contains('dialog-overlay') && this.close()}"
      >
        <div class="dialog">
          <button class="close-btn" @click="${this.close}">&times;</button>
          <h2 style="color: white; margin-bottom: 1.5rem;">Login</h2>

          <form @submit="${this.handleLogin}" class="login-form">
            <slot name="form-fields"></slot>
            <button
              type="submit"
              class="login-btn"
              style="width: 100%; margin: 1rem 0 0 0;"
            >
              Sign In
            </button>
          </form>

          ${this.error ? html`<div class="error-msg">${this.error}</div>` : ''}
        </div>
      </div>
    `;
  }
}
customElements.define('login-modal', LoginModal);
