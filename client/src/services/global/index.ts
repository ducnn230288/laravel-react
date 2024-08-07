import { createSlice } from '@reduxjs/toolkit';
import i18n from 'i18next';

import type { IMUser, IResetPassword } from '@/types/model';
import { useAppDispatch, useTypedSelector } from '..';
import { RGlobal } from './reducer';
import { checkLanguage, initialStateGlobal, nameGlobal, type StateGlobal } from './state';

export const globalSlice = createSlice({
  name: nameGlobal,
  initialState: initialStateGlobal,
  reducers: {
    set: (state, action) => {
      Object.keys(action.payload).forEach(key => {
        state[key] = action.payload[key as keyof StateGlobal];
      });
    },
    setLanguage: (state, action) => {
      if (action.payload !== state.language) {
        const { language, locale, localeDate } = checkLanguage(action.payload);
        i18n.changeLanguage(language);
        state.locale = locale;
        state.language = language;
        state.localeDate = localeDate;
      }
    },
  },
  extraReducers: builder => {
    RGlobal.getProfile.reducer(builder);
    RGlobal.putProfile.reducer(builder);
    RGlobal.postLogin.reducer(builder);
    RGlobal.postForgottenPassword.reducer(builder);
    RGlobal.postOtpConfirmation.reducer(builder);
    RGlobal.postResetPassword.reducer(builder);
  },
});

export const SGlobal = () => {
  const dispatch = useAppDispatch();
  return {
    ...(useTypedSelector(state => state[nameGlobal]) as StateGlobal),
    set: (values: StateGlobal) => dispatch(globalSlice.actions.set(values)),
    setLanguage: (value: string) => dispatch(globalSlice.actions.setLanguage(value)),

    getProfile: () => dispatch(RGlobal.getProfile.action()),
    putProfile: (values: IMUser) => dispatch(RGlobal.putProfile.action(values)),
    postLogin: (values: { password: string; email: string }) => dispatch(RGlobal.postLogin.action(values)),
    postForgottenPassword: (values: { email: string }) => dispatch(RGlobal.postForgottenPassword.action(values)),
    postOtpConfirmation: (values: { email: string; otp: string }) =>
      dispatch(RGlobal.postOtpConfirmation.action(values)),
    postResetPassword: (values: IResetPassword) => dispatch(RGlobal.postResetPassword.action(values)),
  };
};
