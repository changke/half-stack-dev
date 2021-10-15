interface ResponseError extends Error {
  response?: Response;
}

/**
 * Ajax helper (use Promise instead of callbacks)
 * with help from: https://eckertalex.dev/blog/typescript-fetch-wrapper
 */
class AjaxP {
  ajax_<T>(url: string, opts: RequestInit, handleResponseJson = true): Promise<T> {
    const defaultInit = {
      'Content-Type': 'application/json; charset=utf-8'
    };

    const init: RequestInit = {
      method: opts.method || 'GET',
      mode: 'cors',
      credentials: 'same-origin',
      headers: Object.assign(defaultInit, opts.headers)
    };

    if (opts.body) {
      init.body = opts.body;
    }

    const checkStatus = (response: Response) => {
      if (response.ok) {
        return response;
      } else {
        const error: ResponseError = new Error(response.statusText);
        error.response = response;
        throw error;
      }
    };

    const parseJSON = (res: Response) => {
      if (handleResponseJson) {
        return res.json().catch(() => ({}));
      } else {
        return res.text();
      }
    };

    return fetch(url, init).then(checkStatus).then(parseJSON);
  }

  toQueryString(obj?: Record<string, string>): string {
    if (!obj) {
      return '';
    }
    const arr = [];
    for (const p in obj) {
      arr.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`);
    }
    return arr.join('&');
  }

  buildFullUrl_(url: string, data?: Record<string, string>): string {
    const hasQS = (url.indexOf('?') >= 0);
    const hasData = data && Object.keys(data).length > 0;
    const qs = hasData ? ((hasQS ? '&' : '?') + this.toQueryString(data)) : '';
    return `${url}${qs}`;
  }

  getJSON<T>(url: string, data?: Record<string, string>, opts?: RequestInit): Promise<T> {
    // check for existing querystring
    const fullUrl = this.buildFullUrl_(url, data);
    return this.ajax_<T>(fullUrl, opts || {});
  }

  postJSON<T, U>(url: string, data: T, additionalHeaders: Record<string, string>): Promise<U> {
    const opts: RequestInit = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: additionalHeaders
    };
    return this.ajax_<U>(url, opts);
  }

  putJSON<T, U>(url: string, data: T, additionalHeaders: Record<string, string>): Promise<U> {
    const opts: RequestInit = {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: additionalHeaders
    };
    return this.ajax_<U>(url, opts);
  }

  deleteRequest<T>(url: string, additionalHeaders: Record<string, string>): Promise<T> {
    const opts: RequestInit = {
      method: 'DELETE',
      headers: additionalHeaders
    };
    return this.ajax_<T>(url, opts, false);
  }
}

const ajaxp = new AjaxP();

export default ajaxp;
