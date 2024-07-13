import { createSlice } from '@reduxjs/toolkit';
import i18n from 'i18next';

import type { IResetPassword, IUser } from '@/types/model';
import { useAppDispatch, useTypedSelector } from '..';
import { RForgottenPassword, RLogin, ROtpConfirmation, RProfile, RPutProfile, RResetPassword } from './reducer';
import { checkLanguage, initialStateGlobal, type StateGlobal } from './state';

const name = 'Auth';
const rProfile = new RProfile(name);
const rPutProfile = new RPutProfile(name);
const rLogin = new RLogin(name);
const rForgottenPassword = new RForgottenPassword(name);
const rOtpConfirmation = new ROtpConfirmation(name);
const rResetPassword = new RResetPassword(name);

export const globalSlice = createSlice({
  name,
  initialState: initialStateGlobal,
  reducers: {
    set: (state, action) => {
      Object.keys(action.payload).forEach(key => {
        state[key] = action.payload[key as keyof StateGlobal];
      });
    },
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
    rProfile.reducer(builder);
    rPutProfile.reducer(builder);
    rLogin.reducer(builder);
    rForgottenPassword.reducer(builder);
    rOtpConfirmation.reducer(builder);
    rResetPassword.reducer(builder);
  },
});

export const SGlobal = () => {
  const dispatch = useAppDispatch();
  return {
    ...(useTypedSelector(state => state[name]) as StateGlobal),
    set: (values: StateGlobal) => dispatch(globalSlice.actions.set(values)),
    setLanguage: (value: string) => dispatch(globalSlice.actions.setLanguage(value)),

    profile: () => dispatch(rProfile.action()),
    putProfile: (values: IUser) => dispatch(rPutProfile.action(values)),
    login: (values: { password: string; email: string }) => dispatch(rLogin.action(values)),
    forgottenPassword: (values: { email: string }) => dispatch(rForgottenPassword.action(values)),
    otpConfirmation: (values: { email: string; otp: string }) => dispatch(rOtpConfirmation.action(values)),
    resetPassword: (values: IResetPassword) => dispatch(rResetPassword.action(values)),
  };
};
