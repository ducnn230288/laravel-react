import { EStatusState } from '@/enums';
import type { IPaginationQuery, IResponses } from '@/types';
import { API, routerLinks } from '@/utils';
import { createAsyncThunk, type ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { nameCrud, type StateCrud } from './state';

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
class Get extends RReducer {
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
      state.result = action.payload;
    };
  }
}
class GetId extends RReducer {
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
      if (JSON.stringify(state.data) !== JSON.stringify(action.payload)) state.data = action.payload;
      state.isVisible = true;
    };
  }
}
class Post extends RReducer {
  public constructor(name: string) {
    super();
    this.action = createAsyncThunk(name + '/post', async ({ values, keyApi }: { values: any; keyApi: string }) => {
      const { data } = await API.post({ url: `${routerLinks(keyApi, 'api')}`, values });
      return data;
    });
    this.pending = (state, action) => {
      state.data = action.meta.arg.values;
    };
    this.fulfilled = (state, action) => {
      if (JSON.stringify(state.data) !== JSON.stringify(action.payload)) state.data = action.payload;
      state.isVisible = false;
      state.status = EStatusState.isFulfilled;
    };
  }
}
class Put extends RReducer {
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
      state.data = action.meta.arg.values;
    };
    this.fulfilled = (state, action) => {
      if (JSON.stringify(state.data) !== JSON.stringify(action.payload)) state.data = action.payload;
      state.isVisible = false;
      state.status = EStatusState.isFulfilled;
    };
  }
}
class Delete extends RReducer {
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
export const RCurd = {
  get: new Get(nameCrud),
  getId: new GetId(nameCrud),
  post: new Post(nameCrud),
  put: new Put(nameCrud),
  delete: new Delete(nameCrud),
};

export interface CurdState<T> {
  isLoading?: boolean;
  status?: EStatusState;
  time?: number;
  keepUnusedDataFor?: number;
  queryParams?: string;
  result?: IResponses<T[]>;
  data?: T;
  isVisible?: boolean;
}
