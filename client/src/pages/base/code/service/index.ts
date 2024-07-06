import { createSlice } from '@reduxjs/toolkit';

import { Action, Slice, useAppDispatch, useTypedSelector, type IUser, type State } from '@/services';
import type { ICommonEntity, IPaginationQuery } from '@/types';
import type { ICodeType } from './type';

const name = 'Code';
const action = new Action<ICode>(name);
export const codeSlice = createSlice(new Slice<ICode>(action));
export const SCode = () => {
  const dispatch = useAppDispatch();
  return {
    ...useTypedSelector(state => state[action.name] as State<ICode>),
    set: (values: State<ICode>) => dispatch(action.set(values)),
    get: (params: IPaginationQuery<ICode>) => dispatch(action.get(params)),
    getById: ({
      id,
      keyState = 'isVisible',
      params,
    }: {
      id: string;
      keyState?: keyof State<ICode>;
      params?: IPaginationQuery<ICode>;
    }) => dispatch(action.getById({ id, keyState, params })),
    post: (values: ICode) => dispatch(action.post(values)),
    put: (values: ICode) => dispatch(action.put(values)),
    delete: (id: string) => dispatch(action.delete(id)),
  };
};
export interface ICode extends ICommonEntity {
  code?: string;
  type?: string;
  name?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  item?: ICodeType;
  users?: IUser[];
}
