import { createAsyncThunk, createSlice, type ActionReducerMapBuilder, type Draft } from '@reduxjs/toolkit';

import { EStatusState } from '@/enums';
import { useAppDispatch, useTypedSelector } from '@/services';
import type { IPaginationQuery, IResponses } from '@/types';
import { API, routerLinks } from '@/utils';

interface State<T = object, Y = object> {
  result?: IResponses<T[]>;
  data?: T;
  isLoading?: boolean;
  isVisible?: boolean;
  status?: EStatusState;
  queryParams?: string;
  keepUnusedDataFor?: number;
  time?: number;

  typeResult?: IResponses<Y[]>;
  typeData?: Y;
  typeIsLoading?: boolean;
  typeIsVisible?: boolean;
  typeStatus?: EStatusState;
  typeQueryParams?: string;
  typeKeepUnusedDataFor?: number;
  typeTime?: number;
}

const name = 'crud';
const action = {
  name,
  set: createAsyncThunk(name + '/set', async (values: State) => values),
  get: createAsyncThunk(
    name + '/get',
    async ({ params, keyApi }: { params: IPaginationQuery; keyApi: string }) =>
      await API.get({ url: `${routerLinks(keyApi, 'api')}`, params }),
  ),
  getById: createAsyncThunk(
    name + '/getById',
    async ({ id, params, keyApi }: { id: string; params?: IPaginationQuery; keyApi: string }) => {
      const { data } = await API.get({ url: `${routerLinks(keyApi, 'api')}/${id}`, params });
      return data;
    },
  ),
  post: createAsyncThunk(name + '/post', async ({ values, keyApi }: { values: any; keyApi: string }) => {
    const { data } = await API.post({ url: `${routerLinks(keyApi, 'api')}`, values });
    return data;
  }),
  put: createAsyncThunk(
    name + '/put',
    async ({ values: { id, ...values }, keyApi }: { values: any; keyApi: string }) => {
      const { data } = await API.put({ url: `${routerLinks(keyApi, 'api')}/${id}`, values });
      return data;
    },
  ),
  delete: createAsyncThunk(name + '/delete', async ({ id, keyApi }: { id: string; keyApi: string }) => {
    const { data } = await API.delete({ url: `${routerLinks(keyApi, 'api')}/${id}` });
    return data;
  }),
  getType: createAsyncThunk(
    name + '/getType',
    async ({ params, keyApiType }: { params: IPaginationQuery; keyApiType: string }) =>
      await API.get({ url: `${routerLinks(keyApiType, 'api')}`, params }),
  ),
  getByIdType: createAsyncThunk(
    name + '/getByIdType',
    async ({ id, params, keyApiType }: { id: string; params?: IPaginationQuery; keyApiType: string }) => {
      const { data } = await API.get({ url: `${routerLinks(keyApiType, 'api')}/${id}`, params });
      return data;
    },
  ),
  postType: createAsyncThunk(
    name + '/postType',
    async ({ values, keyApiType }: { values: any; keyApiType: string }) => {
      const { data } = await API.post({ url: `${routerLinks(keyApiType, 'api')}`, values });
      return data;
    },
  ),
  putType: createAsyncThunk(
    name + '/putType',
    async ({ values: { id, ...values }, keyApiType }: { values: any; keyApiType: string }) => {
      const { data } = await API.put({ url: `${routerLinks(keyApiType, 'api')}/${id}`, values });
      return data;
    },
  ),
  deleteType: createAsyncThunk(name + '/deleteType', async ({ id, keyApiType }: { id: string; keyApiType: string }) => {
    const { data } = await API.delete({ url: `${routerLinks(keyApiType, 'api')}/${id}` });
    return data;
  }),
};

