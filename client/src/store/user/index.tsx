import { createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useTypedSelector, Action, Slice, State, User } from '@store';
import { PaginationQuery } from '@models';

const name = 'User';
export const action = {
  ...new Action<User>(name),
};
export const userSlice = createSlice(new Slice<User>(action));

export const UserFacade = () => {
  const dispatch = useAppDispatch();
  return {
    ...(useTypedSelector((state) => state[action.name]) as State<User>),
    set: (values: State<User>) => dispatch(action.set(values)),
    get: (params: PaginationQuery<User>) => dispatch(action.get(params)),
    getById: ({ id, keyState = 'isVisible', params }: { id: string; keyState?: keyof State<User>, params?: PaginationQuery<User> }) =>
      dispatch(action.getById({ id, keyState, params })),
    post: (values: User) => dispatch(action.post(values)),
    put: (values: User) => dispatch(action.put(values)),
    delete: (id: string) => dispatch(action.delete(id)),
  };
};
