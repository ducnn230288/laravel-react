import { createSlice } from '@reduxjs/toolkit';

import { PaginationQuery } from '@/models';
import { useAppDispatch, useTypedSelector, Action, Slice, State, User } from '@/services';

const name = 'User';
export const action = {
  ...new Action<User>(name),
};
export const userSlice = createSlice(new Slice<User>(action));

export const UserService = () => {
  const dispatch = useAppDispatch();
  return {
    ...(useTypedSelector((state) => state[action.name]) as State<User>),
    set: (values: State<User>) => dispatch(action.set(values)),
    get: (params: PaginationQuery<User>) => dispatch(action.get(params)),
    getById: ({
      id,
      keyState = 'isVisible',
      params,
    }: {
      id: string;
      keyState?: keyof State<User>;
      params?: PaginationQuery<User>;
    }) => dispatch(action.getById({ id, keyState, params })),
    post: (values: User) => dispatch(action.post(values)),
    put: (values: User) => dispatch(action.put(values)),
    delete: (id: string) => dispatch(action.delete(id)),
  };
};
