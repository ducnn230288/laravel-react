import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { Action } from './action';
import { Slice, State } from './slice';
const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};
const useAppDispatch = () => useDispatch<ReturnType<typeof setupStore>['dispatch']>();
const useTypedSelector: TypedUseSelectorHook<ReturnType<typeof rootReducer>> = useSelector;
export { setupStore, useAppDispatch, useTypedSelector, Action, Slice };
export type { State };

export * from './global';
export * from '@/pages/base/user/service';
export * from '@/pages/base/user/service/role';
export * from '@/pages/base/code/service';
export * from '@/pages/base/code/service/type';
export * from '@/pages/base/content/service';
export * from '@/pages/base/content/service/type';
export * from '@/pages/base/parameter/service';
export * from '@/pages/base/post/service';
export * from '@/pages/base/post/service/type';
import {
  globalSlice,
  userSlice,
  userRoleSlice,
  codeSlice,
  codeTypeSlice,
  contentSlice,
  contentTypeSlice,
  postSlice,
  postTypeSlice,
  parameterSlice,
} from './';
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
