import type { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import viVN from 'antd/lib/locale/vi_VN';
import enUS from 'antd/lib/locale/en_US';
import dayjs from 'dayjs';
import i18n from 'i18next';

import { keyRefreshToken, keyToken, keyUser, lang } from '@/utils';
import Action from './action';
import { EStatusGlobal } from './enum';
import type State from './interface';

const checkLanguage = (language: string) => {
  const formatDate = language === 'vn' ? 'DD-MM-YYYY' : 'MM-DD-YYYY';
  const locale = language === 'vn' ? viVN : enUS;
  dayjs.locale(language === 'vn' ? 'vi' : language);
  localStorage.setItem('i18nextLng', language);
  document.querySelector('html')?.setAttribute('lang', language);
  return { language: language, formatDate, locale };
};

const initialState: State = {
  data: JSON.parse(localStorage.getItem(keyUser) ?? '{}'),
  user: JSON.parse(localStorage.getItem(keyUser) ?? '{}'),
  isLoading: false,
  isVisible: false,
  status: EStatusGlobal.idle,
  pathname: '',
  ...checkLanguage(lang),
};
export const globalSlice = createSlice({
  name: Action.name,
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      if (action.payload !== state.language) {
        const { language, formatDate, locale } = checkLanguage(action.payload);
        i18n.changeLanguage(language);
        state.formatDate = formatDate;
        state.locale = locale;
        if (state.routeLanguage) state.pathname = state.routeLanguage[language];
        else
          state.pathname = location.hash.substring(1).replace('/' + state.language + '/', '/' + action.payload + '/');
        state.language = language;
      }
    },
  },
  extraReducers: builder => {
    set(Action, builder);
    logout(Action, builder);
    profile(Action, builder);
    putProfile(Action, builder);
    login(Action, builder);
    forgottenPassword(Action, builder);
    otpConfirmation(Action, builder);
    resetPassword(Action, builder);
  },
});
const set = (action: typeof Action, builder: ActionReducerMapBuilder<State>) => {
  builder.addCase(action.set.fulfilled, (state, action) => {
    let key: keyof State;
    for (key in action.payload) {
      state[key] = action.payload[key];
    }
  });
};
const logout = (action: typeof Action, builder: ActionReducerMapBuilder<State>) => {
  builder
    // .addCase(action.logout.pending, (state: State) => {
    //   state.isLoading = true;
    //   state.status = EStatusGlobal.logoutFulfilled
    // })
    .addCase(action.logout.fulfilled, state => {
      state.user = {};
      state.data = {};
      localStorage.removeItem(keyUser);
      localStorage.removeItem(keyToken);
      localStorage.removeItem(keyRefreshToken);
      state.isLoading = false;
      state.status = EStatusGlobal.logoutFulfilled;
    });
};
const profile = (action: typeof Action, builder: ActionReducerMapBuilder<State>) => {
  builder
    .addCase(action.profile.fulfilled, (state, action) => {
      if (action.payload) {
        state.user = action.payload;
        state.data = action.payload;
        localStorage.setItem(keyUser, JSON.stringify(action.payload));
        state.status = EStatusGlobal.profileFulfilled;
      } else state.status = EStatusGlobal.idle;
      state.isLoading = false;
    })
    .addCase(action.profile.rejected, state => {
      state.status = EStatusGlobal.profileRejected;
      state.isLoading = false;
    });
};
const putProfile = (action: typeof Action, builder: ActionReducerMapBuilder<State>) => {
  builder
    .addCase(action.putProfile.pending, (state, action) => {
      state.data = { ...state.data, ...action.meta.arg };
      state.isLoading = true;
      state.status = EStatusGlobal.putProfilePending;
    })
    .addCase(action.putProfile.fulfilled, (state, action) => {
      if (action.payload) {
        localStorage.setItem(keyUser, JSON.stringify(action.payload));
        state.user = action.payload;
        state.status = EStatusGlobal.putProfileFulfilled;
      } else state.status = EStatusGlobal.idle;
      state.isLoading = false;
    })
    .addCase(action.putProfile.rejected, state => {
      state.status = EStatusGlobal.putProfileRejected;
      state.isLoading = false;
    });
};
const login = (action: typeof Action, builder: ActionReducerMapBuilder<State>) => {
  builder
    .addCase(action.login.pending, (state, action) => {
      state.data = action.meta.arg;
      state.isLoading = true;
      state.status = EStatusGlobal.loginPending;
    })
    .addCase(action.login.fulfilled, (state, action) => {
      if (action.payload) {
        localStorage.setItem(keyUser, JSON.stringify(action.payload));
        state.user = action.payload;
        state.data = {};
        state.status = EStatusGlobal.loginFulfilled;
      } else state.status = EStatusGlobal.idle;
      state.isLoading = false;
    })
    .addCase(action.login.rejected, state => {
      state.status = EStatusGlobal.loginRejected;
      state.isLoading = false;
    });
};
const forgottenPassword = (action: typeof Action, builder: ActionReducerMapBuilder<State>) => {
  builder
    .addCase(action.forgottenPassword.pending, (state, action) => {
      state.data = action.meta.arg;
      state.isLoading = true;
      state.status = EStatusGlobal.forgottenPasswordPending;
    })
    .addCase(action.forgottenPassword.fulfilled, (state, action) => {
      if (action.payload) {
        state.status = EStatusGlobal.forgottenPasswordFulfilled;
      } else state.status = EStatusGlobal.idle;
      state.isLoading = false;
    })
    .addCase(action.forgottenPassword.rejected, state => {
      state.status = EStatusGlobal.forgottenPasswordRejected;
      state.isLoading = false;
    });
};
const otpConfirmation = (action: typeof Action, builder: ActionReducerMapBuilder<State>) => {
  builder

    .addCase(action.otpConfirmation.pending, (state, action) => {
      state.data = action.meta.arg;
      state.isLoading = true;
      state.status = EStatusGlobal.otpConfirmationPending;
    })
    .addCase(action.otpConfirmation.fulfilled, (state, action) => {
      if (action.payload) {
        state.status = EStatusGlobal.otpConfirmationFulfilled;
      } else state.status = EStatusGlobal.idle;
      state.isLoading = false;
    })
    .addCase(action.otpConfirmation.rejected, state => {
      state.status = EStatusGlobal.otpConfirmationRejected;
      state.isLoading = false;
    });
};
const resetPassword = (action: typeof Action, builder: ActionReducerMapBuilder<State>) => {
  builder

    .addCase(action.resetPassword.pending, (state, action) => {
      state.data = action.meta.arg;
      state.isLoading = true;
      state.status = EStatusGlobal.resetPasswordPending;
    })
    .addCase(action.resetPassword.fulfilled, (state, action) => {
      if (action.payload) {
        state.data = {};
        state.status = EStatusGlobal.resetPasswordFulfilled;
      } else state.status = EStatusGlobal.idle;
      state.isLoading = false;
    })
    .addCase(action.resetPassword.rejected, state => {
      state.status = EStatusGlobal.resetPasswordRejected;
      state.isLoading = false;
    });
};
