import {
  LitElement,
  html,
  css,
} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class QuoteIsland extends LitElement {
  static properties = {
    title: { type: String },
    content: { type: String },
    description: { type: String },
    author: { type: String },
    fading: { type: Boolean },
  };

  static styles = css`
    :host {
      display: block;
      text-align: center;
      padding: 2rem 1rem;
      min-height: 200px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .quote-wrap {
      transition:
        opacity 0.6s ease-in-out,
        transform 0.6s ease-out;
      opacity: 1;
      transform: translateY(0);
      width: 100%;
    }
    .fading {
      opacity: 0;
      transform: translateY(10px);
    }
    .content {
      font-size: clamp(1.2rem, 5vw, 2rem);
      font-style: italic;
      line-height: 1.2;
      color: var(--color-text-muted);
      color: white;
      margin: 0 auto 1rem auto;
      max-width: 60rem;
    }
    .author {
      color: var(--color-primary);
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
  `;

  firstUpdated() {
    // Refresh every 15 seconds
    setInterval(() => this.fetchNewQuote(), 15000);
  }

  async fetchNewQuote() {
    this.fading = true;

    setTimeout(async () => {
      try {
        const res = await fetch('/api/quotes/random');
        const data = await res.json();
        this.title = data.title;
        this.content = data.content;
        this.description = data.content;
        this.author = data.author;
      } catch (e) {
        console.error('Refresh failed', e);
      }
      this.fading = false;
    }, 600);
  }

  render() {
    return html`
      <div class="quote-wrap ${this.fading ? 'fading' : ''}">
        <div class="content">
          "${this.content || html`<slot name="content"></slot>`}"
        </div>
        <div class="author">
          — ${this.author || html`<slot name="author"></slot>`}
        </div>
      </div>
    `;
  }
}
customElements.define('quote-island', QuoteIsland);
