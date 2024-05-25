import {createAsyncThunk} from "@reduxjs/toolkit";
import {Message} from "@/library/message";
import {API, keyRefreshToken, keyToken, routerLinks} from "@/utils";

import State, {IUser, ResetPassword} from './interface';

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
    const { data } = await API.get<IUser>(`${routerLinks(name, 'api')}/profile`);
    return data || {};
  }),
  putProfile: createAsyncThunk(name + '/putProfile', async (values: IUser) => {
    const { data, message } = await API.put<{ user: IUser; token: string; refreshToken: string }>(
      `${routerLinks(name, 'api')}/profile`,
      values,
    );
    if (data) {
      if (message) await Message.success({ text: message });
      localStorage.setItem(keyToken, data?.token);
      localStorage.setItem(keyRefreshToken, data?.refreshToken);
    }
    return data!.user;
  }),
  login: createAsyncThunk(name + '/login', async (values: { password: string; email: string }) => {
    const { data, message } = await API.post<{ user: IUser; token: string; refreshToken: string }>(
      `${routerLinks(name, 'api')}/login`,
      values,
      { include: 'role' },
    );
    if (data) {
      if (message) await Message.success({ text: message });
      localStorage.setItem(keyToken, data?.token);
      localStorage.setItem(keyRefreshToken, data?.refreshToken);
    }
    return data!.user;
  }),
  forgottenPassword: createAsyncThunk(name + '/forgotten-password', async (values: { email: string }) => {
    const { message } = await API.post(`${routerLinks(name, 'api')}/forgotten-password`, values);
    if (message) await Message.success({ text: message });
    return true;
  }),
  otpConfirmation: createAsyncThunk(name + '/otp-confirmation', async (values: { email: string; otp: string }) => {
    const { message } = await API.post(`${routerLinks(name, 'api')}/otp-confirmation`, values);
    if (message) await Message.success({ text: message });
    return true;
  }),
  resetPassword: createAsyncThunk(name + '/reset-password', async (values: ResetPassword) => {
    const { message } = await API.post(`${routerLinks(name, 'api')}/reset-password`, values);
    if (message) await Message.success({ text: message });
    return true;
  }),
}
