import { createSlice, type ActionReducerMapBuilder } from '@reduxjs/toolkit';

import type { EStatusState } from '@/enums';
import { useAppDispatch, useTypedSelector } from '@/services';
import type { IPaginationQuery, IResponses } from '@/types';
import { RDelete, RGet, RGetId, RPost, RPut } from './reducer';
import { RDeleteType, RGetType, RGetTypeId, RPostType, RPutType } from './reducer-type';
import { initialStateCrud, type StateCrud } from './state';

const name = 'crud';
const rGet = new RGet(name);
const rGetId = new RGetId(name);
const rPost = new RPost(name);
const rPut = new RPut(name);
const rDelete = new RDelete(name);

const rGetType = new RGetType(name);
const rGetTypeId = new RGetTypeId(name);
const rPostType = new RPostType(name);
const rPutType = new RPutType(name);
const rDeleteType = new RDeleteType(name);
export const crudSlice = createSlice({
  name,
  initialState: initialStateCrud,
  reducers: {
    set: (state, action) => {
      Object.keys(action.payload).forEach(key => {
        state[key] = action.payload[key as keyof StateCrud];
      });
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<StateCrud>) => {
    rGet.reducer(builder);
    rGetId.reducer(builder);
    rPost.reducer(builder);
    rPut.reducer(builder);
    rDelete.reducer(builder);

    rGetType.reducer(builder);
    rGetTypeId.reducer(builder);
    rPostType.reducer(builder);
    rPutType.reducer(builder);
    rDeleteType.reducer(builder);
  },
});

export class SCrud<T, Y = object> {
  public set: (values: StateCrud<T>) => any;
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
  public getById: (value: { id: string; keyState?: keyof StateCrud<T>; params?: IPaginationQuery<T> }) => any;
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
  public getByIdType: (value: { id: string; keyState?: keyof StateCrud<Y>; params?: IPaginationQuery<Y> }) => any;
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
    } = useTypedSelector(state => state[name] as StateCrud<T, Y>);
    this.result = result;
    this.data = data;
    this.isLoading = isLoading;
    this.isVisible = isVisible;
    this.status = status;
    this.queryParams = queryParams;
    this.keepUnusedDataFor = keepUnusedDataFor;
    this.time = time;

    const dispatch = useAppDispatch();
    this.set = (values: StateCrud<T>) => dispatch(crudSlice.actions.set(values as StateCrud));
    this.reset = () => dispatch(crudSlice.actions.set(initialStateCrud));

    this.get = (params: IPaginationQuery<T>) => dispatch(rGet.action({ params: params as IPaginationQuery, keyApi }));
    this.getById = ({ id, params }: { id: string; params?: IPaginationQuery<T> }) =>
      dispatch(rGetId.action({ id, params: params as IPaginationQuery, keyApi }));
    this.post = (values: T) => dispatch(rPost.action({ values: values as StateCrud, keyApi }));
    this.put = (values: T) => dispatch(rPut.action({ values: values as StateCrud, keyApi }));
    this.delete = (id: string) => dispatch(rDelete.action({ id, keyApi }));

    this.typeResult = typeResult;
    this.typeData = typeData;
    this.typeIsLoading = typeIsLoading;
    this.typeIsVisible = typeIsVisible;
    this.typeStatus = typeStatus;
    this.typeQueryParams = typeQueryParams;
    this.typeKeepUnusedDataFor = typeKeepUnusedDataFor;
    this.typeTime = typeTime;
    this.getType = (params: IPaginationQuery<Y>) =>
      dispatch(rGetType.action({ params: params as IPaginationQuery, keyApiType }));
    this.getByIdType = ({ id, params }: { id: string; params?: IPaginationQuery<Y> }) =>
      dispatch(rGetTypeId.action({ id, params: params as IPaginationQuery, keyApiType }));
    this.postType = (values: Y) => dispatch(rPostType.action({ values: values as StateCrud, keyApiType }));
    this.putType = (values: Y) => dispatch(rPutType.action({ values: values as StateCrud, keyApiType }));
    this.deleteType = (id: string) => dispatch(rDeleteType.action({ id, keyApiType }));
  }
}
