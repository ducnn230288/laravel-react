import { createSlice } from '@reduxjs/toolkit';
import { CommonEntity, PaginationQuery } from '@/models';
import { useAppDispatch, useTypedSelector, Action, Slice, State } from '@/services';

import { Content } from '../index';

const name = 'ContentType';
const action = new Action<ContentType>(name);
export const contentTypeSlice = createSlice(new Slice<ContentType>(action, { keepUnusedDataFor: 9999 }));
export const ContentTypeService = () => {
  const dispatch = useAppDispatch();
  return {
    ...useTypedSelector((state) => state[action.name] as State<ContentType>),
    set: (values: State<ContentType>) => dispatch(action.set(values)),
    get: (params: PaginationQuery<ContentType>) => dispatch(action.get(params)),
    getById: ({
      id,
      keyState = 'isVisible',
      params,
    }: {
      id: string;
      keyState?: keyof State<ContentType>;
      params?: PaginationQuery<ContentType>;
    }) => dispatch(action.getById({ id, keyState, params })),
    post: (values: ContentType) => dispatch(action.post(values)),
    put: (values: ContentType) => dispatch(action.put(values)),
    delete: (id: string) => dispatch(action.delete(id)),
  };
};

export class ContentType extends CommonEntity {
  constructor(
    public name: string,
    public code: string,
    public isPrimary?: boolean,
    public createdAt?: string,
    public updatedAt?: string,
    public items?: Content[],
  ) {
    super();
  }
}
