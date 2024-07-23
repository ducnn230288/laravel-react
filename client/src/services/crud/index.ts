import { createSlice, type ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { useAppDispatch, useTypedSelector } from '@/services';
import type { IPaginationQuery } from '@/types';
import { RCurd } from './reducer';
import { RCurdType } from './reducer-type';
import { initialStateCrud, nameCrud, type StateCrud } from './state';

export const crudSlice = createSlice({
  name: nameCrud,
  initialState: initialStateCrud,
  reducers: {
    set: (state, action) => {
      Object.keys(action.payload).forEach(key => {
        state[key] = action.payload[key as keyof StateCrud];
      });
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<StateCrud>) => {
    RCurd.get.reducer(builder);
    RCurd.getId.reducer(builder);
    RCurd.post.reducer(builder);
    RCurd.put.reducer(builder);
    RCurd.delete.reducer(builder);

    RCurdType.get.reducer(builder);
    RCurdType.getId.reducer(builder);
    RCurdType.post.reducer(builder);
    RCurdType.put.reducer(builder);
    RCurdType.delete.reducer(builder);
  },
});

export const SCrud = <T, Y = object>(keyApi: string, keyApiType?: string) => {
  const dispatch = useAppDispatch();
  return {
    ...(useTypedSelector(state => state[nameCrud]) as StateCrud<T, Y>),
    set: (values: StateCrud<T>) => dispatch(crudSlice.actions.set(values as StateCrud)),
    reset: () => dispatch(crudSlice.actions.set(initialStateCrud)),

    get: (params: IPaginationQuery<T>) => dispatch(RCurd.get.action({ params: params as IPaginationQuery, keyApi })),
    getById: ({ id, params }: { id: string; params?: IPaginationQuery<T> }) =>
      dispatch(RCurd.getId.action({ id, params: params as IPaginationQuery, keyApi })),
    post: (values: T) => dispatch(RCurd.post.action({ values: values as StateCrud, keyApi })),
    put: (values: T) => dispatch(RCurd.put.action({ values: values as StateCrud, keyApi })),
    delete: (id: string) => dispatch(RCurd.delete.action({ id, keyApi })),

    getType: (params: IPaginationQuery<Y>) =>
      dispatch(RCurdType.get.action({ params: params as IPaginationQuery, keyApiType })),
    getByIdType: ({ id, params }: { id: string; params?: IPaginationQuery<Y> }) =>
      dispatch(RCurdType.getId.action({ id, params: params as IPaginationQuery, keyApiType })),
    postType: (values: Y) => dispatch(RCurdType.post.action({ values: values as StateCrud, keyApiType })),
    putType: (values: Y) => dispatch(RCurdType.put.action({ values: values as StateCrud, keyApiType })),
    deleteType: (id: string) => dispatch(RCurdType.delete.action({ id, keyApiType })),
  };
};
