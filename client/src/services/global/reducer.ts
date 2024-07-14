import { EStatusState } from '@/enums';
import type { IResetPassword, IUser } from '@/types/model';
import { API, KEY_REFRESH_TOKEN, KEY_TOKEN, KEY_USER, routerLinks } from '@/utils';
import { createAsyncThunk, type ActionReducerMapBuilder } from '@reduxjs/toolkit';
import type { StateGlobal } from './state';

class RReducer {
  public action;
  public reducer;
  public pending = (_, __) => {};
  public fulfilled = (_, __) => {};
  public rejected = (_, __) => {};
  public constructor() {
    this.reducer = (builder: ActionReducerMapBuilder<StateGlobal>) => {
      builder
        .addCase(this.action.pending, (state, action) => {
          state.isLoading = true;
          state.status = EStatusState.idle;
          this.pending(state, action);
        })

        .addCase(this.action.fulfilled, (state, action) => {
          state.isLoading = false;
          this.fulfilled(state, action);
        })

        .addCase(this.action.rejected, (state, action) => {
          state.isLoading = false;
          this.rejected(state, action);
        });
    };
  }
}
export class RProfile extends RReducer {
  public constructor(name: string) {
    super();
    this.action = createAsyncThunk(name + '/profile', async () => {
      const { data } = await API.get<IUser>({ url: `${routerLinks(name, 'api')}/profile` });
      return data || {};
    });

    this.fulfilled = (state, action) => {
      if (action.payload) {
        state.user = action.payload;
        state.data = action.payload;
        localStorage.setItem(KEY_USER, JSON.stringify(action.payload));
        state.status = EStatusState.isFulfilled;
      }
    };
  }
}
export class RPutProfile extends RReducer {
  public constructor(name: string) {
    super();
    this.action = createAsyncThunk(name + '/putProfile', async (values: IUser) => {
      const { data } = await API.put<{ user: IUser; token: string; refreshToken: string }>({
        url: `${routerLinks(name, 'api')}/profile`,
        values,
      });
      if (data) {
        localStorage.setItem(KEY_TOKEN, data?.token);
        localStorage.setItem(KEY_REFRESH_TOKEN, data?.refreshToken);
      }
      return data!.user;
    });

    this.pending = (state, action) => {
      state.data = { ...state.data, ...action.meta.arg };
    };
    this.fulfilled = (state, action) => {
      if (action.payload) {
        localStorage.setItem(KEY_USER, JSON.stringify(action.payload));
        state.user = action.payload;
        state.status = EStatusState.isFulfilled;
      }
    };
  }
}
export class RLogin extends RReducer {
  public constructor(name: string) {
    super();
    this.action = createAsyncThunk(name + '/login', async (values: { password: string; email: string }) => {
      const { data } = await API.post<{ user: IUser; token: string; refreshToken: string }>({
        url: `${routerLinks(name, 'api')}/login`,
        values,
        params: { include: 'role' },
      });
      if (data) {
        localStorage.setItem(KEY_TOKEN, data?.token);
        localStorage.setItem(KEY_REFRESH_TOKEN, data?.refreshToken);
      }
      return data!.user;
    });

    this.pending = (state, action) => {
      state.data = action.meta.arg;
    };
    this.fulfilled = (state, action) => {
      if (action.payload) {
        localStorage.setItem(KEY_USER, JSON.stringify(action.payload));
        state.user = action.payload;
        state.data = {};
        state.status = EStatusState.isFulfilled;
      }
    };
  }
}
export class RForgottenPassword extends RReducer {
  public constructor(name: string) {
    super();
    this.action = createAsyncThunk(name + '/forgotten-password', async (values: { email: string }) => {
      await API.post({ url: `${routerLinks(name, 'api')}/forgotten-password`, values });
      return true;
    });

    this.pending = (state, action) => {
      state.data = action.meta.arg;
    };
    this.fulfilled = (state, action) => {
      if (action.payload) {
        state.status = EStatusState.isFulfilled;
      }
    };
  }
}
export class ROtpConfirmation extends RReducer {
  public constructor(name: string) {
    super();
    this.action = createAsyncThunk(name + '/otp-confirmation', async (values: { email: string; otp: string }) => {
      await API.post({ url: `${routerLinks(name, 'api')}/otp-confirmation`, values });
      return true;
    });

    this.pending = (state, action) => {
      state.data = action.meta.arg;
    };
    this.fulfilled = (state, action) => {
      if (action.payload) {
        state.status = EStatusState.isFulfilled;
      }
    };
  }
}
export class RResetPassword extends RReducer {
  public constructor(name: string) {
    super();
    this.action = createAsyncThunk(name + '/reset-password', async (values: IResetPassword) => {
      await API.post({ url: `${routerLinks(name, 'api')}/reset-password`, values });
      return true;
    });

    this.pending = (state, action) => {
      state.data = action.meta.arg;
    };
    this.fulfilled = (state, action) => {
      if (action.payload) {
        state.data = {};
        state.status = EStatusState.isFulfilled;
      }
    };
  }
}