import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { ICommonEntity, IPaginationQuery, IResponses } from '@/interfaces';
import { useAppDispatch, useTypedSelector, Action, Slice, State, IUser } from '@/services';
import { API, routerLinks } from '@/utils';

const name = 'UserRole';
const action = {
  ...new Action<IUserRole>(name),
  getPermission: createAsyncThunk(name + '/permission', async () =>
    API.get<IResponses<string[]>>({url: `${routerLinks(name, 'api')}/permission`}),
  ),
};
export const userRoleSlice = createSlice(new Slice<IUserRole>(action, { keepUnusedDataFor: 9999 }));
export const SUserRole = () => {
  const dispatch = useAppDispatch();
  return {
    ...useTypedSelector((state) => state[action.name] as State<IUserRole>),
    set: (values: State<IUserRole>) => dispatch(action.set(values)),
    get: (params: IPaginationQuery<IUserRole>) => dispatch(action.get(params)),
    getById: ({
      id,
      keyState = 'isVisible',
      params,
    }: {
      id: string;
      keyState?: keyof State<IUserRole>;
      params?: IPaginationQuery<IUserRole>;
    }) => dispatch(action.getById({ id, keyState, params })),
    post: (values: IUserRole) => dispatch(action.post(values)),
    put: (values: IUserRole) => dispatch(action.put(values)),
    delete: (id: string) => dispatch(action.delete(id)),
    getPermission: () => dispatch(action.getPermission()),
  };
};
export interface IUserRole extends ICommonEntity {
  name?: string;
  code?: string;
  isSystemAdmin?: boolean;
  permissions?: string[];
  users?: IUser[];
  createdAt?: string;
  updatedAt?: string;
}
