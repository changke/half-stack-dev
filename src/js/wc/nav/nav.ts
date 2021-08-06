import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

interface NavItemLink {
  title: string;
  href: string;
}

@customElement('hs-nav')
export class Nav extends LitElement {
  static styles = css`
    :host {
      contain: content;
    }
    ul,
    li {
      margin: 0;
      padding: 0;
    }
    ul {
      display: flex;
      gap: 20px;
    }
    li {
      list-style: none;
    }
    li a {
      display: block;
    }
    li a.current {
      font-weight: bold;
      text-decoration: none;
    }
  `;

  @property()
  current = '';

  items: Array<NavItemLink>;

  constructor() {
    super();
    this.items = [
      {title: 'Home', href: '/'},
      {title: 'About', href: '/pages/about/'}
    ];
  }

  class_(title: string): string {
    return this.current.toLowerCase() === title.toLowerCase() ? 'current' : '';
  }

  render() {
    return html`
      <ul>${this.items.map(item => html`<li><a class="${this.class_(item.title)}" href="${item.href}">${item.title}</a></li>`)}</ul>
    `;
  }
}
