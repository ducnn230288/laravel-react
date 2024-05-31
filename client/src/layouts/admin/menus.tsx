import React from 'react';
import { URLSearchParamsInit } from 'react-router-dom/dist/dom';

import { keyRole } from '@/utils';
import { Calendar, Cog, User } from '@/assets/svg';
import './index.less';

const Layout: IMenu[] = [
  {
    icon: <Calendar className="h-6 w-5" />,
    label: 'Dashboard',
  },
  {
    icon: <User className="h-6 w-5" />,
    label: 'User',
    permission: keyRole.P_USER_INDEX,
    queryParams: { roleCode: 'SUPER-ADMIN' },
  },
  {
    icon: <Cog className="h-6 w-5" />,
    label: 'Setting',
    children: [
      {
        label: 'Code',
        permission: keyRole.P_CODE_INDEX,
        queryParams: { typeCode: 'POSITION' },
      },
      {
        label: 'Content',
        permission: keyRole.P_CONTENT_INDEX,
        queryParams: { typeCode: 'MEMBERS' },
      },
      {
        label: 'Post',
        permission: keyRole.P_POST_INDEX,
        queryParams: { typeCode: 'PROJECTS' },
      },
      {
        label: 'Parameter',
        permission: keyRole.P_PARAMETER_INDEX,
        queryParams: { code: 'ADDRESS' },
      },
    ],
  },
];

export default Layout;

interface IMenu {
  label: string;
  icon?: React.JSX.Element;
  permission?: keyRole;
  queryParams?: URLSearchParamsInit;
  children?: IMenu[];
}
