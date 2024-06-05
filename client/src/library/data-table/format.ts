import { TFunction } from 'i18next';

import { ETableFilterType } from '@/enums';
import { IDataTable, IPaginationQuery } from '@/interfaces';
import { getColumnSearchCheckbox, getColumnSearchDate, getColumnSearchInput, getColumnSearchRadio } from './filter';
import { FilterValue } from 'antd/lib/table/interface';

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
    .filter((col) => !!col && !!col.tableItem)
    .map((col) => {
      let item = col.tableItem;
      if (item?.filter) {
        const like = params?.like as any;
        if (like && col.name && like[col.name]) item = { ...item, defaultFilteredValue: like[col.name] };

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
        item.onCell = (record) => ({
          className: record?.id && record?.id === facade?.data?.id ? '!bg-teal-100' : '',
        });
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
