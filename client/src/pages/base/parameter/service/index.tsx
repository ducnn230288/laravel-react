import { createSlice } from '@reduxjs/toolkit';

import { useAppDispatch, useTypedSelector, Action, Slice, State } from '@/services';
import { CommonEntity, PaginationQuery } from '@/models';

const name = 'Parameter';
const action = new Action<Parameter>(name);
export const parameterSlice = createSlice(new Slice<Parameter>(action));
export const ParameterService = () => {
  const dispatch = useAppDispatch();
  return {
    ...useTypedSelector((state) => state[action.name] as State<Parameter>),
    set: (values: State<Parameter>) => dispatch(action.set(values)),
    get: (params: PaginationQuery<Parameter>) => dispatch(action.get(params)),
    getById: ({
      id,
      keyState = 'isVisible',
      params,
    }: {
      id: string;
      keyState?: keyof State<Parameter>;
      params?: PaginationQuery<Parameter>;
    }) => dispatch(action.getById({ id, keyState, params })),
    post: (values: Parameter) => dispatch(action.post(values)),
    put: (values: Parameter) => dispatch(action.put(values)),
    delete: (id: string) => dispatch(action.delete(id)),
  };
};
export class Parameter extends CommonEntity {
  constructor(
    public code?: string,
    public vn?: string,
    public en?: string,
    public updatedAt?: string,
  ) {
    super();
  }
}
