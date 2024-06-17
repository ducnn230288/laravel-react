import { ActionReducerMapBuilder, Draft } from '@reduxjs/toolkit';

import { EStatusState } from '@/enums';
import { ICommonEntity, IResponses } from '@/types';
import { Action } from '@/services/index';

export class Slice<T extends ICommonEntity, S = EStatusState> {
  name: string;
  initialState: State<T, S>;
  reducers: any;
  extraReducers: (builder: any) => void;
  defaultState: State<T, S> = {
    result: undefined,
    data: undefined,
    isLoading: true,
    isVisible: false,
    reRender: false,
    status: EStatusState.idle,
    queryParams: undefined,
    keepUnusedDataFor: 60,
    time: 0,
  };
  constructor(
    action: Action<T, S>,
    initialState: State<T, S> = {},
    extraReducers?: (builder: ActionReducerMapBuilder<State<T, S>>) => void,
  ) {
    this.name = action.name;
    this.initialState = { ...this.defaultState, ...initialState };
    this.reducers = {};
    this.extraReducers = (builder: ActionReducerMapBuilder<State<T, S>>) => {
      this.set(action, builder);
      this.get(action, builder);
      this.getById(action, builder);
      this.post(action, builder);
      this.put(action, builder);
      this.delete(action, builder);
      extraReducers && extraReducers(builder);
    };
  }
  set(action: Action<T, S>, builder: ActionReducerMapBuilder<State<T, S>>) {
    builder.addCase(action.set.fulfilled, (state, action) => {
      Object.keys(action.payload).forEach(key => {
        state[key] = action.payload[key as keyof State<T, S>];
      });
      state.status = EStatusState.idle;
    });
  }
  get(action: Action<T, S>, builder: ActionReducerMapBuilder<State<T, S>>) {
    builder
      .addCase(action.get.pending, (state, action) => {
        if (!state.isLoading) {
          state.isLoading = true;
          state.status = EStatusState.getPending;
        }
        this.defaultState.time = new Date().getTime() + (state.keepUnusedDataFor || 60) * 1000;
        this.defaultState.queryParams = JSON.stringify(action.meta.arg);
      })
      .addCase(action.get.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.result = action.payload as Draft<IResponses<T[]>>;
          state.status = EStatusState.getFulfilled;
        } else state.status = EStatusState.idle;
        state.time = this.defaultState.time;
        state.queryParams = this.defaultState.queryParams;
        state.isLoading = false;
      })
      .addCase(action.get.rejected, state => {
        state.status = EStatusState.getRejected;
        state.time = this.defaultState.time;
        state.queryParams = this.defaultState.queryParams;
        state.isLoading = false;
      });
  }
  getById(action: Action<T, S>, builder: ActionReducerMapBuilder<State<T, S>>) {
    builder
      .addCase(action.getById.pending, state => {
        state.isLoading = true;
        state.status = EStatusState.getByIdPending;
      })
      .addCase(action.getById.fulfilled, (state, action) => {
        if (action.payload) {
          const { data, keyState } = action.payload;
          if (JSON.stringify(state.data) !== JSON.stringify(data)) state.data = data as Draft<T>;
          state[keyState] = true;
          state.status = EStatusState.getByIdFulfilled;
        } else state.status = EStatusState.idle;
        state.isLoading = false;
      })
      .addCase(action.getById.rejected, state => {
        state.status = EStatusState.getByIdRejected;
        state.isLoading = false;
      });
  }
  post(action: Action<T, S>, builder: ActionReducerMapBuilder<State<T, S>>) {
    builder
      .addCase(action.post.pending, (state, action) => {
        state.data = action.meta.arg as Draft<T>;
        state.isLoading = true;
        state.status = EStatusState.postPending;
      })
      .addCase(action.post.fulfilled, (state, action) => {
        if (action.payload) {
          if (JSON.stringify(state.data) !== JSON.stringify(action.payload)) state.data = action.payload as Draft<T>;
          state.isVisible = false;
          state.status = EStatusState.postFulfilled;
        } else state.status = EStatusState.idle;
        state.isLoading = false;
      })
      .addCase(action.post.rejected, state => {
        state.status = EStatusState.postRejected;
        state.isLoading = false;
      });
  }
  put(action: Action<T, S>, builder: ActionReducerMapBuilder<State<T, S>>) {
    builder
      .addCase(action.put.pending, (state, action) => {
        state.data = action.meta.arg as Draft<T>;
        state.isLoading = true;
        state.status = EStatusState.putPending;
      })
      .addCase(action.put.fulfilled, (state, action) => {
        if (action.payload) {
          if (JSON.stringify(state.data) !== JSON.stringify(action.payload)) state.data = action.payload as Draft<T>;
          state.isVisible = false;
          state.status = EStatusState.putFulfilled;
        } else state.status = EStatusState.idle;
        state.isLoading = false;
      })
      .addCase(action.put.rejected, state => {
        state.status = EStatusState.putRejected;
        state.isLoading = false;
      });
  }
  delete(action: Action<T, S>, builder: ActionReducerMapBuilder<State<T, S>>) {
    builder
      .addCase(action.delete.pending, state => {
        state.isLoading = true;
        state.status = EStatusState.deletePending;
      })
      .addCase(action.delete.fulfilled, state => {
        state.status = EStatusState.deleteFulfilled;
        state.isLoading = false;
      })
      .addCase(action.delete.rejected, state => {
        state.status = EStatusState.deleteRejected;
        state.isLoading = false;
      });
  }
}
export interface State<T = object, Y = EStatusState> {
  [selector: string]: any;
  result?: IResponses<T[]>;
  data?: T;
  isLoading?: boolean;
  isVisible?: boolean;
  reRender?: boolean;
  status?: EStatusState | Y;
  queryParams?: string;
  keepUnusedDataFor?: number;
  time?: number;
}
