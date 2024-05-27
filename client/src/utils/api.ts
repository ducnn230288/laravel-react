import queryString from 'query-string';
import { notification } from 'antd';

import { keyRefreshToken, keyToken, linkApi, routerLinks } from '@/utils/index';
import { IResponses } from '@/interfaces';

export const API = {
  init: () =>
    ({
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: localStorage.getItem(keyToken) ? 'Bearer ' + localStorage.getItem(keyToken) : '',
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

    const linkParam = queryString.stringify(params, { arrayFormat: 'index' });
    const response = await fetch(
      (url.includes('https://') || url.includes('http://') ? '' : linkApi) + url + (linkParam && '?' + linkParam),
      config,
    );
    const res: IResponses<T> = await response.json();
    if (response.ok) {
      if (showMessage && res.message) notification.success({ message: res.message });
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
        const response = await fetch(linkApi + url + (linkParam && '?' + linkParam), config);
        return (await response.json()) as IResponses<T>;
      }
    } else if (res.message) {
      if (!throwError) notification.error({ message: res.message });
      else throw new Error(res.message);
    }

    if (response.status === 401 && url !== `${routerLinks('Auth', 'api')}/login`) {
      localStorage.removeItem(keyToken);
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
      headers: { authorization: 'Bearer ' + localStorage.getItem(keyRefreshToken) },
    });
    if (res) {
      localStorage.setItem(keyToken, res.data!.token);
      return 'Bearer ' + res.data!.token;
    }
  },
};
