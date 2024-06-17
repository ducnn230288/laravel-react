import { createSlice } from '@reduxjs/toolkit';

import { useAppDispatch, useTypedSelector, Action, Slice, State } from '@/services';
import { ICommonEntity, IPaginationQuery } from '@/types';
import { IPostType } from './type';

const name = 'Post';
const action = new Action<IPost>(name);
export const postSlice = createSlice(new Slice<IPost>(action));
export const SPost = () => {
  const dispatch = useAppDispatch();
  return {
    ...useTypedSelector(state => state[action.name] as State<IPost>),
    set: (values: State<IPost>) => dispatch(action.set(values)),
    get: (params: IPaginationQuery<IPost>) => dispatch(action.get(params)),
    getById: ({
      id,
      keyState = 'isVisible',
      params,
    }: {
      id: string;
      keyState?: keyof State<IPost>;
      params?: IPaginationQuery<IPost>;
    }) => dispatch(action.getById({ id, keyState, params })),
    post: (values: IPost) => dispatch(action.post(values)),
    put: (values: IPost) => dispatch(action.put(values)),
    delete: (id: string) => dispatch(action.delete(id)),
  };
};
export interface IPost extends ICommonEntity {
  type?: string;
  thumbnailUrl?: string;
  item?: IPostType;
  languages?: {
    language?: string;
    name: string;
    description?: string;
    slug: string;
    content?: string;
    postId?: string;
    post?: IPost;
  }[];
}
