import { EStatusState } from '@/enums';
import type { IResetPassword, IUser } from '@/types/model';
import { KEY_USER, lang } from '@/utils';
import enUS from 'antd/lib/locale/en_US';
import viVN from 'antd/lib/locale/vi_VN';
import dayjs from 'dayjs';
import { enLocale, viLocale } from './locale';

export interface StateGlobal {
  user?: IUser;
  data?: IResetPassword & IUser;
  isLoading?: boolean;
  status?: EStatusState;
  language?: string;
  locale?: typeof viVN | typeof enUS;
  localeDate?: typeof enLocale | typeof viLocale;
  isCollapseMenu?: boolean;
}

export const checkLanguage = (language: string) => {
  const locale = language === 'vi' ? viVN : enUS;
  const localeDate = language === 'vi' ? viLocale : enLocale;
  dayjs.locale(language);
  localStorage.setItem('i18nextLng', language);
  document.querySelector('html')?.setAttribute('lang', language);
  return { language, locale, localeDate };
};

export const initialStateGlobal: StateGlobal = {
  data: JSON.parse(localStorage.getItem(KEY_USER) ?? '{}'),
  user: JSON.parse(localStorage.getItem(KEY_USER) ?? '{}'),
  isLoading: false,
  status: EStatusState.idle,
  ...checkLanguage(lang),
};
