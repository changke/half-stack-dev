import {LitElement, css, html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';

@customElement('hs-title')
export class Title extends LitElement {
  static styles = css`
    :host {
      contain: content;
    }

    span {
      font-weight: bold;
      font-size: 16px;
      color: #a78451;
      display: inline-block;
    }
  `;

  @property()
  text = '';

  @state()
  color_ = '#a78451';

  bc_: BroadcastChannel;

  constructor() {
    super();
    this.bc_ = new BroadcastChannel('central');
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.bc_.onmessage = ev => {
      const lc = ev.data['logo:clicked'];
      if (lc) {
        console.log(lc);
        this.color_ = lc['colorCode'];
      }
    };
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.bc_.close();
  }

  render() {
    return html`
      <span style="color:${this.color_};">${this.text}</span>
    `;
  }
}
