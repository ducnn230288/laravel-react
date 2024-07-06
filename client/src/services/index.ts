import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import {
  codeSlice,
  codeTypeSlice,
  contentSlice,
  contentTypeSlice,
  globalSlice,
  parameterSlice,
  postSlice,
  postTypeSlice,
  userRoleSlice,
  userSlice,
} from './';
import { Action } from './action';
import { Slice, type State } from './slice';
const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};
const useAppDispatch = () => useDispatch<ReturnType<typeof setupStore>['dispatch']>();
const useTypedSelector: TypedUseSelectorHook<ReturnType<typeof rootReducer>> = useSelector;
export { Action, setupStore, Slice, useAppDispatch, useTypedSelector };
export type { State };

export * from '@/pages/base/code/service';
export * from '@/pages/base/code/service/type';
export * from '@/pages/base/content/service';
export * from '@/pages/base/content/service/type';
export * from '@/pages/base/parameter/service';
export * from '@/pages/base/post/service';
export * from '@/pages/base/post/service/type';
export * from '@/pages/base/user/service';
export * from '@/pages/base/user/service/role';
export * from './global';
const rootReducer = combineReducers({
  [globalSlice.name]: globalSlice.reducer,
  [userSlice.name]: userSlice.reducer,
  [userRoleSlice.name]: userRoleSlice.reducer,
  [codeSlice.name]: codeSlice.reducer,
  [codeTypeSlice.name]: codeTypeSlice.reducer,
  [contentSlice.name]: contentSlice.reducer,
  [contentTypeSlice.name]: contentTypeSlice.reducer,
  [parameterSlice.name]: parameterSlice.reducer,
  [postSlice.name]: postSlice.reducer,
  [postTypeSlice.name]: postTypeSlice.reducer,
});
