import { createSlice } from '@reduxjs/toolkit';

import { IPaginationQuery } from '@/types';
import { useAppDispatch, useTypedSelector, Action, Slice, State, IUser } from '@/services';

const name = 'User';
export const action = {
  ...new Action<IUser>(name),
};
export const userSlice = createSlice(new Slice<IUser>(action));

export const SUser = () => {
  const dispatch = useAppDispatch();
  return {
    ...(useTypedSelector(state => state[action.name]) as State<IUser>),
    set: (values: State<IUser>) => dispatch(action.set(values)),
    get: (params: IPaginationQuery<IUser>) => dispatch(action.get(params)),
    getById: ({
      id,
      keyState = 'isVisible',
      params,
    }: {
      id: string;
      keyState?: keyof State<IUser>;
      params?: IPaginationQuery<IUser>;
    }) => dispatch(action.getById({ id, keyState, params })),
    post: (values: IUser) => dispatch(action.post(values)),
    put: (values: IUser) => dispatch(action.put(values)),
    delete: (id: string) => dispatch(action.delete(id)),
  };
};
