import React, { PropsWithChildren } from 'react';
import { Dropdown, Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import classNames from 'classnames';

import { Avatar } from '@/library/avatar';
import { SGlobal } from '@/services';
import { Key, Out, User, Logo, DayNight } from '@/assets/svg';
import { routerLinks, lang, APP_NAME } from '@/utils';
import menus, { findMenu } from './menus';
import { createSearchParams } from 'react-router-dom';

const Layout = ({ children }: PropsWithChildren) => {
  const { t } = useTranslation('locale', { keyPrefix: 'layouts' });
  const sGlobal = SGlobal();

  return (
    <main className="flex">
      <aside
        className={classNames(
          'h-screen flex-none bg-base-100/50 border-r border-base-300 overflow-hidden duration-300 ease-in-out transition-all',
          {
            'w-56': !sGlobal.isCollapseMenu,
            'w-12': sGlobal.isCollapseMenu,
          },
        )}
      >
        <a
          href="/vn/dashboard"
          className={classNames('flex items-center justify-center p-2', {
            'gap-3': !sGlobal.isCollapseMenu,
          })}
        >
          <Logo className={'h-8 text-primary'} />
          <h1
            className={classNames('text-primary', {
              'text-[0px] duration-300': sGlobal.isCollapseMenu,
              'text-xl duration-500': !sGlobal.isCollapseMenu,
            })}
          >
            {APP_NAME}
          </h1>
        </a>
        <CMenu />
      </aside>

      <section className={'grow bg-base-300/50 px-2 sm:px-0'}>
        <CHeader />
        <div className={'h-[calc(100vh-6rem)] overflow-auto'}>{children}</div>

        <footer className="w-full pt-1.5 text-center">{t('Footer', { year: new Date().getFullYear() })}</footer>
      </section>
    </main>
  );
};

const CMenu = () => {
  const sGlobal = SGlobal();
  const location = useLocation();
  const navigate = useNavigate();
  const listMenu = menus({ lang: sGlobal.language, permissions: sGlobal.user?.role?.permissions });

  return (
    <Menu
      className="main-menu"
      defaultSelectedKeys={[location.pathname]}
      defaultOpenKeys={['/' + location.pathname.substring(1).split('/').slice(0, 2).join('/')]}
      mode="inline"
      inlineCollapsed={sGlobal.isCollapseMenu}
      items={listMenu as any}
      onSelect={({ key }) => {
        const menu = findMenu(listMenu, key);
        if (location.pathname !== key && menu) {
          navigate({
            pathname: menu.key,
            search: `?${createSearchParams(menu.queryparams)}`,
          });
        }
      }}
    />
  );
};
const CHeader = () => {
  const { t } = useTranslation('locale', { keyPrefix: 'layouts' });
  const sGlobal = SGlobal();
  const navigate = useNavigate();

  const listDropdown = [
    {
      key: '0',
      className: 'hover:!bg-white border-b-slate-300 border-b',
      label: (
        <div className="flex">
          <Avatar src={sGlobal.user?.avatar ?? ''} size={8} />
          <div className="mr-3 block pl-2 text-left leading-none">
            <div className="mb-0.5 text-sm font-semibold leading-snug">{sGlobal.user?.name}</div>
            <div className="text-[10px] text-gray-500">{sGlobal.user?.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: '1',
      className: 'h-11',
      label: (
        <button
          className="flex"
          onClick={() => navigate(`/${lang}${routerLinks('MyProfile')}?tab=1`, { replace: true })}
        >
          <div className="flex items-center">
            <User className="size-6 pr-2" />
          </div>
          <div>{t('My Profile')}</div>
        </button>
      ),
    },
    {
      key: '2',
      className: 'h-11 !border-b-slate-300 border-b !rounded-none',
      label: (
        <button
          className="flex"
          onClick={() => navigate(`/${lang}${routerLinks('MyProfile')}?tab=2`, { replace: true })}
        >
          <div className="flex items-center">
            <Key className="size-6 pr-2" />
          </div>
          <div>{t('Change Password')}</div>
        </button>
      ),
    },
    {
      key: '3',
      className: 'h-11',
      label: (
        <button className="flex" onClick={() => navigate(`/${lang}${routerLinks('Login')}`, { replace: true })}>
          <div className="flex items-center">
            <Out className="size-6 pr-2" />
          </div>
          <div>{t('Sign out')}</div>
        </button>
      ),
    },
  ];

  return (
    <header className={'block border-b border-base-300 bg-base-100'}>
      <div className="flex h-12 items-center justify-between px-5">
        <div>
          <div className="flex gap-5">
            <button
              className={classNames('hamburger', { active: sGlobal.isCollapseMenu })}
              onClick={() => sGlobal.set({ isCollapseMenu: !sGlobal.isCollapseMenu })}
            >
              <span className="line" />
              <span className="line" />
              <span className="line" />
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <Dropdown trigger={['click']} menu={{ items: listDropdown }} placement="bottomRight">
            <div className="flex gap-3">
              <button
                className="rounded-btn px-2 py-1 hover:bg-primary/10 hover:text-primary"
                onClick={() => {
                  const html = document.querySelector('html');
                  const dataTheme = html?.getAttribute('data-theme');
                  const theme = dataTheme === 'light' ? 'dark' : 'light';
                  html?.setAttribute('data-theme', theme);
                  localStorage.setItem('theme', theme);
                }}
              >
                <DayNight className="size-6" />
              </button>
              <Avatar src={sGlobal.user?.avatar ?? ''} size={8} />
            </div>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};
export default Layout;
