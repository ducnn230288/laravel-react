import React from 'react';
import { URLSearchParamsInit } from 'react-router-dom/dist/dom';

import { keyRole } from '@/utils';
import { Calendar, Cog, User } from '@/assets/svg';
import './index.less';

const Layout: IMenu[] = [
  {
    icon: <Calendar className="h-6 w-5" />,
    name: 'Dashboard',
  },
  {
    icon: <User className="h-6 w-5" />,
    name: 'User',
    permission: keyRole.P_USER_INDEX,
    queryParams: { roleCode: 'SUPER-ADMIN' },
  },
  {
    icon: <Cog className="h-6 w-5" />,
    name: 'Setting',
    child: [
      {
        name: 'Code',
        permission: keyRole.P_CODE_INDEX,
        queryParams: { typeCode: 'POSITION' },
      },
      {
        name: 'Content',
        permission: keyRole.P_CONTENT_INDEX,
        queryParams: { typeCode: 'MEMBERS' },
      },
      {
        name: 'Post',
        permission: keyRole.P_POST_INDEX,
        queryParams: { typeCode: 'PROJECTS' },
      },
      {
        name: 'Parameter',
        permission: keyRole.P_PARAMETER_INDEX,
        queryParams: { code: 'ADDRESS' },
      },
    ],
  },
];

export default Layout;

interface IMenu {
  name: string;
  icon?: React.JSX.Element;
  permission?: keyRole;
  queryParams?: URLSearchParamsInit;
  child?: IMenu[];
}
