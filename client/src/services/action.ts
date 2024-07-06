import { createAsyncThunk, type AsyncThunk } from '@reduxjs/toolkit';

import type { EStatusState } from '@/enums';
import type { State } from '@/services/index';
import type { ICommonEntity, IPaginationQuery, IResponses } from '@/types';
import { API, routerLinks } from '@/utils';

export class Action<T extends ICommonEntity, Y = EStatusState> {
  public name: string;
  public set: AsyncThunk<State<T, Y>, State<T, Y>, object>;
  public get: AsyncThunk<IResponses<T[]>, IPaginationQuery<T>, object>;
  public getById: AsyncThunk<
    { data: T | undefined; keyState: keyof State<T, Y> },
    { id: string; keyState: keyof State<T, Y>; params?: IPaginationQuery<T> },
    object
  >;
  public post: AsyncThunk<T | undefined, T, object>;
  public put: AsyncThunk<T | undefined, T, object>;
  public delete: AsyncThunk<T | undefined, string, object>;
  constructor(name: string) {
    this.name = name;
    this.set = createAsyncThunk(name + '/set', async (values: State<T, Y>) => values);
    this.get = createAsyncThunk(
      name + '/get',
      async (params: IPaginationQuery<T>) => await API.get({ url: `${routerLinks(name, 'api')}`, params }),
    );
    this.getById = createAsyncThunk(
      name + '/getById',
      async ({
        id,
        keyState = 'isVisible',
        params,
      }: {
        id: string;
        keyState: keyof State<T, Y>;
        params?: IPaginationQuery<T>;
      }) => {
        const { data } = await API.get<T>({ url: `${routerLinks(name, 'api')}/${id}`, params });
        return { data, keyState };
      },
    );
    this.post = createAsyncThunk(name + '/post', async (values: T) => {
      const { data } = await API.post<T>({ url: `${routerLinks(name, 'api')}`, values });
      return data;
    });
    this.put = createAsyncThunk(name + '/put', async ({ id, ...values }: T) => {
      const { data } = await API.put<T>({ url: `${routerLinks(name, 'api')}/${id}`, values });
      return data;
    });
    this.delete = createAsyncThunk(name + '/delete', async (id: string) => {
      const { data } = await API.delete<T>({ url: `${routerLinks(name, 'api')}/${id}` });
      return data;
    });
  }
}
