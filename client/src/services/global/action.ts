import { createAsyncThunk } from '@reduxjs/toolkit';
import { API, keyRefreshToken, keyToken, routerLinks } from '@/utils';

import type State from './interface';
import type { IUser, ResetPassword } from './interface';

const name = 'Auth';
export default {
  name,
  set: createAsyncThunk(name + '/set', async (values: State) => values),
  logout: createAsyncThunk(name + '/logout', async () => {
    // if (localStorage.getItem(keyRefreshToken)) {
    //   return await API.get(`${routerLinks(name, 'api')}/logout`);
    // }
    return true;
  }),
  profile: createAsyncThunk(name + '/profile', async () => {
    const { data } = await API.get<IUser>({ url: `${routerLinks(name, 'api')}/profile` });
    return data || {};
  }),
  putProfile: createAsyncThunk(name + '/putProfile', async (values: IUser) => {
    const { data } = await API.put<{ user: IUser; token: string; refreshToken: string }>({
      url: `${routerLinks(name, 'api')}/profile`,
      values,
    });
    if (data) {
      localStorage.setItem(keyToken, data?.token);
      localStorage.setItem(keyRefreshToken, data?.refreshToken);
    }
    return data!.user;
  }),
  login: createAsyncThunk(name + '/login', async (values: { password: string; email: string }) => {
    const { data } = await API.post<{ user: IUser; token: string; refreshToken: string }>({
      url: `${routerLinks(name, 'api')}/login`,
      values,
      params: { include: 'role' },
    });
    if (data) {
      localStorage.setItem(keyToken, data?.token);
      localStorage.setItem(keyRefreshToken, data?.refreshToken);
    }
    return data!.user;
  }),
  forgottenPassword: createAsyncThunk(name + '/forgotten-password', async (values: { email: string }) => {
    await API.post({ url: `${routerLinks(name, 'api')}/forgotten-password`, values });
    return true;
  }),
  otpConfirmation: createAsyncThunk(name + '/otp-confirmation', async (values: { email: string; otp: string }) => {
    await API.post({ url: `${routerLinks(name, 'api')}/otp-confirmation`, values });
    return true;
  }),
  resetPassword: createAsyncThunk(name + '/reset-password', async (values: ResetPassword) => {
    await API.post({ url: `${routerLinks(name, 'api')}/reset-password`, values });
    return true;
  }),
};
