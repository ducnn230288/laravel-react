import { EStatusState } from '@/enums';
import type { CurdState } from './reducer';
import type { CurdTypeState } from './reducer-type';

export const nameCrud = 'crud';
export interface StateCrud<T = object, Y = object> extends CurdState<T>, CurdTypeState<Y> {}

export const initialStateCrud: StateCrud = {
  result: undefined,
  data: undefined,
  isLoading: false,
  isVisible: false,
  status: EStatusState.idle,
  queryParams: undefined,
  keepUnusedDataFor: 60,
  time: 0,

  resultType: undefined,
  dataType: undefined,
  isLoadingType: false,
  isVisibleType: false,
  statusType: EStatusState.idle,
  queryParamsType: undefined,
  keepUnusedDataForType: 60,
  timeType: 0,
};
