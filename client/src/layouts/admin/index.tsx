import React, { PropsWithChildren } from 'react';
import { Dropdown, Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';
import classNames from 'classnames';

import { Key, Out, User, Logo, DayNight } from '@/assets/svg';
import { Avatar } from '@/library/avatar';
import { SGlobal } from '@/services';
import { routerLinks, lang, APP_NAME } from '@/utils';
import menus, { findMenu } from './menus';
import { ItemType } from 'antd/es/menu/interface';

const Layout = ({ children }: PropsWithChildren) => {
  const { t } = useTranslation('locale', { keyPrefix: 'layouts' });

  return (
    <div className="l-admin">
      <CSide />
      <section>
        <CHeader />
        <main>{children}</main>
        <footer>{t('Footer', { year: new Date().getFullYear() })}</footer>
      </section>
    </div>
  );
};

const CSide = () => {
  const sGlobal = SGlobal();
  const location = useLocation();
  const navigate = useNavigate();
  const listMenu = menus({ lang: sGlobal.language, permissions: sGlobal.user?.role?.permissions });

  return (
    <aside className={classNames({ active: sGlobal.isCollapseMenu })}>
      <a href="/vn/dashboard" className={classNames('logo', { active: sGlobal.isCollapseMenu })}>
        <Logo />
        <h1 className={classNames({ active: sGlobal.isCollapseMenu })}>{APP_NAME}</h1>
      </a>
      <Menu
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
    </aside>
  );
};
const CHeader = () => {
  const changeTheme = () => {
    const html = document.querySelector('html');
    const dataTheme = html?.getAttribute('data-theme');
    const theme = dataTheme === 'light' ? 'dark' : 'light';
    html?.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  const navigate = useNavigate();
  const changePage = (link: string) => navigate(`/${lang}${link}`, { replace: true });

  const sGlobal = SGlobal();
  const { t } = useTranslation('locale', { keyPrefix: 'layouts' });
  const listDropdown: ItemType[] = [
    {
      key: 'My Profile',
      label: (
        <button className="flex gap-2 items-center" onClick={() => changePage(`${routerLinks('MyProfile')}?tab=1`)}>
          <User className="size-5" />
          {t('My Profile')}
        </button>
      ),
    },
    {
      key: 'Change Password',
      label: (
        <button className="flex gap-2 items-center" onClick={() => changePage(`${routerLinks('MyProfile')}?tab=2`)}>
          <Key className="size-5" />
          {t('Change Password')}
        </button>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'Sign out',
      label: (
        <button className="flex gap-2 items-center" onClick={() => changePage(routerLinks('Login'))}>
          <Out className="size-5" />
          {t('Sign out')}
        </button>
      ),
    },
  ];

  return (
    <header>
      <button
        className={classNames('hamburger', { active: sGlobal.isCollapseMenu })}
        onClick={() => sGlobal.set({ isCollapseMenu: !sGlobal.isCollapseMenu })}
      >
        <span className="line" />
        <span className="line" />
        <span className="line" />
      </button>

      <div className="right">
        <button onClick={changeTheme}>
          <DayNight className="size-6" />
        </button>
        <Dropdown trigger={['click']} menu={{ items: listDropdown }} placement="bottomRight">
          <div className="flex cursor-pointer gap-1.5">
            <Avatar src={sGlobal.user?.avatar ?? ''} size={8} />
            <div className="leading-none">
              <p className="text-sm font-semibold">{sGlobal.user?.name}</p>
              <span className="text-xs text-gray-500">{sGlobal.user?.email}</span>
            </div>
          </div>
        </Dropdown>
      </div>
    </header>
  );
};
export default Layout;
