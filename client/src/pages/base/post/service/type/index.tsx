import { createSlice } from '@reduxjs/toolkit';

import { useAppDispatch, useTypedSelector, Action, Slice, State } from '@/services';
import { CommonEntity, PaginationQuery } from '@/models';
import { Post } from '../index';

const name = 'PostType';
const action = new Action<PostType>(name);
export const postTypeSlice = createSlice(new Slice<PostType>(action, { keepUnusedDataFor: 9999 }));
export const PostTypeService = () => {
  const dispatch = useAppDispatch();
  return {
    ...useTypedSelector((state) => state[action.name] as State<PostType>),
    set: (values: State<PostType>) => dispatch(action.set(values)),
    get: (params: PaginationQueryPostType) => dispatch(action.get(params)),
    getById: ({
      id,
      keyState = 'isVisible',
      params,
    }: {
      id: string;
      keyState?: keyof State<PostType>;
      params?: PaginationQuery<PostType>;
    }) => dispatch(action.getById({ id, keyState, params })),
    post: (values: PostType) => dispatch(action.post(values)),
    put: (values: PostType) => dispatch(action.put(values)),
    delete: (id: string) => dispatch(action.delete(id)),
  };
};
export class PostType extends CommonEntity {
  constructor(
    public name: string,
    public code: string,
    public description: string,
    public postTypeId: string,
    public createdAt?: string,
    public updatedAt?: string,
    public items?: Post[],
    public children?: PostType[],
  ) {
    super();
  }
}
interface PaginationQueryPostType extends PaginationQuery<PostType> {
  postTypeId?: string;
}
