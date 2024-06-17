import { createSlice } from '@reduxjs/toolkit';

import { useAppDispatch, useTypedSelector, Action, Slice, State } from '@/services';
import { ICommonEntity, IPaginationQuery } from '@/types';
import { IContentType } from './type';

const name = 'Content';
const action = new Action<IContent>(name);
export const contentSlice = createSlice(new Slice<IContent>(action));
export const SContent = () => {
  const dispatch = useAppDispatch();
  return {
    ...useTypedSelector(state => state[action.name] as State<IContent>),
    set: (values: State<IContent>) => dispatch(action.set(values)),
    get: (params: IPaginationQuery<IContent>) => dispatch(action.get(params)),
    getById: ({
      id,
      keyState = 'isVisible',
      params,
    }: {
      id: string;
      keyState?: keyof State<IContent>;
      params?: IPaginationQuery<IContent>;
    }) => dispatch(action.getById({ id, keyState, params })),
    post: (values: IContent) => dispatch(action.post(values)),
    put: (values: IContent) => dispatch(action.put(values)),
    delete: (id: string) => dispatch(action.delete(id)),
  };
};
export interface IContent extends ICommonEntity {
  name?: string;
  type?: string;
  image?: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
  item?: IContentType;
  languages?: {
    id: string;
    language?: string;
    name: string;
    description?: string;
    position?: string;
    content?: string;
    dataId?: string;
    createdAt?: string;
    updatedAt?: string;
  }[];
}
