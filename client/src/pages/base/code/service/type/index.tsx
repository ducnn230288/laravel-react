import { createSlice } from '@reduxjs/toolkit';

import { useAppDispatch, useTypedSelector, Action, Slice, State } from '@/services';
import { ICommonEntity, IPaginationQuery } from '@/interfaces';
import { ICode } from '../index';

const name = 'CodeType';
const action = new Action<ICodeType>(name);
export const codeTypeSlice = createSlice(new Slice<ICodeType>(action, { keepUnusedDataFor: 9999 }));
export const CodeTypeService = () => {
  const dispatch = useAppDispatch();
  return {
    ...(useTypedSelector((state) => state[action.name]) as State<ICodeType>),
    set: (values: State<ICodeType>) => dispatch(action.set(values)),
    get: (params: IPaginationQuery<ICodeType>) => dispatch(action.get(params)),
    getById: ({
      id,
      keyState = 'isVisible',
      params,
    }: {
      id: string;
      keyState?: keyof State<ICodeType>;
      params?: IPaginationQuery<ICodeType>;
    }) => dispatch(action.getById({ id, keyState, params })),
    post: (values: ICodeType) => dispatch(action.post(values)),
    put: (values: ICodeType) => dispatch(action.put(values)),
    delete: (id: string) => dispatch(action.delete(id)),
  };
};
export interface ICodeType extends ICommonEntity {
  name: string;
  code: string;
  isPrimary: boolean;
  createdAt?: string;
  updatedAt?: string;
  items?: ICode[];
}
