import {LitElement, css, html} from 'lit';
import {customElement} from 'lit/decorators.js';

@customElement('hs-logo')
export class Logo extends LitElement {
  static styles = css`
    :host {
      contain: content;
    }
    .shelf {
      box-sizing: border-box;
      width: 60px;
      height: 60px;
      border: 6px solid #39536d;
      border-top-style: dashed;
      cursor: pointer;
    }
    .plate {
      height: 8px;
    }
    .plate.p1 {
      background-color: #d5d9de;
    }
    .plate.p2 {
      background-color: #a2adb8;
    }
    .plate.p3 {
      background-color: #778899;
    }
  `;

  colors_ = ['red', 'green', 'blue', 'gray'];

  bc_: BroadcastChannel;

  constructor() {
    super();
    this.bc_ = new BroadcastChannel('central');
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.bc_.close();
  }

  getColor_(): string {
    return this.colors_[Math.floor(Math.random() * this.colors_.length)];
  }

  render() {
    return html`
      <div class="shelf" @click="${this.onClick_}">
        <div class="plate ph"></div>
        <div class="plate ph"></div>
        <div class="plate ph"></div>
        <div class="plate p1"></div>
        <div class="plate p2"></div>
        <div class="plate p3"></div>
      </div>
    `;
  }

  onClick_(): void {
    const code = this.getColor_();
    this.bc_.postMessage({
      'logo:clicked': {color: code}
    });
  }
}
