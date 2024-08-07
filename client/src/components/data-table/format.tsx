import type { FilterValue } from 'antd/lib/table/interface';
import dayjs from 'dayjs';
import type { TFunction } from 'i18next';

import { ETableFilterType } from '@/enums';
import type { IDataTable, IPaginationQuery } from '@/types';

import { FORMAT_DATE } from '@/utils';
import { CTooltip } from '../tooltip';
import { getColumnSearchCheckbox, getColumnSearchDate, getColumnSearchInput, getColumnSearchRadio } from './filter';

export const formatColumns = ({
  columns,
  params,
  typeKeys,
  valueFilter,
  timeoutSearch,
  t,
  facade,
}: {
  columns: IDataTable[];
  params: IPaginationQuery;
  typeKeys: React.MutableRefObject<Record<string, string>>;
  valueFilter: React.MutableRefObject<{ [selector: string]: boolean }>;
  timeoutSearch: React.MutableRefObject<NodeJS.Timeout | undefined>;
  t: TFunction<'locale', 'library'>;
  facade: any;
}) => {
  return columns
    .filter(col => !!col && !!col.tableItem)
    .map(col => {
      let item = col.tableItem;
      if (item?.filter) {
        if (params?.like && col.name && params?.like[col.name])
          item = { ...item, defaultFilteredValue: params?.like[col.name] };
        if (params?.in && col.name && params?.in[col.name])
          item = { ...item, defaultFilteredValue: params?.in[col.name] };
        if (params?.between && col.name && params?.between[col.name])
          item = { ...item, defaultFilteredValue: params?.between[col.name] };

        switch (item?.filter?.type) {
          case ETableFilterType.radio:
            typeKeys.current[col.name!] = 'radio';
            item = {
              ...item,
              ...getColumnSearchRadio({
                key: col.name!,
                list: item.filter.list!,
                get: item.filter.get!,
                valueFilter,
                timeoutSearch,
                t,
              }),
            };
            break;
          case ETableFilterType.checkbox:
            typeKeys.current[col.name!] = 'checkbox';
            item = {
              ...item,
              ...getColumnSearchCheckbox({
                key: col.name!,
                list: item.filter.list!,
                get: item.filter.get!,
                valueFilter,
                timeoutSearch,
                t,
              }),
            };
            break;
          case ETableFilterType.date:
            typeKeys.current[col.name!] = 'date';
            item = { ...item, ...getColumnSearchDate({ key: col.name!, t }) };
            break;
          default:
            typeKeys.current[col.name!] = 'search';
            item = { ...item, ...getColumnSearchInput({ key: col.name!, t }) };
        }
        delete item.filter;
      }
      const sort = params.sort as any;
      if (item?.sorter && sort && col.name && sort[col.name]) {
        item.defaultSortOrder = sort[col.name] === 'asc' ? 'ascend' : 'descend';
      }
      if (item && !item?.onCell) {
        item.onCell = record => ({
          className: record?.id && record?.id === facade?.data?.id ? '!bg-primary/20' : '',
        });
      }
      if (item?.isDateTime) {
        item.render = text => (
          <CTooltip title={dayjs(text).format(FORMAT_DATE + ' HH:mm:ss')}>{dayjs(text).format(FORMAT_DATE)}</CTooltip>
        );
      }
      return {
        title: col.title,
        dataIndex: col.name,
        ellipsis: true,
        ...item,
      };
    });
};

export const formatFilter = ({
  filters = {},
  typeKeys,
}: {
  filters: Record<string, FilterValue | null>;
  typeKeys: React.MutableRefObject<Record<string, string>>;
}) => {
  const data: any = {
    like: [],
    in: [],
    between: [],
  };
  Object.entries(filters || {}).forEach(([key, value]: any) => {
    if (value) {
      switch (typeKeys.current[key]) {
        case ETableFilterType.search:
          data.like.push(`${key},${value}`);
          break;
        case ETableFilterType.date:
          data.between.push(`${key}${value.map((item: string) => ',' + item).join('')}`);
          break;
        case ETableFilterType.radio:
        case ETableFilterType.checkbox:
          data.in.push(`${key}${value.map((item: string) => ',' + item).join('')}`);
          break;
      }
    }
  });
  return data;
};
