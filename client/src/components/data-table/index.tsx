import { useDraggable } from '@dnd-kit/core';
import { Popconfirm, Table } from 'antd';
import type { ColumnsType, SorterResult, TableRowSelection } from 'antd/lib/table/interface';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import queryString from 'query-string';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, type Ref } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { NavigationType, useLocation, useNavigationType } from 'react-router-dom';
dayjs.extend(utc);

import type { IDataTable, IPaginationQuery, ITableRefObject } from '@/types';
import { cleanObjectKeyNull, getSizePageByHeight, isNumeric, uuidv4 } from '@/utils';
import CPagination from '../pagination';

import { ETableAlign } from '@/enums';
import { CButton } from '../button';
import { CSvgIcon } from '../svg-icon';
import { CTooltip } from '../tooltip';
import { CTableDrag } from './drag';
import { formatColumns, formatFilter } from './format';
import { CSearch } from './search';

export const CDataTable = forwardRef(
  (
    {
      columns = [],
      defaultRequest = {},
      rightHeader,
      leftHeader,
      save = true,
      paginationDescription = (from: number, to: number, total: number) => from + '-' + to + ' of ' + total + ' items',
      facade = {},
      data,
      formatData = data => data,
      showPagination = true,
      showSearch = true,
      onRow,
      isLoading,
      action,
      ...props
    }: Type,
    ref: Ref<ITableRefObject>,
  ) => {
    useImperativeHandle(ref, () => ({ onChange, handleTableChange, params }));

    const location = useLocation();
    const refPageSizeOptions = useRef<number[]>();

    const handleFormatParams = (save: boolean) => {
      const queryParams =
        save && location.search && location.search.indexOf('=') > -1
          ? { ...defaultRequest, ...queryString.parse(location.search, { arrayFormat: 'index' }) }
          : { ...defaultRequest };
      if (queryParams.like && Array.isArray(queryParams.like)) {
        const like: Record<string, any> = {};
        queryParams.like.forEach(item => (like[item.split(',')[0] || ''] = item.split(',')[1]));
        queryParams.like = like;
      }
      if (queryParams.between && Array.isArray(queryParams.between)) {
        const arrayIn: Record<string, any> = {};
        queryParams.between.forEach(
          item =>
            (arrayIn[item.split(',')[0] || ''] = item
              .split(',')
              .splice(1)
              .map(i => (isNumeric(i) ? parseInt(i) : i))),
        );
        queryParams.between = arrayIn;
      }

      if (queryParams.in && Array.isArray(queryParams.in)) {
        const arrayIn: Record<string, any> = {};
        queryParams.in.forEach(
          item =>
            (arrayIn[item.split(',')[0] || ''] = item
              .split(',')
              .splice(1)
              .map(i => (isNumeric(i) ? parseInt(i) : i))),
        );
        queryParams.in = arrayIn;
      }
      if (queryParams.sort && typeof queryParams.sort === 'string')
        queryParams.sort = { [queryParams.sort.split(',')[0]]: queryParams.sort.split(',')[1] };
      return queryParams;
    };
    const params = useRef(handleFormatParams(save));

    const navigationType = useNavigationType();
    const initialRender = React.useRef(false);
    useEffect(() => {
      if (initialRender.current && navigationType === NavigationType.Pop) {
        onChange(handleFormatParams(save), false);
      }
    }, [location, navigationType]);

    const scroll = useRef<{ x?: number; y?: number }>({ x: undefined, y: undefined });
    useEffect(() => {
      if (columns.length > 1) {
        if (!params.current?.perPage) params.current.perPage = getSizePageByHeight();
        else if (params.current.perPage < 5) params.current.perPage = 5;
        else params.current.perPage = 10;
        const { perPage } = params.current;
        refPageSizeOptions.current = [perPage, perPage * 2, perPage * 3, perPage * 4, perPage * 5];
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
        if (facade || new Date().getTime() > facade.time || JSON.stringify(params.current) != facade.queryParams) {
          onChange(params.current, false);
        }
        if (!scroll.current.x) {
          scroll.current.x = 0;
          columns.forEach(item => {
            if (item.tableItem) {
              scroll.current.x! += item.tableItem?.width ?? 150;
            }
          });
        }
        initialRender.current = true;
      }
    }, []);

    const tableRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (data?.length || facade.result?.data?.length)
        setTimeout(() => {
          const table = tableRef.current?.querySelector('table');
          const cols = tableRef.current?.querySelectorAll('col');
          const widthTable = tableRef.current!.clientWidth - 1;
          if (parseInt(table!.style.width.replace('px', '')) - widthTable < 100) table!.style.width = widthTable + 'px';
          let totalWidth = 0;
          let number = 0;
          cols?.forEach(i => {
            if (i.style.width) totalWidth += parseInt(i.style.width.replace('px', ''));
            if (!i.style.width) number += 1;
          });
          cols?.forEach(i => {
            if (!i.style.width) i.style.width = (widthTable - totalWidth) / number + 'px';
          });
        }, 10);
    }, [data, facade.result?.data, facade.status]);

    const { t } = useTranslation('locale', { keyPrefix: 'library' });
    const valueFilter = useRef<{ [selector: string]: boolean }>({});
    const typeKeys = useRef<Record<string, string>>({});
    const timeoutSearch = useRef<ReturnType<typeof setTimeout>>();
    if (action?.label) {
      columns.push({
        title: t('Action'),
        tableItem: {
          width: action.width ?? 100,
          fixed: action.fixed ?? 'right',
          align: ETableAlign.center,
          render: (_: string, data) => (
            <div className={'action'}>
              {action?.render?.(data)}
              {!!action.onDisable && (
                <CTooltip
                  title={t(data.isDisable ? 'Disabled' : 'Enabled', {
                    name: action.name(data),
                    label: action.label.toLowerCase(),
                  })}
                >
                  <Popconfirm
                    destroyTooltipOnHide={true}
                    title={t(!data.isDisable ? 'Are you sure want disable?' : 'Are you sure want enable?', {
                      name: action.name(data),
                      label: action.label.toLowerCase(),
                    })}
                    onConfirm={() => action.onDisable({ id: data.code ?? data.id ?? data, isDisable: !data.isDisable })}
                  >
                    <button
                      title={t(data.isDisable ? 'Disabled' : 'Enabled', {
                        name: action.name(data),
                        label: action.label.toLowerCase(),
                      })}
                    >
                      {data.isDisable ? (
                        <CSvgIcon name='disable' className='warning' />
                      ) : (
                        <CSvgIcon name='check' className='success' />
                      )}
                    </button>
                  </Popconfirm>
                </CTooltip>
              )}

              {!!action.onEdit && (
                <CTooltip title={t('Edit', { name: action.name(data), label: action.label.toLowerCase() })}>
                  <button
                    title={t('Edit', { name: action.name(data), label: action.label.toLowerCase() })}
                    onClick={() => action.onEdit({ id: data.code ?? data.id ?? data, params: defaultRequest })}
                  >
                    <CSvgIcon name='edit' className='primary' />
                  </button>
                </CTooltip>
              )}

              {!!action.onDelete && (
                <CTooltip title={t('Delete', { name: action.name(data), label: action.label.toLowerCase() })}>
                  <Popconfirm
                    destroyTooltipOnHide={true}
                    title={t('Are you sure want delete?', {
                      name: action.name(data),
                      label: action.label.toLowerCase(),
                    })}
                    onConfirm={() => action.onDelete(data.code ?? data.id ?? data)}
                  >
                    <button title={t('Delete', { name: action.name(data), label: action.label.toLowerCase() })}>
                      <CSvgIcon name='trash' className='error' />
                    </button>
                  </Popconfirm>
                </CTooltip>
              )}
            </div>
          ),
        },
      });
    }

    const navigate = useNavigate();
    const onChange = (request?: IPaginationQuery, isChangeNavigate = true) => {
      if (request) {
        params.current = { ...request };
        if (save) {
          isChangeNavigate &&
            navigate(location.pathname + '?' + queryString.stringify(request, { arrayFormat: 'index' }));
        }
      }
      if (facade?.get) facade?.get(request);
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
        ...formatFilter({ filters, typeKeys }),
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

    if (!data) data = facade.result?.data;
    const loopData = (array?: any[]): any[] =>
      array
        ? formatData(array).map(item => ({
            ...item,
            key: item?.id || uuidv4(),
            children: item?.children && loopData(item.children),
          }))
        : [];
    const componentsCell = ({ children, ...restProps }: { children: React.ReactNode; title?: string }) => (
      <th {...restProps}>
        {children}
        <Draggable id={restProps?.title} />
      </th>
    );
    const renderHeader = () =>
      (!!showSearch || !!leftHeader || !!rightHeader) && (
        <div className='top-header'>
          {(!!showSearch || !!leftHeader) && (
            <div className='flex gap-2'>
              {showSearch ? (
                <CSearch
                  params={params.current}
                  timeoutSearch={timeoutSearch}
                  t={t}
                  handleTableChange={handleTableChange}
                />
              ) : (
                <div />
              )}
              {leftHeader}
            </div>
          )}

          {(!!rightHeader || !!action?.onAdd) && !!action?.onAdd && (
            <div className={'right'}>
              <CButton
                icon={<CSvgIcon name='plus' size={12} />}
                text={action?.labelAdd}
                onClick={() => action?.onAdd({ data: undefined, isVisible: true })}
              />
              {rightHeader}
            </div>
          )}
        </div>
      );

    const renderPagination = () =>
      refPageSizeOptions.current &&
      showPagination && (
        <CPagination
          total={facade.result?.meta?.total}
          page={params.current.page!}
          perPage={params.current.perPage!}
          pageSizeOptions={refPageSizeOptions.current}
          paginationDescription={paginationDescription}
          queryParams={(pagination: { page?: number; perPage?: number }) =>
            handleTableChange(
              pagination,
              params.current.like,
              params.current.sort as SorterResult<any>,
              params.current.fullTextSearch,
            )
          }
        />
      );

    return (
      <div ref={tableRef} className='data-table'>
        {renderHeader()}

        {columns.length > 1 && (
          <CTableDrag tableRef={tableRef}>
            <Table
              onRow={onRow}
              components={{ header: { cell: componentsCell } }}
              locale={{
                emptyText: <div className='no-data'>{t('No Data')}</div>,
              }}
              loading={isLoading ?? facade.isLoading}
              columns={
                formatColumns({
                  columns,
                  params: params.current,
                  typeKeys,
                  valueFilter,
                  timeoutSearch,
                  t,
                  facade,
                }) as ColumnsType<any>
              }
              pagination={false}
              dataSource={loopData(data)}
              onChange={(_, filters, sort) =>
                handleTableChange(undefined, filters, sort as SorterResult<any>, params.current.fullTextSearch)
              }
              scroll={scroll.current}
              size='small'
              {...props}
            />

            {renderPagination()}
          </CTableDrag>
        )}
      </div>
    );
  },
);
CDataTable.displayName = 'CDataTable';
interface Type {
  columns: IDataTable[];
  defaultRequest?: IPaginationQuery;
  rightHeader?: JSX.Element;
  leftHeader?: JSX.Element;
  save?: boolean;
  paginationDescription?: (from: number, to: number, total: number) => string;
  facade?: any;
  data?: any[];
  formatData?: (data: any) => any[];
  showPagination?: boolean;
  showSearch?: boolean;
  onRow?: (data: any) => { onDoubleClick?: () => void; onClick?: () => void };
  isLoading?: boolean;
  action?: {
    onDisable?: any;
    onEdit?: any;
    onDelete?: any;
    label: any;
    name: any;
    onAdd?: any;
    labelAdd?: any;
    render?: any;
    width?: number;
    fixed?: string;
  };
  rowSelection?: TableRowSelection<any>;
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
