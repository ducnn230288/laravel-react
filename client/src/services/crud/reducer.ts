import { EStatusState } from '@/enums';
import type { IPaginationQuery } from '@/types';
import { API, routerLinks } from '@/utils';
import { createAsyncThunk, type ActionReducerMapBuilder } from '@reduxjs/toolkit';
import type { StateCrud } from './state';

class RReducer {
  public action;
  public reducer;
  public pending = (_, __) => {};
  public fulfilled = (_, __) => {};
  public rejected = (_, __) => {};
  public constructor() {
    this.reducer = (builder: ActionReducerMapBuilder<StateCrud>) => {
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
export class RGet extends RReducer {
  public constructor(name: string) {
    super();
    this.action = createAsyncThunk(
      name + '/get',
      async ({ params, keyApi }: { params: IPaginationQuery; keyApi: string }) =>
        await API.get({ url: `${routerLinks(keyApi, 'api')}`, params }),
    );
    this.pending = (state, action) => {
      state.time = new Date().getTime() + (state.keepUnusedDataFor ?? 60) * 1000;
      const queryParams = JSON.parse(JSON.stringify(action.meta.arg));
      delete queryParams.keyApi;
      state.queryParams = JSON.stringify(queryParams.params);
    };
    this.fulfilled = (state, action) => {
      if (action.payload.data) {
        state.result = action.payload;
      }
    };
  }
}
export class RGetId extends RReducer {
  public constructor(name: string) {
    super();
    this.action = createAsyncThunk(
      name + '/getById',
      async ({ id, params, keyApi }: { id: string; params?: IPaginationQuery; keyApi: string }) => {
        const { data } = await API.get({ url: `${routerLinks(keyApi, 'api')}/${id}`, params });
        return data;
      },
    );
    this.fulfilled = (state, action) => {
      if (action.payload) {
        if (JSON.stringify(state.data) !== JSON.stringify(action.payload)) state.data = action.payload;
        state.isVisible = true;
      }
    };
  }
}
export class RPost extends RReducer {
  public constructor(name: string) {
    super();
    this.action = createAsyncThunk(name + '/post', async ({ values, keyApi }: { values: any; keyApi: string }) => {
      const { data } = await API.post({ url: `${routerLinks(keyApi, 'api')}`, values });
      return data;
    });
    this.pending = (state, action) => {
      state.data = action.meta.arg;
    };
    this.fulfilled = (state, action) => {
      if (action.payload) {
        if (JSON.stringify(state.data) !== JSON.stringify(action.payload)) state.data = action.payload;
        state.isVisible = false;
        state.status = EStatusState.isFulfilled;
      }
    };
  }
}
export class RPut extends RReducer {
  public constructor(name: string) {
    super();
    this.action = createAsyncThunk(
      name + '/put',
      async ({ values: { id, ...values }, keyApi }: { values: any; keyApi: string }) => {
        const { data } = await API.put({ url: `${routerLinks(keyApi, 'api')}/${id}`, values });
        return data;
      },
    );
    this.pending = (state, action) => {
      state.data = action.meta.arg;
    };
    this.fulfilled = (state, action) => {
      if (action.payload) {
        if (JSON.stringify(state.data) !== JSON.stringify(action.payload)) state.data = action.payload;
        state.isVisible = false;
        state.status = EStatusState.isFulfilled;
      }
    };
  }
}
export class RDelete extends RReducer {
  public constructor(name: string) {
    super();
    this.action = createAsyncThunk(name + '/delete', async ({ id, keyApi }: { id: string; keyApi: string }) => {
      const { data } = await API.delete({ url: `${routerLinks(keyApi, 'api')}/${id}` });
      return data;
    });
    this.fulfilled = state => {
      state.status = EStatusState.isFulfilled;
    };
  }
}
