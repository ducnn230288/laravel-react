import React, { Suspense, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import i18next from 'i18next';
import i18nextHttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { Provider } from 'react-redux';
import { ConfigProvider, message as noti, Spin } from 'antd';
import { MessageInstance } from 'antd/lib/message/interface';

import { SGlobal, setupStore } from '@/services';
import { reportWebVitals, lang } from '@/utils';

import Router from './router';
import './assets/styles/index.less';

const fallbackLng = localStorage.getItem('i18nextLng');

if (!fallbackLng) {
  localStorage.setItem('i18nextLng', 'en');
  document.querySelector('html')?.setAttribute('lang', 'en');
}
i18next
  .use(i18nextHttpBackend)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    fallbackLng: fallbackLng ?? 'en',
    interpolation: {
      escapeValue: false,
    },
  });
const store = setupStore();
let container: HTMLElement;
export let message: MessageInstance;

const Context = () => {
  const sGlobal = SGlobal();
  const [api, contextHolder] = noti.useMessage({
    duration: 3,
  });

  useEffect(() => {
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i)?.indexOf('temp-') === 0) {
        localStorage.removeItem(localStorage.key(i) ?? '');
      }
    }
    sGlobal.setLanguage(lang);
    message = api;
  }, []);
  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: 13,
          lineHeight: 1.847,
          controlHeight: 38,
          fontFamily:
            'Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" ',
        },
      }}
      locale={sGlobal.locale}
    >
      {contextHolder}
      <Router />
    </ConfigProvider>
  );
};

document.addEventListener(
  'DOMContentLoaded',
  () => {
    if (!container) {
      container = document.getElementById('root') as HTMLElement;
      const root = createRoot(container);
      localStorage.getItem('theme');
      document.querySelector('html')?.setAttribute('data-theme', localStorage.getItem('theme') ?? 'light');

      root.render(
        <Suspense fallback={<Spin size={'large'} className="flex h-screen w-screen items-center justify-center" />}>
          <Provider store={store}>
            <Context />
          </Provider>
        </Suspense>,
      );
    }
  },
  { passive: true },
);
reportWebVitals((e) => console.log(e));
