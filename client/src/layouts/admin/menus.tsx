import React from 'react';
import { useTranslation } from 'react-i18next';
import type { URLSearchParamsInit } from 'react-router-dom';

import { CSvgIcon } from '@/components/svg-icon';
import { KEY_ROLE, LANGUAGE, routerLinks } from '@/utils';

const Layout = ({ lang = LANGUAGE, permissions = [] }: { lang?: string; permissions?: string[] }): IMenu[] => {
  const { t } = useTranslation('locale', { keyPrefix: 'menu' });

  const list: IMenu[] = [
    {
      key: `/${lang}${routerLinks('Dashboard')}`,
      icon: <CSvgIcon name='calendar' size={24} />,
      label: t('Dashboard'),
    },
    {
      key: `/${lang}${routerLinks('User')}`,
      icon: <CSvgIcon name='user-circle' size={24} />,
      label: t('User'),
      permission: KEY_ROLE.P_USER_INDEX,
      queryparams: { roleCode: 'SUPER-ADMIN' },
    },
    {
      key: `/${lang}${routerLinks('Setting')}`,
      icon: <CSvgIcon name='cog' size={24} />,
      label: t('Setting'),
      children: [
        {
          key: `/${lang}${routerLinks('Code')}`,
          label: t('Code'),
          permission: KEY_ROLE.P_CODE_INDEX,
          queryparams: { typeCode: 'POSITION' },
        },
        {
          key: `/${lang}${routerLinks('Content')}`,
          label: t('Content'),
          permission: KEY_ROLE.P_CONTENT_INDEX,
          queryparams: { typeCode: 'MEMBERS' },
        },
        {
          key: `/${lang}${routerLinks('Post')}`,
          label: t('Post'),
          permission: KEY_ROLE.P_POST_INDEX,
          queryparams: { typeCode: 'PROJECTS' },
        },
        {
          key: `/${lang}${routerLinks('Parameter')}`,
          label: t('Parameter'),
          permission: KEY_ROLE.P_PARAMETER_INDEX,
          queryparams: { code: 'ADDRESS' },
        },
      ],
    },
  ];
  return list.filter(item => {
    return (
      !item.permission ||
      (!item.children && item.permission && permissions?.includes(item.permission!)) ||
      (item.children &&
        item.children.filter(subItem => !subItem.permission || permissions?.includes(subItem.permission)).length > 0)
    );
  });
};
export default Layout;

export interface IMenu {
  key?: string;
  label?: string;
  icon?: React.JSX.Element;
  permission?: KEY_ROLE;
  queryparams?: URLSearchParamsInit;
  children?: IMenu[];
}

export const findMenu = (menus: IMenu[], key: string): IMenu | undefined => {
  let menuCurrent: IMenu | undefined;
  const forEachMenu = (menu: IMenu) => {
    if (menu.key === key) {
      menuCurrent = menu;
    } else if (menu.children) {
      menu.children.forEach(forEachMenu);
    }
  };
  menus.forEach(forEachMenu);
  return menuCurrent;
};
