import {LitElement, css, html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import AjaxP from '../../services/ajaxp';

interface PostArchiveItem {
  title: string;
  path: string;
  createdAt: string;
  updatedAt: string;
}

@customElement('hs-archive')
export class Archive extends LitElement {
  static styles = css`
    :host {
      contain: content;
    }

    ul,
    li {
      margin: 0;
      padding: 0;
    }

    li {
      list-style: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    li time {
      color: darkgray;
    }
  `;

  @property()
  url = '';

  @state()
  loaded_ = false;

  postArchive_: Array<PostArchiveItem>;

  constructor() {
    super();
    this.postArchive_ = [];
  }

  connectedCallback() {
    super.connectedCallback();

    // get the list of posts...
    AjaxP.getJSON<PostArchiveItem[]>(this.url)
      .then(list => {
        this.postArchive_ = list;
        // sort by createdAt DESC
        this.postArchive_.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return (dateB > dateA) ? 1 : -1;
        });
        this.loaded_ = true; // trigger re-render!
      });
  }

  renderItem_(item: PostArchiveItem) {
    const formatDateTime = (dateString: string) => {
      const dt = new Date(dateString);
      return dt.toDateString();
    }
    return html`
      <li>
        <a href="${item.path}">${item.title}</a>
        <time datetime="${item.createdAt}">${formatDateTime(item.createdAt)}</time>
      </li>
    `;
  }

  render() {
    return this.loaded_ ?
      html`<ul>${this.postArchive_.map(a => html`${this.renderItem_(a)}`)}</ul>` :
      html`<span>Loading...</span>`;
  }
}
