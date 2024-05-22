import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

import { EStatusState } from '@/enums';
import { ICommonEntity, IPaginationQuery, IResponses } from '@/interfaces';
import { Message } from '@/library/message';
import { State } from '@/services';
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
      async (params: IPaginationQuery<T>) => await API.get(`${routerLinks(name, 'api')}`, params),
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
        const { data } = await API.get<T>(`${routerLinks(name, 'api')}/${id}`, params);
        return { data, keyState };
      },
    );
    this.post = createAsyncThunk(name + '/post', async (values: T) => {
      const { data, message } = await API.post<T>(`${routerLinks(name, 'api')}`, values);
      if (message) await Message.success({ text: message });
      return data;
    });
    this.put = createAsyncThunk(name + '/put', async ({ id, ...values }: T) => {
      const { data, message } = await API.put<T>(`${routerLinks(name, 'api')}/${id}`, values);
      if (message) await Message.success({ text: message });
      return data;
    });
    this.delete = createAsyncThunk(name + '/delete', async (id: string) => {
      const { data, message } = await API.delete<T>(`${routerLinks(name, 'api')}/${id}`);
      if (message) await Message.success({ text: message });
      return data;
    });
  }
}
