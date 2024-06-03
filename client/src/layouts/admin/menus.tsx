import React from 'react';
import { URLSearchParamsInit } from 'react-router-dom/dist/dom';
import { keyRole, language, routerLinks } from '@/utils';
import { Calendar, Cog, User } from '@/assets/svg';
import { useTranslation } from 'react-i18next';

interface IMenu {
  key?: string;
  label?: string;
  icon?: React.JSX.Element;
  permission?: keyRole;
  queryparams?: URLSearchParamsInit;
  children?: IMenu[];
}

const Layout = ({ lang = language, permissions = [] }: { lang?: string; permissions?: string[] }): IMenu[] => {
  const { t } = useTranslation('locale', { keyPrefix: 'menu' });

  const list: IMenu[] = [
    {
      key: `/${lang}${routerLinks('Dashboard')}`,
      icon: <Calendar className="h-6 w-5" />,
      label: t('Dashboard'),
    },
    {
      key: `/${lang}${routerLinks('User')}`,
      icon: <User className="h-6 w-5" />,
      label: t('User'),
      permission: keyRole.P_USER_INDEX,
      queryparams: { roleCode: 'SUPER-ADMIN' },
    },
    {
      key: `/${lang}${routerLinks('Setting')}`,
      icon: <Cog className="h-6 w-5" />,
      label: t('Setting'),
      children: [
        {
          key: `/${lang}${routerLinks('Code')}`,
          label: t('Code'),
          permission: keyRole.P_CODE_INDEX,
          queryparams: { typeCode: 'POSITION' },
        },
        {
          key: `/${lang}${routerLinks('Content')}`,
          label: t('Content'),
          permission: keyRole.P_CONTENT_INDEX,
          queryparams: { typeCode: 'MEMBERS' },
        },
        {
          key: `/${lang}${routerLinks('Post')}`,
          label: t('Post'),
          permission: keyRole.P_POST_INDEX,
          queryparams: { typeCode: 'PROJECTS' },
        },
        {
          key: `/${lang}${routerLinks('Parameter')}`,
          label: t('Parameter'),
          permission: keyRole.P_PARAMETER_INDEX,
          queryparams: { code: 'ADDRESS' },
        },
      ],
    },
  ];
  return list.filter((item) => {
    return (
      !item.permission ||
      (!item.children && item.permission && permissions?.includes(item.permission!)) ||
      (item.children &&
        item.children.filter((subItem) => !subItem.permission || permissions?.includes(subItem.permission)).length > 0)
    );
  });
};
export default Layout;

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
