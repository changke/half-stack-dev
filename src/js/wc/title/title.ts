import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

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

  render() {
    return html`
      <span>${this.text}</span>
    `;
  }
}
