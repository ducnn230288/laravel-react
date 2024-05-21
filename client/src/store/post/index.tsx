import { createSlice } from '@reduxjs/toolkit';

import {useAppDispatch, useTypedSelector, Action, Slice, State, UserRole} from '@store';
import { CommonEntity, PaginationQuery } from '@models';
import { PostType } from './type';

const name = 'Post';
const action = new Action<Post>(name);
export const postSlice = createSlice(new Slice<Post>(action));
export const PostFacade = () => {
  const dispatch = useAppDispatch();
  return {
    ...useTypedSelector((state) => state[action.name] as State<Post>),
    set: (values: State<Post>) => dispatch(action.set(values)),
    get: (params: PaginationQuery<Post>) => dispatch(action.get(params)),
    getById: ({ id, keyState = 'isVisible', params }: { id: string; keyState?: keyof State<Post>, params?: PaginationQuery<Post> }) =>
      dispatch(action.getById({ id, keyState, params })),
    post: (values: Post) => dispatch(action.post(values)),
    put: (values: Post) => dispatch(action.put(values)),
    delete: (id: string) => dispatch(action.delete(id)),
  };
};
export class Post extends CommonEntity {
  constructor(
    public type?: string,
    public thumbnailUrl?: string,
    public item?: PostType,
    public languages?: {
      language?: string;
      name: string;
      description?: string;
      slug: string;
      content?: string;
      postId?: string;
      post?: Post;
    }[],
  ) {
    super();
  }
}
