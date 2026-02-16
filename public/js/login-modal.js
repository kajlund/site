import {
  LitElement,
  html,
  css,
} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class LoginModal extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    error: { type: String },
    loading: { type: Boolean },
  };

  static styles = css`
    :host {
      display: contents;
    }

    .overlay {
      position: fixed;
      inset: 0;
      background: var(--color-overlay, rgba(0, 0, 0, 0.6));
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 4000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    :host([open]) .overlay {
      opacity: 1;
      visibility: visible;
    }

    .dialog {
      background: var(--color-background, #20043d);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1.25rem;
      padding: 2.5rem;
      width: 90%;
      max-width: 400px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      transform: translateY(20px);
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    :host([open]) .dialog {
      transform: translateY(0);
    }

    h2 {
      color: white;
      margin: 0 0 1.5rem 0;
      font-size: 2rem;
      text-align: center;
    }

    .form-group {
      margin-bottom: 1.25rem;
    }

    label {
      display: block;
      color: var(--color-text-muted);
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }

    input {
      width: 100%;
      padding: 0.8rem;
      border-radius: 0.5rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      color: white;
      font-size: 1rem;
      outline: none;
    }

    input:focus {
      border-color: var(--color-primary);
      background: rgba(255, 255, 255, 0.08);
    }

    .error-banner {
      background: rgba(220, 38, 38, 0.15);
      color: #ff4d4d;
      padding: 0.75rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      font-size: 0.9rem;
      border: 1px solid rgba(220, 38, 38, 0.3);
    }

    .submit-btn {
      width: 100%;
      padding: 1rem;
      background: var(--color-primary);
      color: white;
      border: none;
      border-radius: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      transition: filter 0.2s;
    }

    .submit-btn:disabled {
      filter: grayscale(1) opacity(0.5);
      cursor: not-allowed;
    }

    .close-x {
      position: absolute;
      top: 1rem;
      right: 1.2rem;
      background: none;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      opacity: 0.5;
    }

    .close-x:hover {
      opacity: 1;
    }
  `;

  async handleLogin(e) {
    e.preventDefault();
    this.loading = true;
    this.error = null;

    const fd = new FormData(e.target);
    const credentials = Object.fromEntries(fd);

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const toast = document.getElementById('globalToast');

      if (!response.ok) {
        const data = await response.json();
        toast.show(data.detail, 'error');

        throw new Error(data.detail || 'Login failed');
      }

      // Success logic
      this.dispatchEvent(new CustomEvent('login-success'));
      this.close();
    } catch (err) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  }

  close() {
    this.open = false;
    this.error = null;
    document.body.style.overflow = '';
  }

  render() {
    return html`
      <div
        class="overlay"
        @click="${(e) =>
          e.target.classList.contains('overlay') && this.close()}"
      >
        <div class="dialog">
          <button class="close-x" @click="${this.close}">&times;</button>
          <h2>Login</h2>

          ${this.error
            ? html`<div class="error-banner">${this.error}</div>`
            : ''}

          <form @submit="${this.handleLogin}">
            <div class="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                required
                ?disabled="${this.loading}"
              />
            </div>
            <div class="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                required
                ?disabled="${this.loading}"
              />
            </div>
            <button
              type="submit"
              class="submit-btn"
              ?disabled="${this.loading}"
            >
              ${this.loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    `;
  }
}
customElements.define('login-modal', LoginModal);
