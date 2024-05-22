import queryString from "query-string";

import { keyRefreshToken, keyToken, linkApi, routerLinks } from '@/utils';
import { Message } from '@/library/message';
import { IResponses } from '@/interfaces';

export const API = {
  init: () =>
    ({
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        authorization: localStorage.getItem(keyToken) ? 'Bearer ' + localStorage.getItem(keyToken) : '',
        'Accept-Language': localStorage.getItem('i18nextLng') || '',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    }) as RequestInit,
  responsible: async <T>(
    url: string,
    params: { [key: string]: string } = {},
    config: RequestInit,
    headers: RequestInit['headers'] = {},
    throwText: boolean = false,
  ) => {
    config.headers = { ...config.headers, ...headers };

    const linkParam = queryString.stringify(params, {arrayFormat: 'index'});
    const response = await fetch(
      (url.includes('https://') || url.includes('http://') ? '' : linkApi) + url + (linkParam && '?' + linkParam),
      config,
    );
    const res: IResponses<T> = await response.json();
    if (response.ok) return res;
    if (
      response.status === 401 &&
      url !== `${routerLinks('Auth', 'api')}/refresh-token` &&
      url !== `${routerLinks('Auth', 'api')}/login` &&
      url !== `${routerLinks('Auth', 'api')}/logout`
    ) {
      const token = await API.refresh();
      if (token) {
        config.headers = { ...config.headers, authorization: token };
        const response = await fetch(linkApi + url + (linkParam && '?' + linkParam), config);
        return (await response.json()) as IResponses<T>;
      }
    } else if (res.message) {
      if (!throwText) await Message.error({ text: res.message });
      else throw new Error(res.message);
    }

    if (response.status === 401 && url !== `${routerLinks('Auth', 'api')}/login`) {
      localStorage.removeItem(keyToken);
      location.reload();
    }
    throw {};
  },
  get: <T>(url: string, params = {}, headers?: RequestInit['headers'], throwText: boolean = false) =>
    API.responsible<T>(url, params, { ...API.init(), method: 'GET' }, headers, throwText),
  post: <T>(url: string, data = {}, params = {}, headers?: RequestInit['headers'], throwText: boolean = false) =>
    API.responsible<T>(url, params, { ...API.init(), method: 'POST', body: JSON.stringify(data) }, headers, throwText),
  put: <T>(url: string, data = {}, params = {}, headers?: RequestInit['headers'], throwText: boolean = false) =>
    API.responsible<T>(url, params, { ...API.init(), method: 'PUT', body: JSON.stringify(data) }, headers, throwText),
  delete: <T>(url: string, params = {}, headers?: RequestInit['headers'], throwText: boolean = false) =>
    API.responsible<T>(url, params, { ...API.init(), method: 'DELETE' }, headers, throwText),
  refresh: async () => {
    const res = await API.get<{ token: string; refreshToken: null }>(
      `${routerLinks('Auth', 'api')}/refresh-token`,
      {},
      { authorization: 'Bearer ' + localStorage.getItem(keyRefreshToken) },
    );
    if (res) {
      localStorage.setItem(keyToken, res.data!.token);
      return 'Bearer ' + res.data!.token;
    }
  },
};
