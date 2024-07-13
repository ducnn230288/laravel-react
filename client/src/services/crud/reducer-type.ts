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
          state.typeIsLoading = true;
          state.typeStatus = EStatusState.idle;
          this.pending(state, action);
        })

        .addCase(this.action.fulfilled, (state, action) => {
          state.typeIsLoading = false;
          this.fulfilled(state, action);
        })

        .addCase(this.action.rejected, (state, action) => {
          state.typeIsLoading = false;
          this.rejected(state, action);
        });
    };
  }
}
export class RGetType extends RReducer {
  public constructor(name: string) {
    super();
    this.action = createAsyncThunk(
      name + '/getType',
      async ({ params, keyApiType }: { params: IPaginationQuery; keyApiType: string }) =>
        await API.get({ url: `${routerLinks(keyApiType, 'api')}`, params }),
    );
    this.pending = (state, action) => {
      state.typeTime = new Date().getTime() + (state.keepUnusedDataFor ?? 60) * 1000;
      const queryParams = JSON.parse(JSON.stringify(action.meta.arg));
      delete queryParams.keyApiType;
      state.typeQueryParams = JSON.stringify(queryParams.params);
    };
    this.fulfilled = (state, action) => {
      if (action.payload.data) {
        state.typeResult = action.payload;
      }
    };
  }
}
export class RGetTypeId extends RReducer {
  public constructor(name: string) {
    super();
    this.action = createAsyncThunk(
      name + '/getByIdType',
      async ({ id, params, keyApiType }: { id: string; params?: IPaginationQuery; keyApiType: string }) => {
        const { data } = await API.get({ url: `${routerLinks(keyApiType, 'api')}/${id}`, params });
        return data;
      },
    );
    this.fulfilled = (state, action) => {
      if (action.payload) {
        if (JSON.stringify(state.typeData) !== JSON.stringify(action.payload)) state.typeData = action.payload;
        state.typeIsVisible = true;
      }
    };
  }
}
export class RPostType extends RReducer {
  public constructor(name: string) {
    super();
    this.action = createAsyncThunk(
      name + '/postType',
      async ({ values, keyApiType }: { values: any; keyApiType: string }) => {
        const { data } = await API.post({ url: `${routerLinks(keyApiType, 'api')}`, values });
        return data;
      },
    );
    this.pending = (state, action) => {
      state.typeData = action.meta.arg;
    };
    this.fulfilled = (state, action) => {
      if (action.payload) {
        if (JSON.stringify(state.typeData) !== JSON.stringify(action.payload)) state.typeData = action.payload;
        state.typeIsVisible = false;
        state.typeStatus = EStatusState.isFulfilled;
      }
    };
  }
}
export class RPutType extends RReducer {
  public constructor(name: string) {
    super();
    this.action = createAsyncThunk(
      name + '/putType',
      async ({ values: { id, ...values }, keyApiType }: { values: any; keyApiType: string }) => {
        const { data } = await API.put({ url: `${routerLinks(keyApiType, 'api')}/${id}`, values });
        return data;
      },
    );
    this.pending = (state, action) => {
      state.typeData = action.meta.arg;
    };
    this.fulfilled = (state, action) => {
      if (action.payload) {
        if (JSON.stringify(state.typeData) !== JSON.stringify(action.payload)) state.typeData = action.payload;
        state.typeIsVisible = false;
        state.typeStatus = EStatusState.isFulfilled;
      }
    };
  }
}
export class RDeleteType extends RReducer {
  public constructor(name: string) {
    super();
    this.action = createAsyncThunk(
      name + '/deleteType',
      async ({ id, keyApiType }: { id: string; keyApiType: string }) => {
        const { data } = await API.delete({ url: `${routerLinks(keyApiType, 'api')}/${id}` });
        return data;
      },
    );
    this.fulfilled = state => {
      state.typeStatus = EStatusState.isFulfilled;
    };
  }
}
