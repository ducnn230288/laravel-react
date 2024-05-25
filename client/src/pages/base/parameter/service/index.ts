import { createSlice } from '@reduxjs/toolkit';

import { useAppDispatch, useTypedSelector, Action, Slice, State } from '@/services';
import { ICommonEntity, IPaginationQuery } from '@/interfaces';

const name = 'Parameter';
const action = new Action<IParameter>(name);
export const parameterSlice = createSlice(new Slice<IParameter>(action));
export const SParameter = () => {
  const dispatch = useAppDispatch();
  return {
    ...useTypedSelector((state) => state[action.name] as State<IParameter>),
    set: (values: State<IParameter>) => dispatch(action.set(values)),
    get: (params: IPaginationQuery<IParameter>) => dispatch(action.get(params)),
    getById: ({
      id,
      keyState = 'isVisible',
      params,
    }: {
      id: string;
      keyState?: keyof State<IParameter>;
      params?: IPaginationQuery<IParameter>;
    }) => dispatch(action.getById({ id, keyState, params })),
    post: (values: IParameter) => dispatch(action.post(values)),
    put: (values: IParameter) => dispatch(action.put(values)),
    delete: (id: string) => dispatch(action.delete(id)),
  };
};
export interface IParameter extends ICommonEntity {
  code?: string;
  vn?: string;
  en?: string;
  updatedAt?: string;
}
