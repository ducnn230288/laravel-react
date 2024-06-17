import { createSlice } from '@reduxjs/toolkit';
import { ICommonEntity, IPaginationQuery } from '@/types';
import { useAppDispatch, useTypedSelector, Action, Slice, State } from '@/services';

import { IContent } from '../index';

const name = 'ContentType';
const action = new Action<IContentType>(name);
export const contentTypeSlice = createSlice(new Slice<IContentType>(action, { keepUnusedDataFor: 9999 }));
export const SContentType = () => {
  const dispatch = useAppDispatch();
  return {
    ...useTypedSelector(state => state[action.name] as State<IContentType>),
    set: (values: State<IContentType>) => dispatch(action.set(values)),
    get: (params: IPaginationQuery<IContentType>) => dispatch(action.get(params)),
    getById: ({
      id,
      keyState = 'isVisible',
      params,
    }: {
      id: string;
      keyState?: keyof State<IContentType>;
      params?: IPaginationQuery<IContentType>;
    }) => dispatch(action.getById({ id, keyState, params })),
    post: (values: IContentType) => dispatch(action.post(values)),
    put: (values: IContentType) => dispatch(action.put(values)),
    delete: (id: string) => dispatch(action.delete(id)),
  };
};

export interface IContentType extends ICommonEntity {
  name: string;
  code: string;
  isPrimary?: boolean;
  createdAt?: string;
  updatedAt?: string;
  items?: IContent[];
}
