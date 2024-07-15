import { createSlice, type ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { useAppDispatch, useTypedSelector } from '@/services';
import type { IPaginationQuery } from '@/types';
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

export const SCrud = <T, Y = object>(keyApi: string, keyApiType: string = '') => {
  const dispatch = useAppDispatch();
  return {
    ...(useTypedSelector(state => state[name]) as StateCrud<T, Y>),
    set: (values: StateCrud<T>) => dispatch(crudSlice.actions.set(values as StateCrud)),
    reset: () => dispatch(crudSlice.actions.set(initialStateCrud)),

    get: (params: IPaginationQuery<T>) => dispatch(rGet.action({ params: params as IPaginationQuery, keyApi })),
    getById: ({ id, params }: { id: string; params?: IPaginationQuery<T> }) =>
      dispatch(rGetId.action({ id, params: params as IPaginationQuery, keyApi })),
    post: (values: T) => dispatch(rPost.action({ values: values as StateCrud, keyApi })),
    put: (values: T) => dispatch(rPut.action({ values: values as StateCrud, keyApi })),
    delete: (id: string) => dispatch(rDelete.action({ id, keyApi })),

    getType: (params: IPaginationQuery<Y>) =>
      dispatch(rGetType.action({ params: params as IPaginationQuery, keyApiType })),
    getByIdType: ({ id, params }: { id: string; params?: IPaginationQuery<Y> }) =>
      dispatch(rGetTypeId.action({ id, params: params as IPaginationQuery, keyApiType })),
    postType: (values: Y) => dispatch(rPostType.action({ values: values as StateCrud, keyApiType })),
    putType: (values: Y) => dispatch(rPutType.action({ values: values as StateCrud, keyApiType })),
    deleteType: (id: string) => dispatch(rDeleteType.action({ id, keyApiType })),
  };
};
