import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useTypedSelector, Action, Slice, State } from '@store';

import { CommonEntity, EStatusState, PaginationQuery } from '@models';
import { API, mapTreeObject, routerLinks } from '@utils';
import { Post } from '../';

const name = 'PostType';
const action = new Action<PostType>(name);
export const postTypeSlice = createSlice(
  new Slice<PostType>(action, { keepUnusedDataFor: 9999 })
);
export const PostTypeFacade = () => {
  const dispatch = useAppDispatch();
  return {
    ...useTypedSelector((state) => state[action.name] as State<PostType>),
    set: (values: State<PostType>) => dispatch(action.set(values)),
    get: (params: PaginationQueryPostType) => dispatch(action.get(params)),
    getById: ({ id, keyState = 'isVisible' }: { id: string; keyState?: keyof State<PostType> }) =>
      dispatch(action.getById({ id, keyState })),
    post: (values: PostType) => dispatch(action.post(values)),
    put: (values: PostType) => dispatch(action.put(values)),
    putDisable: (values: { id: string; disable: boolean }) => dispatch(action.putDisable(values)),
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
interface PaginationQueryPostType extends PaginationQuery<PostType>{
  postTypeId?: string;
}
