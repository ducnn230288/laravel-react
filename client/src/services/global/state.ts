import { EStatusState } from '@/enums';
import type { IResetPassword, IUser } from '@/types/model';
import { KEY_USER, lang } from '@/utils';
import enUS from 'antd/lib/locale/en_US';
import viVN from 'antd/lib/locale/vi_VN';
import dayjs from 'dayjs';

export interface StateGlobal {
  [selector: string]: any;
  user?: IUser;
  data?: IResetPassword & IUser;
  routeLanguage?: Record<string, string>;
  isLoading?: boolean;
  isVisible?: boolean;
  status?: EStatusState;
  pathname?: string;
  formatDate?: string;
  language?: string;
  locale?: typeof viVN | typeof enUS;
  isCollapseMenu?: boolean;
}

export const checkLanguage = (language: string) => {
  const formatDate = language === 'vn' ? 'DD-MM-YYYY' : 'MM-DD-YYYY';
  const locale = language === 'vn' ? viVN : enUS;
  dayjs.locale(language === 'vn' ? 'vi' : language);
  localStorage.setItem('i18nextLng', language);
  document.querySelector('html')?.setAttribute('lang', language);
  return { language, formatDate, locale };
};

export const initialStateGlobal: StateGlobal = {
  data: JSON.parse(localStorage.getItem(KEY_USER) ?? '{}'),
  user: JSON.parse(localStorage.getItem(KEY_USER) ?? '{}'),
  isLoading: false,
  isVisible: false,
  status: EStatusState.idle,
  pathname: '',
  ...checkLanguage(lang),
};
