import { createSlice } from '@reduxjs/toolkit';

import {useAppDispatch, useTypedSelector, Action, Slice, State, Parameter} from '@store';
import { CommonEntity, PaginationQuery } from '@models';
import { ContentType } from './type';

const name = 'Content';
const action = new Action<Content>(name);
export const contentSlice = createSlice(new Slice<Content>(action));
export const ContentFacade = () => {
  const dispatch = useAppDispatch();
  return {
    ...useTypedSelector((state) => state[action.name] as State<Content>),
    set: (values: State<Content>) => dispatch(action.set(values)),
    get: (params: PaginationQuery<Content>) => dispatch(action.get(params)),
    getById: ({ id, keyState = 'isVisible', params }: { id: string; keyState?: keyof State<Content>, params?: PaginationQuery<Content> }) =>
      dispatch(action.getById({ id, keyState, params })),
    post: (values: Content) => dispatch(action.post(values)),
    put: (values: Content) => dispatch(action.put(values)),
    delete: (id: string) => dispatch(action.delete(id)),
  };
};
export class Content extends CommonEntity {
  constructor(
    public name?: string,
    public type?: string,
    public image?: string,
    public order?: number | null,
    public createdAt?: string,
    public updatedAt?: string,
    public item?: ContentType,
    public languages?: {
      id: string;
      language?: string;
      name: string;
      description?: string;
      position?: string;
      content?: string;
      dataId?: string;
      createdAt?: string;
      updatedAt?: string;
    }[],
  ) {
    super();
  }
}
