import { EStatusState } from '@/enums';
import type { IResponses } from '@/types';

export const nameCrud = 'crud';
export interface StateCrud<T = object, Y = object> {
  result?: IResponses<T[]>;
  data?: T;
  isLoading?: boolean;
  isVisible?: boolean;
  status?: EStatusState;
  queryParams?: string;
  keepUnusedDataFor?: number;
  time?: number;

  resultType?: IResponses<Y[]>;
  dataType?: Y;
  isLoadingType?: boolean;
  isVisibleType?: boolean;
  statusType?: EStatusState;
  queryParamsType?: string;
  keepUnusedDataForType?: number;
  timeType?: number;
}

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