const initialState = {
  result: undefined,
  data: undefined,
  isLoading: false,
  isVisible: false,
  status: EStatusState.idle,
  queryParams: undefined,
  keepUnusedDataFor: 60,
  time: 0,

  typeResult: undefined,
  typeData: undefined,
  typeIsLoading: false,
  typeIsVisible: false,
  typeStatus: EStatusState.idle,
  typeQueryParams: undefined,
  typeKeepUnusedDataFor: 60,
  typeTime: 0,
};
export const crudSlice = createSlice({
  name,
  initialState,
  reducers: {
    set: (state, action) => {
      Object.keys(action.payload).forEach(key => {
        state[key] = action.payload[key as keyof State];
      });
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<State>) => {
    builder
      .addCase(action.get.pending, (state, action) => {
        state.isLoading = true;
        state.status = EStatusState.getPending;
        state.time = new Date().getTime() + (state.keepUnusedDataFor ?? 60) * 1000;
        const queryParams = JSON.parse(JSON.stringify(action.meta.arg));
        delete queryParams.keyApi;
        state.queryParams = JSON.stringify(queryParams.params);
      })
      .addCase(action.get.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.result = action.payload as Draft<IResponses<any[]>>;
          state.status = EStatusState.getFulfilled;
        } else state.status = EStatusState.idle;
        state.isLoading = false;
      })
      .addCase(action.get.rejected, state => {
        state.status = EStatusState.getRejected;
        state.isLoading = false;
      });

    builder
      .addCase(action.getById.pending, state => {
        state.isLoading = true;
        state.status = EStatusState.getByIdPending;
      })
      .addCase(action.getById.fulfilled, (state, action) => {
        if (action.payload) {
          if (JSON.stringify(state.data) !== JSON.stringify(action.payload)) state.data = action.payload as Draft<any>;
          state.isVisible = true;
          state.status = EStatusState.getByIdFulfilled;
        } else state.status = EStatusState.idle;
        state.isLoading = false;
      })
      .addCase(action.getById.rejected, state => {
        state.status = EStatusState.getByIdRejected;
        state.isLoading = false;
      });

    builder
      .addCase(action.post.pending, (state, action) => {
        state.data = action.meta.arg as Draft<any>;
        state.isLoading = true;
        state.status = EStatusState.postPending;
      })
      .addCase(action.post.fulfilled, (state, action) => {
        if (action.payload) {
          if (JSON.stringify(state.data) !== JSON.stringify(action.payload)) state.data = action.payload as Draft<any>;
          state.isVisible = false;
          state.status = EStatusState.postFulfilled;
        } else state.status = EStatusState.idle;
        state.isLoading = false;
      })
      .addCase(action.post.rejected, state => {
        state.status = EStatusState.postRejected;
        state.isLoading = false;
      });

    builder
      .addCase(action.put.pending, (state, action) => {
        state.data = action.meta.arg as Draft<any>;
        state.isLoading = true;
        state.status = EStatusState.putPending;
      })
      .addCase(action.put.fulfilled, (state, action) => {
        if (action.payload) {
          if (JSON.stringify(state.data) !== JSON.stringify(action.payload)) state.data = action.payload as Draft<any>;
          state.isVisible = false;
          state.status = EStatusState.putFulfilled;
        } else state.status = EStatusState.idle;
        state.isLoading = false;
      })
      .addCase(action.put.rejected, state => {
        state.status = EStatusState.putRejected;
        state.isLoading = false;
      });

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

    builder
      .addCase(action.getType.pending, (state, action) => {
        state.typeIsLoading = true;
        state.typeStatus = EStatusState.getPending;
        state.typeTime = new Date().getTime() + (state.keepUnusedDataFor ?? 60) * 1000;
        const queryParams = JSON.parse(JSON.stringify(action.meta.arg));
        delete queryParams.keyApiType;
        state.typeQueryParams = JSON.stringify(queryParams.params);
      })
      .addCase(action.getType.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.typeResult = action.payload as Draft<IResponses<any[]>>;
          state.typeStatus = EStatusState.getFulfilled;
        } else state.typeStatus = EStatusState.idle;
        state.typeIsLoading = false;
      })
      .addCase(action.getType.rejected, state => {
        state.typeStatus = EStatusState.getRejected;
        state.typeIsLoading = false;
      });

    builder
      .addCase(action.getByIdType.pending, state => {
        state.typeIsLoading = true;
        state.typeStatus = EStatusState.getByIdPending;
      })
      .addCase(action.getByIdType.fulfilled, (state, action) => {
        if (action.payload) {
          if (JSON.stringify(state.typeData) !== JSON.stringify(action.payload))
            state.typeData = action.payload as Draft<any>;
          state.typeIsVisible = true;
          state.typeStatus = EStatusState.getByIdFulfilled;
        } else state.typeStatus = EStatusState.idle;
        state.typeIsLoading = false;
      })
      .addCase(action.getByIdType.rejected, state => {
        state.typeStatus = EStatusState.getByIdRejected;
        state.typeIsLoading = false;
      });

    builder
      .addCase(action.postType.pending, (state, action) => {
        state.typeData = action.meta.arg as Draft<any>;
        state.typeIsLoading = true;
        state.typeStatus = EStatusState.postPending;
      })
      .addCase(action.postType.fulfilled, (state, action) => {
        if (action.payload) {
          if (JSON.stringify(state.typeData) !== JSON.stringify(action.payload))
            state.typeData = action.payload as Draft<any>;
          state.typeIsVisible = false;
          state.typeStatus = EStatusState.postFulfilled;
        } else state.typeStatus = EStatusState.idle;
        state.typeIsLoading = false;
      })
      .addCase(action.postType.rejected, state => {
        state.typeStatus = EStatusState.postRejected;
        state.typeIsLoading = false;
      });

    builder
      .addCase(action.putType.pending, (state, action) => {
        state.typeData = action.meta.arg as Draft<any>;
        state.typeIsLoading = true;
        state.typeStatus = EStatusState.putPending;
      })
      .addCase(action.putType.fulfilled, (state, action) => {
        if (action.payload) {
          if (JSON.stringify(state.typeData) !== JSON.stringify(action.payload))
            state.typeData = action.payload as Draft<any>;
          state.typeIsVisible = false;
          state.typeStatus = EStatusState.putFulfilled;
        } else state.typeStatus = EStatusState.idle;
        state.typeIsLoading = false;
      })
      .addCase(action.putType.rejected, state => {
        state.typeStatus = EStatusState.putRejected;
        state.typeIsLoading = false;
      });

    builder
      .addCase(action.deleteType.pending, state => {
        state.typeIsLoading = true;
        state.typeStatus = EStatusState.deletePending;
      })
      .addCase(action.deleteType.fulfilled, state => {
        state.typeStatus = EStatusState.deleteFulfilled;
        state.typeIsLoading = false;
      })
      .addCase(action.deleteType.rejected, state => {
        state.typeStatus = EStatusState.deleteRejected;
        state.typeIsLoading = false;
      });
  },
});
export class SCrud<T, Y = object> {
  public set: (values: State<T>) => any;
  public reset: () => any;

