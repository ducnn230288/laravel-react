import { EStatusState } from '@/enums';
import type { IResponses } from '@/types';

export interface StateCrud<T = object, Y = object> {
  result?: IResponses<T[]>;
  data?: T;
  isLoading?: boolean;
  isVisible?: boolean;
  status?: EStatusState;
  queryParams?: string;
  keepUnusedDataFor?: number;
  time?: number;

  typeResult?: IResponses<Y[]>;
  typeData?: Y;
  typeIsLoading?: boolean;
  typeIsVisible?: boolean;
  typeStatus?: EStatusState;
  typeQueryParams?: string;
  typeKeepUnusedDataFor?: number;
  typeTime?: number;
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

  typeResult: undefined,
  typeData: undefined,
  typeIsLoading: false,
  typeIsVisible: false,
  typeStatus: EStatusState.idle,
  typeQueryParams: undefined,
  typeKeepUnusedDataFor: 60,
  typeTime: 0,
};
