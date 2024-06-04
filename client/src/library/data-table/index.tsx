import React, { Ref, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { CheckboxOptionType, Table } from 'antd';
import { SorterResult } from 'antd/lib/table/interface';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import classNames from 'classnames';
import { DndContext, useDraggable } from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import queryString from 'query-string';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { ETableFilterType } from '@/enums';
import { IDataTable, IPaginationQuery, ITableRefObject } from '@/interfaces';
import { cleanObjectKeyNull, getSizePageByHeight, uuidv4 } from '@/utils';
import { Search, Times } from '@/assets/svg';

import { Mask } from '../form/input';
import { Pagination } from '../pagination';
import { getColumnSearchCheckbox, getColumnSearchDate, getColumnSearchInput, getColumnSearchRadio } from './filter';

export const DataTable = forwardRef(
  (
    {
      columns = [],
      summary,
      id,
      showList = true,
      footer,
      defaultRequest = {
        page: 1,
        perPage: 1,
      },
      showPagination = true,
      leftHeader,
      rightHeader,
      showSearch = true,
      save = true,
      searchPlaceholder,
      subHeader,
      xScroll = 1000,
      yScroll,
      emptyText = 'No Data',
      onRow,
      pageSizeOptions = [],
      pageSizeRender = (sizePage: number) => sizePage,
      pageSizeWidth = '50px',
      paginationDescription = (from: number, to: number, total: number) => from + '-' + to + ' of ' + total + ' items',
      idElement = 'temp-' + uuidv4(),
      className = 'data-table',
      facade = {},
      data,
      formatData = (data) => data,
      ...prop
    }: Type,
    ref: Ref<ITableRefObject>,
  ) => {
    useImperativeHandle(ref, () => ({
      onChange,
    }));
    const navigate = useNavigate();
    const idTable = useRef(idElement);
    const timeoutSearch = useRef<ReturnType<typeof setTimeout>>();
    const cols = useRef<IDataTable[]>();
    const refPageSizeOptions = useRef<number[]>();
    const { result, isLoading, queryParams, time } = facade;
    const params = useRef(
      save && location.search && location.search.indexOf('=') > -1
        ? { ...defaultRequest, ...queryString.parse(location.search, { arrayFormat: 'index' }) }
        : defaultRequest,
    );
    const tableRef = useRef<HTMLDivElement>(null);

    const scroll = useRef<{ x?: number; y?: number }>({ x: xScroll, y: yScroll });
    useEffect(() => {
      if (!pageSizeOptions?.length) {
        if (params.current?.perPage === 1) params.current.perPage = getSizePageByHeight();
        else if (params.current.perPage! < 5) params.current.perPage = 5;
        else params.current.perPage = 10;
        const { perPage } = params.current;
        refPageSizeOptions.current = [perPage, perPage * 2, perPage * 3, perPage * 4, perPage * 5];
      } else refPageSizeOptions.current = pageSizeOptions;
      params.current = cleanObjectKeyNull({
        ...params.current,
        sort: Object.entries(params.current.sort ?? {})
          .filter(([, value]) => !!value)
          .map(([key, value]) => `${key},${value}`)
          .join(''),
        like: Object.entries(params.current.like ?? {})
          .filter(([, value]) => !!value)
          .map(([key, value]) => `${key},${value}`),
      });
      if (facade) {
        if (!result?.data || new Date().getTime() > time || JSON.stringify(params.current) != queryParams) {
          onChange(params.current, false);
        }
      }
      if (!scroll.current.x) {
        scroll.current.x = 0;
        columns.forEach((item) => {
          if (item.tableItem) {
            scroll.current.x! += item.tableItem?.width ?? 150;
          }
        });
      }
    }, []);

    useEffect(() => {
      if (data?.length || result?.data?.length)
        setTimeout(() => {
          const table = tableRef.current?.querySelector('table');
          const cols = tableRef.current?.querySelectorAll('col');
          const widthTable = tableRef.current!.clientWidth - 1;
          if (parseInt(table!.style.width.replace('px', '')) - widthTable < 100) table!.style.width = widthTable + 'px';
          let totalWidth = 0;
          let number = 0;
          cols?.forEach((i) => {
            if (i.style.width) totalWidth += parseInt(i.style.width.replace('px', ''));
            if (!i.style.width) number += 1;
          });
          cols?.forEach((i) => {
            if (!i.style.width) i.style.width = (widthTable - totalWidth) / number + 'px';
          });
        }, 10);
    }, [data, result?.data, facade.status]);

    const onChange = (request?: IPaginationQuery, changeNavigate = true) => {
      if (request) {
        params.current = { ...request };
        if (save) {
          changeNavigate &&
            navigate(location.pathname.substring(1) + '?' + queryString.stringify(request, { arrayFormat: 'index' }));
        }
      }
      if (showList && facade?.get) facade?.get(request);
    };

    if (params.current.like && Array.isArray(params.current.like)) {
      const like: Record<string, any> = {};
      params.current.like.forEach((item) => (like[item.split(',')[0] || ''] = item.split(',')[1]));
      params.current.like = like;
    }
    if (params.current.sort && typeof params.current.sort === 'string')
      params.current.sort = { [params.current.sort.split(',')[0]]: params.current.sort.split(',')[1] };

    const { t } = useTranslation('locale', { keyPrefix: 'library' });
    const valueFilter = useRef<{ [selector: string]: boolean }>({});
    const typeKeys = useRef<Record<string, string>>({});
    cols.current = columns
      .filter((col) => !!col && !!col.tableItem)
      .map((col) => {
        let item = col.tableItem;
        if (item?.filter) {
          const like = params.current?.like as any;
          if (like && col.name && like[col.name]) item = { ...item, defaultFilteredValue: like[col.name] };

          switch (item?.filter?.type) {
            case ETableFilterType.radio:
              typeKeys.current[col.name!] = 'radio';
              item = {
                ...item,
                ...getColumnSearchRadio({
                  filters: item.filter.list as CheckboxOptionType[],
                  key: col.name!,
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
                  filters: item.filter.list as CheckboxOptionType[],
                  key: col.name!,
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
        const sort = params.current?.sort as any;
        if (item?.sorter && sort && col.name && sort[col.name])
          item.defaultSortOrder = sort[col.name] === 'asc' ? 'ascend' : 'descend';
        if (item && !item?.onCell)
          item.onCell = (record) => ({
            className: record?.id && record?.id === (id || facade?.data?.id) ? '!bg-teal-100' : '',
          });
        return {
          title: col.title,
          dataIndex: col.name,
          ellipsis: true,
          ...item,
        };
      });
    const formatFilter = (filters = {}) => {
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

    const handleTableChange = (
      pagination?: { page?: number; perPage?: number },
      filters = {},
      sort?: SorterResult<any>,
      tempFullTextSearch?: string,
    ) => {
      let tempPageIndex = pagination?.page ?? params.current.page;
      const tempPageSize = pagination?.perPage ?? params.current.perPage;

      let tempSort = {};
      if (!!sort && !!sort.field && !!sort.order) {
        tempSort = { [sort.field as string]: sort.order === 'ascend' ? 'asc' : 'desc' };
      }

      if (tempFullTextSearch !== params.current.fullTextSearch) tempPageIndex = 1;

      const tempParams = cleanObjectKeyNull({
        ...params.current,
        ...formatFilter(filters),
        page: tempPageIndex,
        perPage: tempPageSize,
        sort: Object.entries(tempSort)
          .filter(([, value]) => !!value)
          .map(([key, value]) => `${key},${value}`)
          .join(''),
        fullTextSearch: tempFullTextSearch,
      });
      onChange && onChange(tempParams);
    };

    if (!data) data = result?.data;
    const loopData = (array?: any[]): any[] =>
      array
        ? formatData(array).map((item) => ({
            ...item,
            key: item.id || uuidv4(),
            children: item.children && loopData(item.children),
          }))
        : [];
    let indexLeft: number;
    let left: any;
    let wLeft: number;
    let table: HTMLTableElement;
    let wTable: number;
    const componentsCell = ({ children, ...restProps }: { children: React.ReactNode; title?: string }) => (
      <th {...restProps}>
        {children}
        <Draggable id={restProps?.title} />
      </th>
    );
    return (
      <div ref={tableRef} className={classNames(className)}>
        {(!!showSearch || !!leftHeader || !!rightHeader) && (
          <div className="mb-2.5 flex-wrap justify-between gap-y-2.5 lg:flex">
            {showSearch ? (
              <div className="relative">
                <Mask
                  className={'h-10 pl-8'}
                  id={idTable.current + '_input_search'}
                  value={params.current.fullTextSearch}
                  placeholder={searchPlaceholder ?? t('Search')}
                  onChange={() => {
                    clearTimeout(timeoutSearch.current);
                    timeoutSearch.current = setTimeout(
                      () =>
                        handleTableChange(
                          undefined,
                          params.current.like,
                          params.current.sort as SorterResult<any>,
                          (document.getElementById(idTable.current + '_input_search') as HTMLInputElement).value.trim(),
                        ),
                      500,
                    );
                  }}
                  onPressEnter={() =>
                    handleTableChange(
                      undefined,
                      params.current.like,
                      params.current.sort as SorterResult<any>,
                      (document.getElementById(idTable.current + '_input_search') as HTMLInputElement).value.trim(),
                    )
                  }
                />
                {!params.current.fullTextSearch ? (
                  <Search
                    className="absolute left-2.5 top-2 z-10 my-1 size-3.5 fill-gray-500 text-lg"
                    onClick={() => {
                      if (params.current.fullTextSearch) {
                        (document.getElementById(idTable.current + '_input_search') as HTMLInputElement).value = '';
                        handleTableChange(undefined, params.current.like, params.current.sort as SorterResult<any>, '');
                      }
                    }}
                  />
                ) : (
                  !!params.current.fullTextSearch && (
                    <Times
                      className="absolute right-3 top-2 z-10 my-1 size-3.5 fill-gray-500 text-lg"
                      onClick={() => {
                        if (params.current.fullTextSearch) {
                          (document.getElementById(idTable.current + '_input_search') as HTMLInputElement).value = '';
                          handleTableChange(
                            undefined,
                            params.current.like,
                            params.current.sort as SorterResult<any>,
                            '',
                          );
                        }
                      }}
                    />
                  )
                )}
              </div>
            ) : (
              <div />
            )}
            {!!leftHeader && <div className={'mt-2 sm:mt-0'}>{leftHeader}</div>}
            {!!rightHeader && <div className={'mt-2 sm:mt-0'}>{rightHeader}</div>}
          </div>
        )}
        {subHeader && !!result?.meta?.total && subHeader(result?.meta?.total)}
        {!!showList && (
          <DndContext
            modifiers={[restrictToHorizontalAxis]}
            onDragMove={({ activatorEvent, delta }) => {
              if (!left) {
                left = (activatorEvent.target as HTMLSpanElement)?.closest('th');
                const th = Array.prototype.slice.call(tableRef.current?.querySelectorAll('thead > tr > th'));
                indexLeft = th.indexOf(left) + 1;
                left = tableRef.current!.querySelector('col:nth-of-type(' + indexLeft + ')')!;
                wLeft = parseFloat(left.style.width);
                table = tableRef.current!.querySelector('table')!;
                wTable = parseFloat(table!.style.width);
              }
              left = tableRef.current!.querySelector('col:nth-of-type(' + indexLeft + ')')!;
              const p = delta.x * 0.6;
              left.style.width = wLeft + p + 'px';
              left.style.minWidth = wLeft + p + 'px';
              table!.style.width = wTable + p + 'px';
            }}
            onDragEnd={() => (left = undefined)}
          >
            <Table
              onRow={onRow}
              components={{
                header: {
                  cell: componentsCell,
                },
              }}
              locale={{
                emptyText:
                  typeof emptyText === 'string' ? (
                    <div className="bg-gray-100 py-4 text-gray-400">{t(emptyText)}</div>
                  ) : (
                    emptyText
                  ),
              }}
              loading={isLoading}
              columns={cols.current}
              summary={summary}
              pagination={false}
              dataSource={loopData(data)}
              onChange={(_, filters, sort) => {
                return handleTableChange(undefined, filters, sort as SorterResult<any>, params.current.fullTextSearch);
              }}
              scroll={scroll.current}
              size="small"
              {...prop}
            />
            {refPageSizeOptions.current && showPagination && (
              <Pagination
                total={result?.meta?.total}
                page={params.current.page!}
                perPage={params.current.perPage!}
                pageSizeOptions={refPageSizeOptions.current}
                pageSizeRender={pageSizeRender}
                pageSizeWidth={pageSizeWidth}
                queryParams={(pagination: { page?: number; perPage?: number }) =>
                  handleTableChange(
                    pagination,
                    params.current.like,
                    params.current.sort as SorterResult<any>,
                    params.current.fullTextSearch,
                  )
                }
                paginationDescription={paginationDescription}
                idElement={idTable.current}
                {...prop}
              />
            )}
          </DndContext>
        )}
        {!!footer && <div className="footer">{footer(result)}</div>}
      </div>
    );
  },
);
DataTable.displayName = 'HookTable';
interface Type {
  id?: string;
  columns: IDataTable[];
  summary?: (data: any) => any;
  showList?: boolean;
  footer?: (result: any) => any;
  defaultRequest?: IPaginationQuery;
  showPagination?: boolean;
  leftHeader?: JSX.Element;
  rightHeader?: JSX.Element | boolean;
  showSearch?: boolean;
  save?: boolean;
  searchPlaceholder?: string;
  subHeader?: (count: number) => any;
  xScroll?: number;
  yScroll?: number;
  emptyText?: any;
  onRow?: (data: any) => { onDoubleClick?: () => void; onClick?: () => void };
  pageSizeOptions?: number[];
  pageSizeRender?: (sizePage: number) => number | string;
  pageSizeWidth?: string;
  paginationDescription?: (from: number, to: number, total: number) => string;
  idElement?: string;
  className?: string;
  facade?: any;
  data?: any[];
  formatData?: (data: any) => any[];
}
const Draggable = (props: any) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: props.id });
  return (
    <span
      className={'absolute right-0 top-0 z-50 h-full w-1 cursor-col-resize opacity-0'}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    />
  );
};
