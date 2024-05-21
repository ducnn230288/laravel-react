import { createSlice } from '@reduxjs/toolkit';

import { useAppDispatch, useTypedSelector, Action, Slice, State, User } from '@/services';
import { CommonEntity, PaginationQuery } from '@/models';
import { CodeType } from './type';

const name = 'Code';
const action = new Action<Code>(name);
export const codeSlice = createSlice(new Slice<Code>(action));
export const CodeService = () => {
  const dispatch = useAppDispatch();
  return {
    ...useTypedSelector((state) => state[action.name] as State<Code>),
    set: (values: State<Code>) => dispatch(action.set(values)),
    get: (params: PaginationQuery<Code>) => dispatch(action.get(params)),
    getById: ({
      id,
      keyState = 'isVisible',
      params,
    }: {
      id: string;
      keyState?: keyof State<Code>;
      params?: PaginationQuery<Code>;
    }) => dispatch(action.getById({ id, keyState, params })),
    post: (values: Code) => dispatch(action.post(values)),
    put: (values: Code) => dispatch(action.put(values)),
    delete: (id: string) => dispatch(action.delete(id)),
  };
};
export class Code extends CommonEntity {
  constructor(
    public code?: string,
    public type?: string,
    public name?: string,
    public description?: string,
    public createdAt?: string,
    public updatedAt?: string,
    public item?: CodeType,
    public users?: User[],
  ) {
    super();
  }
}
