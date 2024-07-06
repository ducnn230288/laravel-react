import type enUS from 'antd/lib/locale/en_US';
import type viVN from 'antd/lib/locale/vi_VN';

import type { ICode } from '@/pages/base/code/service';
import type { IUserRole } from '@/pages/base/user/service/role';
import type { ICommonEntity } from '@/types';

import type { EStatusGlobal } from './enum';

interface State {
  [selector: string]: any;
  user?: IUser;
  data?: IResetPassword & IUser;
  routeLanguage?: Record<string, string>;
  isLoading?: boolean;
  isVisible?: boolean;
  status?: EStatusGlobal;
  pathname?: string;
  formatDate?: string;
  language?: string;
  locale?: typeof viVN | typeof enUS;
  isCollapseMenu?: boolean;
}

export default State;

export interface IUser extends ICommonEntity {
  name?: string;
  avatar?: string;
  password?: string;
  email?: string;
  phoneNumber?: string;
  dob?: string;
  description?: string;
  positionCode?: string;
  position?: ICode;
  retypedPassword?: string;
  roleCode?: string;
  role?: IUserRole;
  createdAt?: string;
  updatedAt?: string;
  isDisable?: boolean;
}

export interface IResetPassword {
  password?: string;
  retypedPassword?: string;
  passwordOld?: string;
  email?: string;
  otp?: string;
}
