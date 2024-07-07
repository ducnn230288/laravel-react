import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { crudSlice, globalSlice } from './';
const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};
const useAppDispatch = () => useDispatch<ReturnType<typeof setupStore>['dispatch']>();
const useTypedSelector: TypedUseSelectorHook<ReturnType<typeof rootReducer>> = useSelector;
export { setupStore, useAppDispatch, useTypedSelector };

export * from './crud';
export * from './global';
const rootReducer = combineReducers({
  [globalSlice.name]: globalSlice.reducer,
  [crudSlice.name]: crudSlice.reducer,
});
