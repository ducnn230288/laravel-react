import queryString from 'query-string';

import { message } from '@/index';
import type { IResponses } from '@/types';
import { KEY_REFRESH_TOKEN, KEY_TOKEN, LINK_API, routerLinks } from '@/utils';

export const API = {
  init: () =>
    ({
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: localStorage.getItem(KEY_TOKEN) ? 'Bearer ' + localStorage.getItem(KEY_TOKEN) : '',
        'Accept-Language': localStorage.getItem('i18nextLng') ?? '',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    }) as RequestInit,
  responsible: async <T>({
    url,
    params = {},
    config,
    headers = {},
    throwError = false,
    showMessage = false,
  }: {
    url: string;
    params?: any;
    config: RequestInit;
    headers?: RequestInit['headers'];
    throwError?: boolean;
    showMessage?: boolean;
  }) => {
    config.headers = { ...config.headers, ...headers };

    if (params.extend) {
      // params.extend = params.extend.map(item => queryString.stringify(item));
      console.log(params.extend);
    }
    const linkParam = queryString.stringify(params, { arrayFormat: 'index' });
    const response = await fetch(
      (url.includes('https://') || url.includes('http://') ? '' : LINK_API) + url + (linkParam && '?' + linkParam),
      config,
    );
    const res: IResponses<T> = await response.json();
    if (response.ok) {
      if (showMessage && res.message) message.success(res.message);
      return res;
    }
    if (
      response.status === 401 &&
      url !== `${routerLinks('Auth', 'api')}/refresh-token` &&
      url !== `${routerLinks('Auth', 'api')}/login` &&
      url !== `${routerLinks('Auth', 'api')}/logout`
    ) {
      const token = await API.refresh();
      if (token) {
        config.headers = { ...config.headers, authorization: token };
        const response = await fetch(LINK_API + url + (linkParam && '?' + linkParam), config);
        return (await response.json()) as IResponses<T>;
      }
    } else if (res.message) {
      if (!throwError) message.error(res.message);
      else throw new Error(res.message);
    }

    if (response.status === 401 && url !== `${routerLinks('Auth', 'api')}/login`) {
      localStorage.removeItem(KEY_TOKEN);
      location.reload();
    }
    throw new Error('Error');
  },
  get: <T>({
    url,
    params = {},
    headers,
    throwError = false,
    showMessage = false,
  }: {
    url: string;
    params?: any;
    headers?: RequestInit['headers'];
    throwError?: boolean;
    showMessage?: boolean;
  }) => API.responsible<T>({ url, params, config: { ...API.init(), method: 'GET' }, headers, throwError, showMessage }),
  post: <T>({
    url,
    values = {},
    params = {},
    headers,
    throwError = false,
    showMessage = true,
  }: {
    url: string;
    values: any;
    params?: any;
    headers?: RequestInit['headers'];
    throwError?: boolean;
    showMessage?: boolean;
  }) =>
    API.responsible<T>({
      url,
      params,
      config: { ...API.init(), method: 'POST', body: JSON.stringify(values) },
      headers,
      throwError,
      showMessage,
    }),
  put: <T>({
    url,
    values = {},
    params = {},
    headers,
    throwError = false,
    showMessage = true,
  }: {
    url: string;
    values: any;
    params?: any;
    headers?: RequestInit['headers'];
    throwError?: boolean;
    showMessage?: boolean;
  }) =>
    API.responsible<T>({
      url,
      params,
      config: { ...API.init(), method: 'PUT', body: JSON.stringify(values) },
      headers,
      throwError,
      showMessage,
    }),
  delete: <T>({
    url,
    params = {},
    headers,
    throwError = false,
    showMessage = true,
  }: {
    url: string;
    params?: any;
    headers?: RequestInit['headers'];
    throwError?: boolean;
    showMessage?: boolean;
  }) =>
    API.responsible<T>({ url, params, config: { ...API.init(), method: 'DELETE' }, headers, throwError, showMessage }),
  refresh: async () => {
    const res = await API.get<{ token: string; refreshToken: null }>({
      url: `${routerLinks('Auth', 'api')}/refresh-token`,
      headers: { authorization: 'Bearer ' + localStorage.getItem(KEY_REFRESH_TOKEN) },
    });
    if (res) {
      localStorage.setItem(KEY_TOKEN, res.data!.token);
      return 'Bearer ' + res.data!.token;
    }
  },
};
