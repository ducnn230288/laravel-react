import { createSlice } from '@reduxjs/toolkit';

import { Action, Slice, useAppDispatch, useTypedSelector, type State } from '@/services';
import type { ICommonEntity, IPaginationQuery } from '@/types';
import type { IPost } from '../index';

const name = 'PostType';
const action = new Action<IPostType>(name);
export const postTypeSlice = createSlice(new Slice<IPostType>(action, { keepUnusedDataFor: 9999 }));
export const SPostType = () => {
  const dispatch = useAppDispatch();
  return {
    ...useTypedSelector(state => state[action.name] as State<IPostType>),
    set: (values: State<IPostType>) => dispatch(action.set(values)),
    get: (params: IPaginationQueryPostType) => dispatch(action.get(params)),
    getById: ({
      id,
      keyState = 'isVisible',
      params,
    }: {
      id: string;
      keyState?: keyof State<IPostType>;
      params?: IPaginationQuery<IPostType>;
    }) => dispatch(action.getById({ id, keyState, params })),
    post: (values: IPostType) => dispatch(action.post(values)),
    put: (values: IPostType) => dispatch(action.put(values)),
    delete: (id: string) => dispatch(action.delete(id)),
  };
};
export interface IPostType extends ICommonEntity {
  name: string;
  code: string;
  description: string;
  postTypeId: string;
  createdAt?: string;
  updatedAt?: string;
  items?: IPost[];
  children?: IPostType[];
}
interface IPaginationQueryPostType extends IPaginationQuery<IPostType> {
  postTypeId?: string;
}