  public result?: IResponses<T[]>;
  public data?: T;
  public isLoading?: boolean;
  public isVisible?: boolean;
  public status?: EStatusState;
  public queryParams?: string;
  public keepUnusedDataFor?: number;
  public time?: number;
  public get: (params: IPaginationQuery<T>) => any;
  public getById: (value: { id: string; keyState?: keyof State<T>; params?: IPaginationQuery<T> }) => any;
  public post: (values: T) => any;
  public put: (values: T) => any;
  public delete: (id: string) => any;

  public typeResult?: IResponses<Y[]>;
  public typeData?: Y;
  public typeIsLoading?: boolean;
  public typeIsVisible?: boolean;
  public typeStatus?: EStatusState;
  public typeQueryParams?: string;
  public typeKeepUnusedDataFor?: number;
  public typeTime?: number;
  public getType: (params: IPaginationQuery<Y>) => any;
  public getByIdType: (value: { id: string; keyState?: keyof State<Y>; params?: IPaginationQuery<Y> }) => any;
  public postType: (values: Y) => any;
  public putType: (values: Y) => any;
  public deleteType: (id: string) => any;
  public constructor(keyApi: string, keyApiType: string = '') {
    const {
      result,
      data,
      isLoading,
      isVisible,
      status,
      queryParams,
      keepUnusedDataFor,
      time,
      typeResult,
      typeData,
      typeIsLoading,
      typeIsVisible,
      typeStatus,
      typeQueryParams,
      typeKeepUnusedDataFor,
      typeTime,
    } = useTypedSelector(state => state[action.name] as State<T, Y>);
    this.result = result;
    this.data = data;
    this.isLoading = isLoading;
    this.isVisible = isVisible;
    this.status = status;
    this.queryParams = queryParams;
    this.keepUnusedDataFor = keepUnusedDataFor;
    this.time = time;

    const dispatch = useAppDispatch();
    this.set = (values: State<T>) => dispatch(crudSlice.actions.set(values as State));
    this.reset = () => dispatch(crudSlice.actions.set(initialState as State));

    this.get = (params: IPaginationQuery<T>) => dispatch(action.get({ params: params as IPaginationQuery, keyApi }));
    this.getById = ({ id, params }: { id: string; params?: IPaginationQuery<T> }) =>
      dispatch(action.getById({ id, params: params as IPaginationQuery, keyApi }));
    this.post = (values: T) => dispatch(action.post({ values: values as State, keyApi }));
    this.put = (values: T) => dispatch(action.put({ values: values as State, keyApi }));
    this.delete = (id: string) => dispatch(action.delete({ id, keyApi }));

    this.typeResult = typeResult;
    this.typeData = typeData;
    this.typeIsLoading = typeIsLoading;
    this.typeIsVisible = typeIsVisible;
    this.typeStatus = typeStatus;
    this.typeQueryParams = typeQueryParams;
    this.typeKeepUnusedDataFor = typeKeepUnusedDataFor;
    this.typeTime = typeTime;
    this.getType = (params: IPaginationQuery<Y>) =>
      dispatch(action.getType({ params: params as IPaginationQuery, keyApiType }));
    this.getByIdType = ({ id, params }: { id: string; params?: IPaginationQuery<Y> }) =>
      dispatch(action.getByIdType({ id, params: params as IPaginationQuery, keyApiType }));
    this.postType = (values: Y) => dispatch(action.postType({ values: values as State, keyApiType }));
    this.putType = (values: Y) => dispatch(action.putType({ values: values as State, keyApiType }));
    this.deleteType = (id: string) => dispatch(action.deleteType({ id, keyApiType }));
  }
}
