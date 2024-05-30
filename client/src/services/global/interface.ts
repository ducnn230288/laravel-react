import viVN from 'antd/lib/locale/vi_VN';
import enUS from 'antd/lib/locale/en_US';

import { ICommonEntity } from '@/interfaces';
import { ICode } from '@/pages/base/code/service';
import { IUserRole } from '@/pages/base/user/service/role';

import { EStatusGlobal } from './enum';

interface State {
  [selector: string]: any;
  user?: IUser;
  data?: ResetPassword & IUser;
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

export interface ResetPassword {
  password?: string;
  retypedPassword?: string;
  passwordOld?: string;
  email?: string;
  otp?: string;
}
