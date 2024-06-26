import React, { Fragment, type PropsWithChildren, useEffect } from 'react';
import { Dropdown, Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';
import classNames from 'classnames';
import type { ItemType } from 'antd/es/menu/interface';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { CAvatar } from '@/library/avatar';
import { CSvgIcon } from '@/library/svg-icon';
import { SGlobal } from '@/services';
import { routerLinks, lang, APP_NAME } from '@/utils';

import menus, { findMenu } from './menus';

const Layout = ({ children }: PropsWithChildren) => {
  const { t } = useTranslation('locale', { keyPrefix: 'layouts' });

  return (
    <div className='l-admin'>
      <CSide />
      <section>
        <CHeader />
        <PerfectScrollbar options={{ wheelSpeed: 1 }}>
          <main>{children}</main>
        </PerfectScrollbar>
        <footer>{t('Footer', { year: new Date().getFullYear() })}</footer>
      </section>
    </div>
  );
};
const CSide = () => {
  const sGlobal = SGlobal();

  useEffect(() => {
    checkResponsive();
    window.addEventListener('resize', checkResponsive, { passive: true });
  }, []);

  const checkResponsive = () => {
    if (innerWidth < 1280 && !sGlobal.isCollapseMenu) {
      sGlobal.set({ isCollapseMenu: true });
    }
  };

  const location = useLocation();
  const navigate = useNavigate();
  const listMenu = menus({ lang: sGlobal.language, permissions: sGlobal.user?.role?.permissions });

  return (
    <Fragment>
      <div className={classNames('overload', { active: !sGlobal.isCollapseMenu })}></div>
      <aside className={classNames({ active: sGlobal.isCollapseMenu })}>
        <a href='/vn/dashboard' className={classNames('logo', { active: sGlobal.isCollapseMenu })}>
          <CSvgIcon name='logo' />
          <h1 className={classNames({ active: sGlobal.isCollapseMenu })}>{APP_NAME}</h1>
        </a>
        <PerfectScrollbar options={{ wheelSpeed: 1 }}>
          <Menu
            defaultSelectedKeys={[location.pathname]}
            defaultOpenKeys={['/' + location.pathname.substring(1).split('/').slice(0, 2).join('/')]}
            mode='inline'
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
        </PerfectScrollbar>
      </aside>
    </Fragment>
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
        <button onClick={() => changePage(`${routerLinks('MyProfile')}?tab=1`)}>
          <CSvgIcon name='user-circle' size={20} />
          {t('My Profile')}
        </button>
      ),
    },
    {
      key: 'Change Password',
      label: (
        <button onClick={() => changePage(`${routerLinks('MyProfile')}?tab=2`)}>
          <CSvgIcon name='key' size={20} />
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
        <button onClick={() => changePage(routerLinks('Login'))}>
          <CSvgIcon name='out' size={20} />
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
        <span className='line' />
        <span className='line' />
        <span className='line' />
      </button>

      <div className='right'>
        <Dropdown
          trigger={['click']}
          menu={{
            items: [
              {
                key: 'language',
                label: (
                  <button onClick={() => sGlobal.setLanguage(sGlobal.language === 'vn' ? 'en' : 'vn')}>
                    {sGlobal.language === 'en' ? (
                      <CSvgIcon name='vn' size={20} className='rounded-lg' />
                    ) : (
                      <CSvgIcon name='us' size={20} className='rounded-lg' />
                    )}
                    {t(sGlobal.language === 'vn' ? 'en' : 'vn')}
                  </button>
                ),
              },
            ],
          }}
        >
          <button>
            {sGlobal.language === 'en' ? (
              <CSvgIcon name='us' size={24} className='rounded-lg' />
            ) : (
              <CSvgIcon name='vn' size={24} className='rounded-lg' />
            )}
          </button>
        </Dropdown>
        <button onClick={changeTheme}>
          <CSvgIcon name='day-night' size={24} />
        </button>
        <Dropdown trigger={['click']} menu={{ items: listDropdown }} placement='bottomRight'>
          <div className='flex cursor-pointer gap-1.5'>
            <CAvatar src={sGlobal.user?.avatar ?? ''} size={8} />
            <div className='leading-none'>
              <p className='text-sm font-semibold'>{sGlobal.user?.name}</p>
              <span className='text-xs text-gray-500'>{sGlobal.user?.email}</span>
            </div>
          </div>
        </Dropdown>
      </div>
    </header>
  );
};
export default Layout;
